import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Check, 
  HelpCircle, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  SlidersHorizontal,
  Grid,
  Layers,
  Shuffle
} from 'lucide-react';
import { Region, Category, DialectWord } from '../types';
import { DIALECT_DATABASE, REGIONS_CONFIG, CATEGORIES_CONFIG } from '../data/dialectDatabase';
import { filterWords, getRegionLabel, getCategoryLabel } from '../utils/dialectLogic';
import { speakThai, isSpeechSupported } from '../utils/speechHelper';

interface FlashcardViewProps {
  initialRegion?: Region;
  masteredIds: string[];
  onToggleMastered: (wordId: string) => void;
  onMarkMastered: (wordId: string, isMastered: boolean) => void;
  onSaveWord: (word: DialectWord) => void;
  isSaved: (wordId: string) => boolean;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  initialRegion,
  masteredIds,
  onToggleMastered,
  onMarkMastered,
  onSaveWord,
  isSaved,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>(initialRegion || 'all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [onlyMasteredFilter, setOnlyMasteredFilter] = useState(false);

  const speechAvailable = isSpeechSupported();

  // Filtered words
  const words = filterWords(DIALECT_DATABASE, {
    region: selectedRegion,
    category: selectedCategory,
    search: searchQuery,
    onlyMastered: onlyMasteredFilter,
    masteredIds,
  });

  // Clamp current index
  useEffect(() => {
    if (currentIndex >= words.length) {
      setCurrentIndex(Math.max(0, words.length - 1));
    }
    setIsFlipped(false);
  }, [words.length]);

  const currentWord = words[currentIndex] as DialectWord | undefined;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentIndex(randomIndex);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (!speechAvailable) return;
    setIsPlayingAudio(true);
    speakThai(text, () => setIsPlayingAudio(false), () => setIsPlayingAudio(false));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#3D3A4B]">
            เรียนรู้คำศัพท์ภาษาถิ่น
          </h1>
          <p className="text-sm text-[#3D3A4B]/70 font-light mt-0.5">
            เรียนรู้ผ่านแฟลชการ์ด 7 หมวดหมู่ พลิกดูคำอ่านและตัวอย่างประโยคจริง
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-white border border-[#3D3A4B]/10 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('flashcard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              viewMode === 'flashcard'
                ? 'bg-[#DCD2FF] text-[#3D3A4B] font-semibold shadow-xs'
                : 'text-[#3D3A4B]/70 hover:bg-black/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>โหมดแฟลชการ์ด</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#DCD2FF] text-[#3D3A4B] font-semibold shadow-xs'
                : 'text-[#3D3A4B]/70 hover:bg-black/5'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>คลังคำทั้งหมด ({words.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Bar: Regions */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#3D3A4B]/70 mr-1">ภูมิภาค:</span>
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedRegion === 'all'
                ? 'bg-[#3D3A4B] text-white'
                : 'bg-white border border-[#3D3A4B]/10 text-[#3D3A4B]/80 hover:bg-black/5'
            }`}
          >
            🌈 ทุกภาค
          </button>

          {(['north', 'isan', 'south'] as Region[]).map((r) => {
            const cfg = REGIONS_CONFIG[r];
            const isSelected = selectedRegion === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? `${cfg.bgBadge} text-[#3D3A4B] font-semibold border ${cfg.borderBadge} shadow-xs`
                    : 'bg-white border border-[#3D3A4B]/10 text-[#3D3A4B]/80 hover:bg-black/5'
                }`}
              >
                <span>{cfg.icon}</span> <span>{cfg.shortName}</span>
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOnlyMasteredFilter(!onlyMasteredFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                onlyMasteredFilter
                  ? 'bg-[#B8EBD0] text-[#3D3A4B] border border-emerald-300'
                  : 'bg-white border border-[#3D3A4B]/10 text-[#3D3A4B]/70 hover:bg-black/5'
              }`}
            >
              ✓ เฉพาะที่จำได้แล้ว
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#FFF0A8] text-[#3D3A4B] font-semibold shadow-xs'
                : 'bg-white border border-[#3D3A4B]/10 text-[#3D3A4B]/70 hover:bg-[#FFF0A8]/40'
            }`}
          >
            ทั้งหมด (7 หมวด)
          </button>

          {Object.values(CATEGORIES_CONFIG).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF0A8] text-[#3D3A4B] font-semibold shadow-xs'
                    : 'bg-white border border-[#3D3A4B]/10 text-[#3D3A4B]/70 hover:bg-[#FFF0A8]/40'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: 3D INTERACTIVE FLASHCARD VIEW */}
      {/* ============================================================== */}
      {viewMode === 'flashcard' && (
        <div className="space-y-6">
          {words.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#3D3A4B]/10 p-8">
              <p className="text-lg text-[#3D3A4B]/70">ไม่พบคำศัพท์ตามเงื่อนไขที่เลือก</p>
              <button
                onClick={() => {
                  setSelectedRegion('all');
                  setSelectedCategory('all');
                  setOnlyMasteredFilter(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#DCD2FF] text-xs font-medium text-[#3D3A4B]"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : currentWord ? (
            <div className="max-w-xl mx-auto space-y-5">
              {/* Card Meta & Counter */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#3D3A4B]/75 px-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${REGIONS_CONFIG[currentWord.region].bgBadge}`}>
                    {REGIONS_CONFIG[currentWord.region].icon} {REGIONS_CONFIG[currentWord.region].shortName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0A8] text-xs font-medium">
                    {getCategoryLabel(currentWord.category)}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <span>ใบที่ {currentIndex + 1} จาก {words.length}</span>
                  <button
                    onClick={handleShuffle}
                    className="p-1 rounded-lg hover:bg-black/5"
                    title="สุ่มการ์ด"
                  >
                    <Shuffle className="w-4 h-4 text-[#3D3A4B]/70" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#3D3A4B]/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#B8EBD0] h-2 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
                />
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="perspective-1000 w-full h-96 cursor-pointer select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setIsFlipped(!isFlipped);
                  }
                }}
                aria-label={`แฟลชการ์ดคำว่า ${isFlipped ? currentWord.dialect : currentWord.thai} คลิกเพื่อพลิก`}
              >
                <div
                  className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT: ภาษาไทยกลาง */}
                  <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl bg-white border border-[#3D3A4B]/10 shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-[#3D3A4B]/60 font-medium">
                        🇹🇭 ภาษาไทยกลาง
                      </span>
                      <span className="text-xs text-[#3D3A4B]/50 flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" /> คลิกเพื่อพลิกดูคำแปล
                      </span>
                    </div>

                    <div className="text-center my-auto">
                      <div className="text-4xl sm:text-5xl font-semibold text-[#3D3A4B] mb-3">
                        {currentWord.thai}
                      </div>
                      <div className="text-sm text-[#3D3A4B]/70 font-light">
                        หมวดหมู่: <span className="font-normal text-[#3D3A4B]">{CATEGORIES_CONFIG[currentWord.category].label}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#3D3A4B]/60 pt-4 border-t border-[#3D3A4B]/10">
                      <span>ทายสิว่าในภาษา{REGIONS_CONFIG[currentWord.region].shortName} เรียกว่าอะไร?</span>
                      <span className="text-indigo-600 font-medium">คลิกเพื่อเฉลย →</span>
                    </div>
                  </div>

                  {/* BACK: ภาษาถิ่น + คำอ่าน + ตัวอย่างประโยค */}
                  <div 
                    className="absolute inset-0 backface-hidden w-full h-full rounded-3xl border border-[#3D3A4B]/10 shadow-md p-8 flex flex-col justify-between rotate-y-180"
                    style={{ backgroundColor: REGIONS_CONFIG[currentWord.region].color + '33' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-[#3D3A4B]">
                        {REGIONS_CONFIG[currentWord.region].icon} {getRegionLabel(currentWord.region)}
                      </span>

                      <div className="flex items-center gap-2">
                        {speechAvailable && (
                          <button
                            onClick={(e) => handleSpeak(e, currentWord.dialect)}
                            disabled={isPlayingAudio}
                            className="p-2 rounded-xl bg-white text-[#3D3A4B] hover:bg-gray-100 shadow-2xs transition-all"
                            title="ฟังเสียงอ่าน"
                            aria-label="ฟังเสียงคำศัพท์"
                          >
                            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSaveWord(currentWord);
                          }}
                          className={`p-2 rounded-xl bg-white shadow-2xs transition-all ${
                            isSaved(currentWord.id) ? 'text-pink-600' : 'text-[#3D3A4B]'
                          }`}
                          title="บันทึกลงสมุดคำศัพท์"
                          aria-label="บันทึกลงสมุดคำศัพท์"
                        >
                          {isSaved(currentWord.id) ? (
                            <BookmarkCheck className="w-4 h-4 fill-pink-500" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-center my-auto space-y-2">
                      <div className="text-4xl sm:text-5xl font-semibold text-[#3D3A4B]">
                        {currentWord.dialect}
                      </div>
                      <div className="text-base font-light text-[#3D3A4B]/80">
                        คำอ่าน: <span className="font-medium text-[#3D3A4B]">{currentWord.pronunciation}</span>
                      </div>
                      <div className="inline-block mt-1 px-3 py-1 rounded-xl bg-white/80 text-xs font-medium text-emerald-900">
                        ไทยกลาง: {currentWord.thai}
                      </div>

                      {/* Example sentence */}
                      <div className="pt-3 text-left bg-white/80 p-3.5 rounded-2xl border border-black/5 mt-3 text-xs sm:text-sm">
                        <div className="text-xs text-[#3D3A4B]/60 font-medium">ตัวอย่างประโยค:</div>
                        <p className="font-normal text-[#3D3A4B] italic mt-0.5">"{currentWord.example}"</p>
                        <p className="text-xs text-[#3D3A4B]/70 mt-0.5">({currentWord.exampleThai})</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#3D3A4B]/60 pt-2 border-t border-black/5">
                      <span>{currentWord.notes || 'กดปุ่มด้านล่างเพื่อประเมินความจำ'}</span>
                      <span className="text-[#3D3A4B]/80 font-medium">คลิกเพื่อพลิกกลับ ⟲</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: "ยังไม่แน่ใจ" / "จำได้แล้ว" */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onMarkMastered(currentWord.id, false);
                    handleNext();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FFD9E5] hover:bg-[#FFC6D8] text-pink-900 font-medium text-sm sm:text-base shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5 text-pink-700" />
                  <span>ยังไม่แน่ใจ 🤔</span>
                </button>

                <button
                  onClick={() => {
                    onMarkMastered(currentWord.id, true);
                    handleNext();
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-medium text-sm sm:text-base shadow-xs active:scale-98 transition-all cursor-pointer ${
                    masteredIds.includes(currentWord.id)
                      ? 'bg-[#B8EBD0] text-emerald-900 font-semibold ring-2 ring-emerald-400'
                      : 'bg-[#B8EBD0] hover:bg-[#A3E5C1] text-emerald-900'
                  }`}
                >
                  <Check className="w-5 h-5 text-emerald-800" />
                  <span>จำได้แล้ว! ✅</span>
                </button>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#3D3A4B]/10 text-xs sm:text-sm font-medium text-[#3D3A4B] hover:bg-black/5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>คำก่อนหน้า</span>
                </button>

                <span className="text-xs text-[#3D3A4B]/60">
                  Tip: ใช้ปุ่ม Space หรือคลิกที่การ์ดเพื่อพลิกดูคำแปล
                </span>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#3D3A4B]/10 text-xs sm:text-sm font-medium text-[#3D3A4B] hover:bg-black/5 cursor-pointer"
                >
                  <span>คำถัดไป</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: DICTIONARY / GRID LIST VIEW */}
      {/* ============================================================== */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-[#3D3A4B]/40 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาคำศัพท์ คำอ่าน หรือความหมาย..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-[#3D3A4B]/15 text-[#3D3A4B] placeholder:text-[#3D3A4B]/40 focus:outline-none focus:ring-2 focus:ring-[#DCD2FF]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {words.map((word) => {
              const regCfg = REGIONS_CONFIG[word.region];
              const isMastered = masteredIds.includes(word.id);
              const saved = isSaved(word.id);

              return (
                <div
                  key={word.id}
                  className="rounded-2xl bg-white border border-[#3D3A4B]/10 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${regCfg.bgBadge}`}>
                        {regCfg.icon} {regCfg.shortName}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {speechAvailable && (
                          <button
                            onClick={(e) => handleSpeak(e, word.dialect)}
                            className="p-1.5 rounded-lg hover:bg-black/5 text-[#3D3A4B]"
                            title="ฟังเสียง"
                            aria-label={`ฟังเสียงคำว่า ${word.dialect}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onSaveWord(word)}
                          className={`p-1.5 rounded-lg hover:bg-black/5 ${saved ? 'text-pink-600' : 'text-[#3D3A4B]'}`}
                          title="บันทึกคำศัพท์"
                          aria-label={`บันทึกคำศัพท์ ${word.dialect}`}
                        >
                          {saved ? <BookmarkCheck className="w-4 h-4 fill-pink-500" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-2xl font-semibold text-[#3D3A4B]">
                        {word.dialect}
                      </div>
                      <div className="text-xs text-[#3D3A4B]/70 font-light mt-0.5">
                        คำอ่าน: <span className="font-normal text-[#3D3A4B]">{word.pronunciation}</span>
                      </div>
                    </div>

                    <div className="text-sm font-medium text-emerald-900 bg-[#B8EBD0]/40 px-2.5 py-1 rounded-lg inline-block">
                      ไทยกลาง: {word.thai}
                    </div>

                    <div className="text-xs text-[#3D3A4B]/80 font-light italic bg-[#FFFDF8] p-2 rounded-xl border border-black/5">
                      "{word.example}"
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#3D3A4B]/10 flex items-center justify-between">
                    <span className="text-xs text-[#3D3A4B]/60">
                      หมวด: {CATEGORIES_CONFIG[word.category].label}
                    </span>

                    <button
                      onClick={() => onToggleMastered(word.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                        isMastered
                          ? 'bg-[#B8EBD0] text-emerald-900 font-semibold'
                          : 'bg-gray-100 hover:bg-[#B8EBD0]/50 text-[#3D3A4B]'
                      }`}
                    >
                      {isMastered ? '✓ จำได้แล้ว' : '+ ทำเครื่องหมายว่าจำได้'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
