export type Region = 'north' | 'isan' | 'south';

export type Category = 
  | 'greeting' 
  | 'food' 
  | 'numbers' 
  | 'family' 
  | 'emotions' 
  | 'travel' 
  | 'market';

export interface DialectWord {
  id: string;
  region: Region;
  category: Category;
  thai: string;
  dialect: string;
  pronunciation: string;
  example: string;
  exampleThai: string;
  needsVerify?: boolean;
  notes?: string;
}

export interface TranslationResult {
  thai: string;
  dialect: string;
  region: Region;
  pronunciation: string;
  meaning: string;
  example: string;
  exampleThai: string;
  source: 'database' | 'ai';
  confidence?: 'high' | 'medium' | 'low';
  uncertain?: boolean;
  needsVerify?: boolean;
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  subPrompt?: string;
  correctWord: DialectWord;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  region: Region;
  type: 'thai_to_dialect' | 'dialect_to_thai';
}

export interface QuizResultRecord {
  id: string;
  date: string;
  region: string;
  score: number;
  total: number;
  percentage: number;
}

export interface UserProgress {
  masteredIds: string[];
  savedWordIds: string[];
  customSavedWords: DialectWord[];
  quizHistory: QuizResultRecord[];
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
}
