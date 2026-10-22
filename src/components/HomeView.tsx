import React, { useState } from 'react';
import { 
  Languages, 
  BookOpen, 
  Sparkles, 
  Compass, 
  Volume2, 
  ArrowRight, 
  BookmarkCheck, 
  Flame, 
  CheckCircle2,
  Smile
} from 'lucide-react';
import { NavTab } from './Header';
import { DIALECT_DATABASE, REGIONS_CONFIG } from '../data/dialectDatabase';
import { Region } from '../types';
import { speakThai, isSpeechSupported } from '../utils/speechHelper';

interface HomeViewProps {
  onNavigate: (tab: NavTab, region?: Region) => void;
  masteredCount: number;
  savedCount: number;
  streak: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  masteredCount,
  savedCount,
  streak,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const speechAvailable = isSpeechSupported();

  // Daily spotlight word (changes deterministically based on date)
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const spotlightWord = DIALECT_DATABASE[dayOfYear % DIALECT_DATABASE.length];
  const spotlightRegion = REGIONS_CONFIG[spotlightWord.region];

  const handlePlayWord = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (!speechAvailable) return;
    setIsPlayingAudio(true);
    speakThai(text, () => setIsPlayingAudio(false), () => setIsPlayingAudio(false));
  };

  const northWordsCount = DIALECT_DATABASE.filter((w) => w.region === 'north').length;
  const isanWordsCount = DIALECT_DATABASE.filter((w) => w.region === 'isan').length;
  const southWordsCount = DIALECT_DATABASE.filter((w) => w.region === 'south').length;

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#DCD2FF]/60 via-[#FFFDF8] to-[#B8EBD0]/50 p-6 sm:p-10 border border-[#3D3A4B]/10 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0A8] text-[#3D3A4B] text-xs sm:text-sm font-medium mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>สื่อมัลติมีเดียเพื่อการเรียนรู้ภาษาถิ่น 3 ภาค</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold text-[#3D3A4B] tracking-tight leading-tight mb-3">
            ยินดีต้อนรับสู่ <span className="text-[#6D52C5]">Tin</span>{' '}
            <span className="text-[#1EA068]">Talk</span>
          </h1>

          <p className="text-xl sm:text-2xl font-normal text-[#3D3A4B]/90 mb-4">
            สโลแกน: <span className="font-medium text-[#6D52C5]">"เรียนรู้ทุกถิ่น ได้ยินทุกใจ"</span>
          </p>

          <p className="text-base sm:text-lg text-[#3D3A4B]/75 font-light leading-relaxed mb-8 max-w-2xl">
            แพลตฟอร์มการเรียนรู้และแปลภาษาถิ่นของไทย ทั้งภาษาเหนือ (คำเมือง), ภาษาอีสาน 
            และภาษาใต้ ออกแบบมาสำหรับนักเรียน นักศึกษา และทุกคนที่อยากสื่อสารกับคนต่างถิ่นได้อย่างเข้าใจและอบอุ่น
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('translate')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#B8EBD0] hover:bg-[#A3E5C1] text-[#3D3A4B] font-medium text-base shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Languages className="w-5 h-5" />
              <span>เริ่มแปลภาษาถิ่น</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#DCD2FF] hover:bg-[#CEBFFF] text-[#3D3A4B] font-medium text-base shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-purple-700" />
              <span>เล่นควิซ 10 ข้อ</span>
            </button>

            <button
              onClick={() => onNavigate('flashcards')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#FFD6C2] hover:bg-[#FFC6AC] text-[#3D3A4B] font-medium text-base shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>เรียนคำศัพท์</span>
            </button>
          </div>
        </div>

        {/* Decorative corner illustrations */}
        <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 opacity-20 pointer-events-none text-7xl sm:text-9xl">
          💬
        </div>
      </section>

      {/* Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#3D3A4B]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#DCD2FF] flex items-center justify-center text-xl shrink-0">
            📚
          </div>
          <div>
            <div className="text-2xl font-semibold text-[#3D3A4B]">{DIALECT_DATABASE.length}</div>
            <div className="text-xs text-[#3D3A4B]/70 font-light">คลังคำศัพท์เริ่มต้น</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#3D3A4B]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#B8EBD0] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-[#3D3A4B]">{masteredCount}</div>
            <div className="text-xs text-[#3D3A4B]/70 font-light">คำที่จำได้แล้ว</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#3D3A4B]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF0A8] flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-600 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-[#3D3A4B]">{streak} วัน</div>
            <div className="text-xs text-[#3D3A4B]/70 font-light">เรียนรู้ต่อเนื่อง</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#3D3A4B]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFD9E5] flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-[#3D3A4B]">{savedCount}</div>
            <div className="text-xs text-[#3D3A4B]/70 font-light">คำในสมุดคำศัพท์</div>
          </div>
        </div>
      </section>

      {/* 3 Regional Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#3D3A4B] tracking-tight">
              เลือกเรียนรู้ตามภูมิภาค
            </h2>
            <p className="text-sm text-[#3D3A4B]/70 font-light mt-0.5">
              สัมผัสความงดงามทางภาษาและวัฒนธรรมที่เป็นเอกลักษณ์ของแต่ละถิ่น
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 🌿 North */}
          <div 
            onClick={() => onNavigate('flashcards', 'north')}
            className="group relative rounded-2xl bg-[#DCD2FF]/40 hover:bg-[#DCD2FF]/60 border border-[#DCD2FF] p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl p-2.5 rounded-2xl bg-white/80 shadow-2xs">🌿</span>
                <span className="px-3 py-1 rounded-full bg-[#DCD2FF] text-[#3D3A4B] text-xs font-medium">
                  {northWordsCount} คำศัพท์
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#3D3A4B] mb-1">
                ภาษาเหนือ (คำเมือง)
              </h3>
              <p className="text-sm text-[#3D3A4B]/80 font-light mb-4 line-clamp-2">
                {REGIONS_CONFIG.north.description}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-[#3D3A4B]/10">
                <div className="text-xs text-[#3D3A4B]/70 font-medium">คำเด่นน่ารู้:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">กิ๋น (กิน)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">อู้ (พูด)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">ม่วน (สนุก)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">ปิ๊ก (กลับ)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-sm font-medium text-[#3D3A4B] group-hover:translate-x-1 transition-transform">
              <span>เรียนคำเมืองล้านนา</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 🌾 Isan */}
          <div 
            onClick={() => onNavigate('flashcards', 'isan')}
            className="group relative rounded-2xl bg-[#B8EBD0]/40 hover:bg-[#B8EBD0]/60 border border-[#B8EBD0] p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl p-2.5 rounded-2xl bg-white/80 shadow-2xs">🌾</span>
                <span className="px-3 py-1 rounded-full bg-[#B8EBD0] text-[#3D3A4B] text-xs font-medium">
                  {isanWordsCount} คำศัพท์
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#3D3A4B] mb-1">
                ภาษาอีสาน
              </h3>
              <p className="text-sm text-[#3D3A4B]/80 font-light mb-4 line-clamp-2">
                {REGIONS_CONFIG.isan.description}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-[#3D3A4B]/10">
                <div className="text-xs text-[#3D3A4B]/70 font-medium">คำเด่นน่ารู้:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">แซบ (อร่อย)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">เฮ็ด (ทำ)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">เว้า (พูด)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">คึดฮอด (คิดถึง)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-sm font-medium text-[#3D3A4B] group-hover:translate-x-1 transition-transform">
              <span>เรียนภาษาอีสานม่วนๆ</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 🌊 South */}
          <div 
            onClick={() => onNavigate('flashcards', 'south')}
            className="group relative rounded-2xl bg-[#FFD6C2]/40 hover:bg-[#FFD6C2]/60 border border-[#FFD6C2] p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl p-2.5 rounded-2xl bg-white/80 shadow-2xs">🌊</span>
                <span className="px-3 py-1 rounded-full bg-[#FFD6C2] text-[#3D3A4B] text-xs font-medium">
                  {southWordsCount} คำศัพท์
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#3D3A4B] mb-1">
                ภาษาใต้
              </h3>
              <p className="text-sm text-[#3D3A4B]/80 font-light mb-4 line-clamp-2">
                {REGIONS_CONFIG.south.description}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-[#3D3A4B]/10">
                <div className="text-xs text-[#3D3A4B]/70 font-medium">คำเด่นน่ารู้:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">หรอย (อร่อย)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">เคียด (โกรธ)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">ย่าน (กลัว)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/90 text-xs font-normal">หลบ (กลับ)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-sm font-medium text-[#3D3A4B] group-hover:translate-x-1 transition-transform">
              <span>เรียนภาษาใต้หรอยแรง</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Word of the Day & Culture Highlight */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spotlight Word Card */}
        <div className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <h3 className="text-lg font-semibold text-[#3D3A4B]">คำศัพท์น่ารู้ประจำวัน</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${spotlightRegion.bgBadge}`}>
              {spotlightRegion.icon} {spotlightRegion.shortName}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-semibold text-[#3D3A4B] mb-1">
                  {spotlightWord.dialect}
                </div>
                <div className="text-sm text-[#3D3A4B]/70 font-light">
                  คำอ่าน: <span className="font-normal text-[#3D3A4B]">{spotlightWord.pronunciation}</span>
                </div>
                <div className="mt-2 text-base font-medium text-emerald-800 bg-[#B8EBD0]/40 px-3 py-1 rounded-xl inline-block">
                  ไทยกลาง: {spotlightWord.thai}
                </div>
              </div>

              {speechAvailable && (
                <button
                  onClick={(e) => handlePlayWord(e, spotlightWord.dialect)}
                  disabled={isPlayingAudio}
                  className="p-3 rounded-2xl bg-[#DCD2FF] hover:bg-[#CEBFFF] text-[#3D3A4B] transition-transform active:scale-95 cursor-pointer shadow-xs"
                  aria-label={`ฟังเสียงคำว่า ${spotlightWord.dialect}`}
                >
                  <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                </button>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#3D3A4B]/10 text-sm">
              <div className="text-xs text-[#3D3A4B]/60 font-medium mb-1">ตัวอย่างประโยค:</div>
              <p className="font-normal text-[#3D3A4B] italic">"{spotlightWord.example}"</p>
              <p className="text-xs text-[#3D3A4B]/70 mt-0.5">({spotlightWord.exampleThai})</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#3D3A4B]/70">
            <span>หมวด: {spotlightWord.category}</span>
            <button
              onClick={() => onNavigate('translate')}
              className="text-xs font-medium text-[#6D52C5] hover:underline"
            >
              ทดลองค้นหาคำอื่นๆ เพิ่มเติม →
            </button>
          </div>
        </div>

        {/* Culture Teaser Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF0A8]/50 via-white to-[#FFD9E5]/40 border border-[#3D3A4B]/10 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-indigo-700" />
              <h3 className="text-lg font-semibold text-[#3D3A4B]">เกร็ดวัฒนธรรมและสำเนียง</h3>
            </div>

            <h4 className="text-xl font-medium text-[#3D3A4B] mb-2">
              ทำไมคนแต่ละภาคถึงมีคำลงท้ายต่างกัน?
            </h4>

            <p className="text-sm text-[#3D3A4B]/80 font-light leading-relaxed mb-4">
              คำลงท้ายอย่าง <span className="font-medium bg-[#DCD2FF]/60 px-1.5 py-0.5 rounded">"เจ้า"</span> ของชาวเหนือ,{' '}
              <span className="font-medium bg-[#B8EBD0]/70 px-1.5 py-0.5 rounded">"เด้อ / น้อ"</span> ของชาวอีสาน, และ{' '}
              <span className="font-medium bg-[#FFD6C2]/80 px-1.5 py-0.5 rounded">"ต๊ะ / นิ"</span> ของชาวปักษ์ใต้ 
              มิใช่เพียงแค่สำเนียง แต่เป็นสะพานแสดงไมตรีจิต ความนอบน้อม และความอบอุ่นของคนไทย
            </p>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#3D3A4B]/10 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span>🌿</span>
                <span><strong>เหนือ:</strong> "ยินดีจ๊าดนักเน้อเจ้า" (ขอบคุณมากๆ นะคะ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌾</span>
                <span><strong>อีสาน:</strong> "คึดฮอดบ้านเฮาหลายเด้อ" (คิดถึงบ้านเรามากๆ นะ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌊</span>
                <span><strong>ใต้:</strong> "แกงไตปลาถ้วยนี้ หรอยจังฮู้!" (แกงไตปลาชามนี้ อร่อยมากๆ!)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 flex items-center justify-end">
            <button
              onClick={() => onNavigate('culture')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DCD2FF] hover:bg-[#CEBFFF] text-xs font-medium text-[#3D3A4B] transition-all cursor-pointer"
            >
              <span>อ่านมุมวัฒนธรรมทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
