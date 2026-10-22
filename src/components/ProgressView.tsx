import React, { useState } from 'react';
import { 
  BarChart2, 
  Flame, 
  CheckCircle2, 
  Bookmark, 
  Trophy, 
  Trash2, 
  Volume2, 
  Search, 
  Star, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserProgress, DialectWord, Region } from '../types';
import { DIALECT_DATABASE, REGIONS_CONFIG, CATEGORIES_CONFIG } from '../data/dialectDatabase';
import { speakThai, isSpeechSupported } from '../utils/speechHelper';
import { NavTab } from './Header';

interface ProgressViewProps {
  progress: UserProgress;
  onToggleMastered: (wordId: string) => void;
  onRemoveSavedWord: (word: DialectWord) => void;
  onNavigate: (tab: NavTab, region?: Region) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onToggleMastered,
  onRemoveSavedWord,
  onNavigate,
}) => {
  const [wordSearch, setWordSearch] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const speechAvailable = isSpeechSupported();

  // Region stats
  const totalNorth = DIALECT_DATABASE.filter((w) => w.region === 'north').length;
  const totalIsan = DIALECT_DATABASE.filter((w) => w.region === 'isan').length;
  const totalSouth = DIALECT_DATABASE.filter((w) => w.region === 'south').length;
  const grandTotal = DIALECT_DATABASE.length;

  const masteredNorth = DIALECT_DATABASE.filter(
    (w) => w.region === 'north' && progress.masteredIds.includes(w.id)
  ).length;
  const masteredIsan = DIALECT_DATABASE.filter(
    (w) => w.region === 'isan' && progress.masteredIds.includes(w.id)
  ).length;
  const masteredSouth = DIALECT_DATABASE.filter(
    (w) => w.region === 'south' && progress.masteredIds.includes(w.id)
  ).length;
  const totalMastered = progress.masteredIds.length;

  // Combine database saved words and custom saved words
  const savedDbWords = DIALECT_DATABASE.filter((w) => progress.savedWordIds.includes(w.id));
  const allSavedWords = [
    ...savedDbWords,
    ...progress.customSavedWords.filter((cw) => !savedDbWords.some((sw) => sw.id === cw.id)),
  ];

  const filteredSavedWords = allSavedWords.filter((word) => {
    if (!wordSearch.trim()) return true;
    const q = wordSearch.toLowerCase();
    return (
      word.dialect.toLowerCase().includes(q) ||
      word.thai.toLowerCase().includes(q) ||
      word.pronunciation.toLowerCase().includes(q)
    );
  });

  const handleSpeak = (text: string) => {
    if (!speechAvailable) return;
    setIsPlayingAudio(true);
    speakThai(text, () => setIsPlayingAudio(false), () => setIsPlayingAudio(false));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8EBD0] text-[#3D3A4B] text-xs font-medium">
          <BarChart2 className="w-4 h-4 text-emerald-800" />
          <span>บันทึกการเรียนรู้ส่วนตัว</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#3D3A4B]">
          ความคืบหน้า & สมุดคำศัพท์
        </h1>
        <p className="text-sm sm:text-base text-[#3D3A4B]/75 font-light">
          ติดตามจำนวนคำที่จำได้ คะแนนควิซ และความต่อเนื่องในการเรียนรู้ของคุณ
        </p>
      </div>

      {/* Streak & Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Streak Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF0A8] via-[#FFF0A8]/60 to-white border border-[#3D3A4B]/10 p-6 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0A8] border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Flame className="w-9 h-9 text-amber-500 fill-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[#3D3A4B]/70 font-medium">
              Streak รายวัน
            </div>
            <div className="text-3xl font-semibold text-[#3D3A4B]">
              {progress.streak} <span className="text-lg font-normal">วันต่อเนื่อง</span>
            </div>
            <div className="text-xs text-amber-900 font-light mt-0.5">
              เข้าใช้งานล่าสุด: {progress.lastActiveDate}
            </div>
          </div>
        </div>

        {/* Mastered Vocabulary Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#B8EBD0] via-[#B8EBD0]/50 to-white border border-[#3D3A4B]/10 p-6 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#B8EBD0] border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-9 h-9 text-emerald-700" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[#3D3A4B]/70 font-medium">
              คำศัพท์ที่จำได้แล้ว
            </div>
            <div className="text-3xl font-semibold text-[#3D3A4B]">
              {totalMastered} <span className="text-lg font-normal">/ {grandTotal} คำ</span>
            </div>
            <div className="text-xs text-emerald-900 font-light mt-0.5">
              คิดเป็น {Math.round((totalMastered / grandTotal) * 100)}% ของคลังทั้งหมด
            </div>
          </div>
        </div>

        {/* Saved Wordbook Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FFD9E5] via-[#FFD9E5]/60 to-white border border-[#3D3A4B]/10 p-6 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFD9E5] border border-pink-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Bookmark className="w-9 h-9 text-pink-600 fill-pink-500/40" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[#3D3A4B]/70 font-medium">
              สมุดคำศัพท์ส่วนตัว
            </div>
            <div className="text-3xl font-semibold text-[#3D3A4B]">
              {allSavedWords.length} <span className="text-lg font-normal">คำ</span>
            </div>
            <div className="text-xs text-pink-900 font-light mt-0.5">
              บันทึกไว้สำหรับทบทวน
            </div>
          </div>
        </div>
      </div>

      {/* Mastery by Region Progress Bars */}
      <section className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-semibold text-[#3D3A4B]">
          ความก้าวหน้าแยกตาม 3 ภูมิภาค
        </h2>

        <div className="space-y-5">
          {/* North */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <span>🌿</span>
                <span>ภาษาเหนือ (คำเมือง)</span>
              </span>
              <span className="text-xs text-[#3D3A4B]/70">
                {masteredNorth} / {totalNorth} คำ ({Math.round((masteredNorth / totalNorth) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-[#DCD2FF]/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#DCD2FF] h-3 transition-all duration-500"
                style={{ width: `${(masteredNorth / totalNorth) * 100}%` }}
              />
            </div>
          </div>

          {/* Isan */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <span>🌾</span>
                <span>ภาษาอีสาน</span>
              </span>
              <span className="text-xs text-[#3D3A4B]/70">
                {masteredIsan} / {totalIsan} คำ ({Math.round((masteredIsan / totalIsan) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-[#B8EBD0]/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#B8EBD0] h-3 transition-all duration-500"
                style={{ width: `${(masteredIsan / totalIsan) * 100}%` }}
              />
            </div>
          </div>

          {/* South */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <span>🌊</span>
                <span>ภาษาใต้</span>
              </span>
              <span className="text-xs text-[#3D3A4B]/70">
                {masteredSouth} / {totalSouth} คำ ({Math.round((masteredSouth / totalSouth) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-[#FFD6C2]/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#FFD6C2] h-3 transition-all duration-500"
                style={{ width: `${(masteredSouth / totalSouth) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Personal Saved Wordbook */}
      <section className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#3D3A4B] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-pink-600 fill-pink-500/30" />
              <span>สมุดคำศัพท์ส่วนตัว ({allSavedWords.length})</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#3D3A4B]/70 font-light mt-0.5">
              คำที่คุณกดบันทึกไว้ระหว่างแปลภาษาหรือเรียนแฟลชการ์ด
            </p>
          </div>

          {/* Search filter in wordbook */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#3D3A4B]/40 absolute left-3 top-2.5" />
            <input
              type="text"
              value={wordSearch}
              onChange={(e) => setWordSearch(e.target.value)}
              placeholder="ค้นหาในสมุดคำ..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#3D3A4B]/15 text-xs text-[#3D3A4B] placeholder:text-[#3D3A4B]/40 focus:outline-none focus:ring-1 focus:ring-[#DCD2FF]"
            />
          </div>
        </div>

        {allSavedWords.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-[#FFFDF8] border border-dashed border-[#3D3A4B]/20">
            <p className="text-sm text-[#3D3A4B]/70">ยังไม่มีคำศัพท์ที่บันทึกไว้ในสมุดคำ</p>
            <p className="text-xs text-[#3D3A4B]/50 mt-1">
              คุณสามารถกดไอคอน 🔖 ในหน้าแปลภาษาหรือแฟลชการ์ดเพื่อบันทึกคำที่ชอบได้
            </p>
            <button
              onClick={() => onNavigate('translate')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#B8EBD0] text-xs font-medium text-[#3D3A4B]"
            >
              ไปหน้าแปลภาษา
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSavedWords.map((word) => {
              const regCfg = REGIONS_CONFIG[word.region];
              const isMastered = progress.masteredIds.includes(word.id);

              return (
                <div
                  key={word.id}
                  className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10 flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-2xs font-medium ${regCfg.bgBadge}`}>
                        {regCfg.icon} {regCfg.shortName}
                      </span>
                      <span className="text-2xs text-[#3D3A4B]/60">
                        {word.category ? CATEGORIES_CONFIG[word.category]?.label : 'ทั่วไป'}
                      </span>
                    </div>

                    <div className="text-lg font-semibold text-[#3D3A4B]">
                      {word.dialect}
                    </div>

                    <div className="text-xs text-[#3D3A4B]/70 font-light">
                      คำอ่าน: <span className="font-medium text-[#3D3A4B]">{word.pronunciation}</span>
                    </div>

                    <div className="text-xs font-medium text-emerald-800">
                      ไทยกลาง: {word.thai}
                    </div>

                    {word.example && (
                      <p className="text-2xs text-[#3D3A4B]/75 italic mt-1 bg-white p-1.5 rounded-lg border border-black/5">
                        "{word.example}" ({word.exampleThai})
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {speechAvailable && (
                      <button
                        onClick={() => handleSpeak(word.dialect)}
                        disabled={isPlayingAudio}
                        className="p-2 rounded-xl bg-white hover:bg-gray-100 text-[#3D3A4B] shadow-2xs cursor-pointer"
                        title="ฟังเสียง"
                        aria-label={`ฟังเสียงคำว่า ${word.dialect}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onRemoveSavedWord(word)}
                      className="p-2 rounded-xl bg-white hover:bg-[#FFD9E5] text-pink-600 shadow-2xs cursor-pointer"
                      title="ลบออกจากสมุดคำ"
                      aria-label="ลบออกจากสมุดคำ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quiz History Table */}
      <section className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#3D3A4B] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>ประวัติการทำควิซ</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#3D3A4B]/70 font-light mt-0.5">
              บันทึกคะแนนรอบควิซ 10 ข้อล่าสุดของคุณ
            </p>
          </div>

          <button
            onClick={() => onNavigate('quiz')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF0A8] text-xs font-medium text-[#3D3A4B] hover:bg-[#FFE885] cursor-pointer"
          >
            <span>ทำควิซรอบใหม่</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {progress.quizHistory.length === 0 ? (
          <div className="text-center py-8 text-sm text-[#3D3A4B]/60 font-light">
            ยังไม่มีประวัติการทำควิซ มาเริ่มทำควิซเพื่อทดสอบความรู้กันเถอะ!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#3D3A4B]/10 text-[#3D3A4B]/60 font-medium">
                  <th className="py-2.5 px-3">วันที่</th>
                  <th className="py-2.5 px-3">ภูมิภาค</th>
                  <th className="py-2.5 px-3">คะแนน</th>
                  <th className="py-2.5 px-3">ร้อยละ</th>
                  <th className="py-2.5 px-3">ระดับดาว</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3D3A4B]/5">
                {progress.quizHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FFFDF8]">
                    <td className="py-2.5 px-3 text-[#3D3A4B]/80">{item.date}</td>
                    <td className="py-2.5 px-3 font-medium text-[#3D3A4B]">{item.region}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-900">
                      {item.score} / {item.total}
                    </td>
                    <td className="py-2.5 px-3">{item.percentage}%</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: Math.ceil(item.score / 2) }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
