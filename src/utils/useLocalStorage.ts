import { useState, useEffect } from 'react';
import { UserProgress, DialectWord, QuizResultRecord } from '../types';
import { calculateStreak } from './dialectLogic';

const STORAGE_KEY = 'tin_talk_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  masteredIds: [],
  savedWordIds: [],
  customSavedWords: [],
  quizHistory: [],
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserProgress = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        const { newStreak, updatedDate } = calculateStreak(parsed.lastActiveDate, parsed.streak || 1, today);
        return {
          ...parsed,
          streak: newStreak,
          lastActiveDate: updatedDate,
        };
      }
    } catch (e) {
      console.warn('Failed to parse user progress from localStorage', e);
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save user progress', e);
    }
  }, [progress]);

  const toggleMastered = (wordId: string) => {
    setProgress((prev) => {
      const exists = prev.masteredIds.includes(wordId);
      const newMastered = exists
        ? prev.masteredIds.filter((id) => id !== wordId)
        : [...prev.masteredIds, wordId];
      return { ...prev, masteredIds: newMastered };
    });
  };

  const markMastered = (wordId: string, isMastered: boolean) => {
    setProgress((prev) => {
      const exists = prev.masteredIds.includes(wordId);
      if (isMastered && !exists) {
        return { ...prev, masteredIds: [...prev.masteredIds, wordId] };
      }
      if (!isMastered && exists) {
        return { ...prev, masteredIds: prev.masteredIds.filter((id) => id !== wordId) };
      }
      return prev;
    });
  };

  const toggleSavedWord = (word: DialectWord) => {
    setProgress((prev) => {
      const exists = prev.savedWordIds.includes(word.id);
      if (exists) {
        return {
          ...prev,
          savedWordIds: prev.savedWordIds.filter((id) => id !== word.id),
          customSavedWords: prev.customSavedWords.filter((w) => w.id !== word.id),
        };
      } else {
        return {
          ...prev,
          savedWordIds: [...prev.savedWordIds, word.id],
          customSavedWords: [...prev.customSavedWords, word],
        };
      }
    });
  };

  const isWordSaved = (wordId: string) => {
    return progress.savedWordIds.includes(wordId);
  };

  const addQuizResult = (result: Omit<QuizResultRecord, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: QuizResultRecord = {
      id: `quiz_${Date.now()}`,
      date: today,
      ...result,
    };
    setProgress((prev) => ({
      ...prev,
      quizHistory: [newRecord, ...prev.quizHistory].slice(0, 30), // keep latest 30
    }));
  };

  return {
    progress,
    toggleMastered,
    markMastered,
    toggleSavedWord,
    isWordSaved,
    addQuizResult,
  };
}
