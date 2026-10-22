import { DialectWord, Region, Category, QuizQuestion } from '../types';

/**
 * Searches local dictionary for matches.
 * Checks exact match first, then substring match.
 */
export function searchLocalDictionary(
  query: string,
  region: Region,
  direction: 'th_to_dialect' | 'dialect_to_th',
  database: DialectWord[]
): DialectWord | null {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return null;

  const regionWords = database.filter((item) => item.region === region);

  if (direction === 'th_to_dialect') {
    // 1. Exact match on Thai
    const exact = regionWords.find(
      (w) => w.thai.toLowerCase() === cleanQuery || cleanQuery.includes(w.thai.toLowerCase())
    );
    if (exact) return exact;

    // 2. Substring match
    const sub = regionWords.find(
      (w) => w.thai.toLowerCase().includes(cleanQuery)
    );
    if (sub) return sub;

    // 3. Word token matching (e.g. "อยากกินข้าว" -> matches "กิน")
    const wordsInDb = [...regionWords].sort((a, b) => b.thai.length - a.thai.length);
    for (const item of wordsInDb) {
      if (item.thai.length >= 2 && cleanQuery.includes(item.thai)) {
        return item;
      }
    }
  } else {
    // dialect_to_th
    // 1. Exact match on Dialect
    const exact = regionWords.find((w) => {
      const parts = w.dialect.split(/[/,]/).map((p) => p.trim().toLowerCase());
      return parts.some((p) => p === cleanQuery || cleanQuery.includes(p) || p.includes(cleanQuery));
    });
    if (exact) return exact;

    const sub = regionWords.find((w) => w.dialect.toLowerCase().includes(cleanQuery));
    if (sub) return sub;

    // 2. Substring in dialect words
    const wordsInDb = [...regionWords].sort((a, b) => b.dialect.length - a.dialect.length);
    for (const item of wordsInDb) {
      const parts = item.dialect.split(/[/,]/).map((p) => p.trim());
      for (const p of parts) {
        if (p.length >= 2 && cleanQuery.includes(p)) {
          return item;
        }
      }
    }
  }

  return null;
}

/**
 * Filters vocabulary by region, category, search text, and mastery
 */
export function filterWords(
  words: DialectWord[],
  filters: {
    region?: Region | 'all';
    category?: Category | 'all';
    search?: string;
    onlyMastered?: boolean;
    masteredIds?: string[];
  }
): DialectWord[] {
  const { region = 'all', category = 'all', search = '', onlyMastered = false, masteredIds = [] } = filters;
  const q = search.trim().toLowerCase();

  return words.filter((word) => {
    if (region !== 'all' && word.region !== region) return false;
    if (category !== 'all' && word.category !== category) return false;
    if (onlyMastered && !masteredIds.includes(word.id)) return false;
    if (q) {
      const matchThai = word.thai.toLowerCase().includes(q);
      const matchDialect = word.dialect.toLowerCase().includes(q);
      const matchPronun = word.pronunciation.toLowerCase().includes(q);
      const matchExample = word.example.toLowerCase().includes(q);
      if (!matchThai && !matchDialect && !matchPronun && !matchExample) return false;
    }
    return true;
  });
}

/**
 * Generates randomized 4-option quiz questions from vocabulary
 */
export function generateQuizQuestions(
  database: DialectWord[],
  region: Region | 'all' = 'all',
  count: number = 10
): QuizQuestion[] {
  let pool = region === 'all' ? [...database] : database.filter((w) => w.region === region);
  if (pool.length < 4) {
    pool = [...database];
  }

  // Shuffle pool
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledPool.slice(0, Math.min(count, pool.length));

  return selectedWords.map((correctWord, index) => {
    // 50% chance thai_to_dialect vs dialect_to_thai
    const type: 'thai_to_dialect' | 'dialect_to_thai' =
      Math.random() > 0.5 ? 'thai_to_dialect' : 'dialect_to_thai';

    // Pick 3 distractors
    const otherWords = pool.filter((w) => w.id !== correctWord.id);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);
    const distractors = shuffledOthers.slice(0, 3);

    const isThaiToDialect = type === 'thai_to_dialect';

    const options = [
      {
        id: `opt_${correctWord.id}_correct`,
        text: isThaiToDialect ? correctWord.dialect : correctWord.thai,
        isCorrect: true,
      },
      ...distractors.map((d, dIdx) => ({
        id: `opt_${correctWord.id}_dist_${dIdx}`,
        text: isThaiToDialect ? d.dialect : d.thai,
        isCorrect: false,
      })),
    ].sort(() => Math.random() - 0.5);

    const prompt = isThaiToDialect
      ? `คำว่า "${correctWord.thai}" ใน${getRegionLabel(correctWord.region)} ตรงกับคำใด?`
      : `คำว่า "${correctWord.dialect}" (${getRegionLabel(correctWord.region)}) มีความหมายว่าอย่างไร?`;

    return {
      id: `q_${index}_${correctWord.id}`,
      prompt,
      subPrompt: isThaiToDialect
        ? `หมวด: ${getCategoryLabel(correctWord.category)}`
        : `คำอ่าน: ${correctWord.pronunciation}`,
      correctWord,
      options,
      region: correctWord.region,
      type,
    };
  });
}

/**
 * Calculates current streak given last active date and today's date (YYYY-MM-DD)
 */
export function calculateStreak(
  lastActiveDate: string | null | undefined,
  currentStreak: number,
  todayStr: string
): { newStreak: number; updatedDate: string } {
  if (!lastActiveDate) {
    return { newStreak: 1, updatedDate: todayStr };
  }

  if (lastActiveDate === todayStr) {
    return { newStreak: Math.max(1, currentStreak), updatedDate: todayStr };
  }

  // Parse dates
  const [y1, m1, d1] = lastActiveDate.split('-').map(Number);
  const [y2, m2, d2] = todayStr.split('-').map(Number);
  const prevDate = new Date(Date.UTC(y1, m1 - 1, d1));
  const currDate = new Date(Date.UTC(y2, m2 - 1, d2));

  const diffTime = currDate.getTime() - prevDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { newStreak: currentStreak + 1, updatedDate: todayStr };
  } else if (diffDays > 1) {
    return { newStreak: 1, updatedDate: todayStr };
  }

  return { newStreak: currentStreak, updatedDate: todayStr };
}

export function getRegionLabel(region: Region): string {
  switch (region) {
    case 'north':
      return 'ภาษาเหนือ (คำเมือง)';
    case 'isan':
      return 'ภาษาอีสาน';
    case 'south':
      return 'ภาษาใต้';
    default:
      return '';
  }
}

export function getCategoryLabel(category: Category): string {
  switch (category) {
    case 'greeting':
      return 'ทักทาย';
    case 'food':
      return 'อาหาร';
    case 'numbers':
      return 'ตัวเลข';
    case 'family':
      return 'ครอบครัว';
    case 'emotions':
      return 'อารมณ์';
    case 'travel':
      return 'ที่เที่ยว/เดินทาง';
    case 'market':
      return 'ตลาด';
    default:
      return '';
  }
}
