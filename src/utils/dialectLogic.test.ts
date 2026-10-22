import test from 'node:test';
import assert from 'node:assert/strict';
import {
  searchLocalDictionary,
  filterWords,
  generateQuizQuestions,
  calculateStreak,
  getRegionLabel,
} from './dialectLogic';
import { DialectWord } from '../types';

const MOCK_WORDS: DialectWord[] = [
  {
    id: 'n_01',
    region: 'north',
    category: 'food',
    thai: 'กิน',
    dialect: 'กิ๋น',
    pronunciation: 'กิ๋น',
    example: 'ไปกิ๋นข้าว',
    exampleThai: 'ไปกินข้าว',
  },
  {
    id: 'n_02',
    region: 'north',
    category: 'greeting',
    thai: 'พูด',
    dialect: 'อู้',
    pronunciation: 'อู้',
    example: 'อู้กำเมือง',
    exampleThai: 'พูดภาษาเหนือ',
  },
  {
    id: 'e_01',
    region: 'isan',
    category: 'food',
    thai: 'อร่อย',
    dialect: 'แซบ',
    pronunciation: 'แซบ',
    example: 'แซบอีหลี',
    exampleThai: 'อร่อยจริงๆ',
  },
  {
    id: 's_01',
    region: 'south',
    category: 'food',
    thai: 'อร่อย',
    dialect: 'หรอย',
    pronunciation: 'หรอย',
    example: 'หรอยจังฮู้',
    exampleThai: 'อร่อยมากๆ',
  },
];

test('searchLocalDictionary finds exact Thai to dialect match', () => {
  const result = searchLocalDictionary('กิน', 'north', 'th_to_dialect', MOCK_WORDS);
  assert.ok(result);
  assert.equal(result.dialect, 'กิ๋น');
});

test('searchLocalDictionary finds dialect to Thai match', () => {
  const result = searchLocalDictionary('แซบ', 'isan', 'dialect_to_th', MOCK_WORDS);
  assert.ok(result);
  assert.equal(result.thai, 'อร่อย');
});

test('searchLocalDictionary returns null when not found in region', () => {
  const result = searchLocalDictionary('หรอย', 'north', 'dialect_to_th', MOCK_WORDS);
  assert.equal(result, null);
});

test('filterWords filters by category and search term correctly', () => {
  const filtered = filterWords(MOCK_WORDS, { category: 'food' });
  assert.equal(filtered.length, 3);

  const searched = filterWords(MOCK_WORDS, { search: 'อู้' });
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'n_02');
});

test('calculateStreak increments on consecutive day and resets on missed days', () => {
  // Same day
  const sameDay = calculateStreak('2026-10-21', 3, '2026-10-21');
  assert.equal(sameDay.newStreak, 3);

  // Consecutive day
  const nextDay = calculateStreak('2026-10-20', 3, '2026-10-21');
  assert.equal(nextDay.newStreak, 4);

  // Missed days
  const brokenStreak = calculateStreak('2026-10-15', 5, '2026-10-21');
  assert.equal(brokenStreak.newStreak, 1);
});

test('generateQuizQuestions creates valid multiple choice questions', () => {
  const questions = generateQuizQuestions(MOCK_WORDS, 'all', 2);
  assert.equal(questions.length, 2);
  for (const q of questions) {
    assert.ok(q.prompt.length > 0);
    assert.equal(q.options.length, 4);
    const correctCount = q.options.filter((o) => o.isCorrect).length;
    assert.equal(correctCount, 1);
  }
});

test('getRegionLabel returns proper Thai labels', () => {
  assert.equal(getRegionLabel('north'), 'ภาษาเหนือ (คำเมือง)');
  assert.equal(getRegionLabel('isan'), 'ภาษาอีสาน');
  assert.equal(getRegionLabel('south'), 'ภาษาใต้');
});
