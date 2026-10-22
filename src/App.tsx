/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, NavTab } from './components/Header';
import { HomeView } from './components/HomeView';
import { TranslatorView } from './components/TranslatorView';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { CultureView } from './components/CultureView';
import { ProgressView } from './components/ProgressView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { useUserProgress } from './utils/useLocalStorage';
import { Region, DialectWord } from './types';
import { Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [targetRegion, setTargetRegion] = useState<Region>('north');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    progress,
    toggleMastered,
    markMastered,
    toggleSavedWord,
    isWordSaved,
    addQuizResult,
  } = useUserProgress();

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleNavigate = (tab: NavTab, region?: Region) => {
    if (region) {
      setTargetRegion(region);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveWordWithToast = (word: DialectWord) => {
    const alreadySaved = isWordSaved(word.id);
    toggleSavedWord(word);
    if (!alreadySaved) {
      showToast(`บันทึกคำว่า "${word.dialect}" ลงสมุดคำศัพท์แล้ว ✨`);
    } else {
      showToast(`นำคำว่า "${word.dialect}" ออกจากสมุดคำศัพท์แล้ว`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] text-[#3D3A4B] selection:bg-[#FFF0A8] font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#3D3A4B] text-white shadow-lg text-sm font-medium">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={progress.streak}
        savedCount={progress.savedWordIds.length + progress.customSavedWords.length}
      />

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            masteredCount={progress.masteredIds.length}
            savedCount={progress.savedWordIds.length + progress.customSavedWords.length}
            streak={progress.streak}
          />
        )}

        {activeTab === 'translate' && (
          <TranslatorView
            initialRegion={targetRegion}
            onSaveWord={handleSaveWordWithToast}
            isSaved={isWordSaved}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardView
            initialRegion={targetRegion}
            masteredIds={progress.masteredIds}
            onToggleMastered={toggleMastered}
            onMarkMastered={markMastered}
            onSaveWord={handleSaveWordWithToast}
            isSaved={isWordSaved}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            initialRegion={targetRegion}
            onRecordQuizResult={addQuizResult}
          />
        )}

        {activeTab === 'culture' && <CultureView />}

        {activeTab === 'progress' && (
          <ProgressView
            progress={progress}
            onToggleMastered={toggleMastered}
            onRemoveSavedWord={handleSaveWordWithToast}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
