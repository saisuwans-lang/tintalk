import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Region, TranslationResult, DialectWord } from '../types';
import { DIALECT_DATABASE, REGIONS_CONFIG } from '../data/dialectDatabase';
import { searchLocalDictionary, getRegionLabel } from '../utils/dialectLogic';
import { speakThai, isSpeechSupported } from '../utils/speechHelper';

interface TranslatorViewProps {
  initialRegion?: Region;
  onSaveWord: (word: DialectWord) => void;
  isSaved: (wordId: string) => boolean;
}

export const TranslatorView: React.FC<TranslatorViewProps> = ({
  initialRegion = 'north',
  onSaveWord,
  isSaved,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(initialRegion);
  const [direction, setDirection] = useState<'th_to_dialect' | 'dialect_to_th'>('th_to_dialect');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([
    'กิน', 'อร่อย', 'พูด', 'คิดถึง', 'กลับบ้าน', 'สนุก', 'ตลาด'
  ]);

  const speechAvailable = isSpeechSupported();
  const currentRegionCfg = REGIONS_CONFIG[selectedRegion];

  const handleTranslate = async (textToTranslate = inputText) => {
    const text = textToTranslate.trim();
    if (!text) return;

    setErrorMsg(null);
    setCopied(false);

    // Update recent queries
    setRecentQueries((prev) => {
      const filtered = prev.filter((q) => q !== text);
      return [text, ...filtered].slice(0, 8);
    });

    // 1. Check local database first as requested!
    const localMatch = searchLocalDictionary(text, selectedRegion, direction, DIALECT_DATABASE);

    if (localMatch) {
      setResult({
        thai: localMatch.thai,
        dialect: localMatch.dialect,
        region: localMatch.region,
        pronunciation: localMatch.pronunciation,
        meaning: localMatch.exampleThai ? `คำว่า "${localMatch.thai}" หมายถึงการ${localMatch.thai}` : localMatch.thai,
        example: localMatch.example,
        exampleThai: localMatch.exampleThai,
        source: 'database',
        needsVerify: localMatch.needsVerify,
        notes: localMatch.notes || 'คำศัพท์จากคลังข้อมูลมาตรฐานของ Tin Talk',
      });
      return;
    }

    // 2. Fallback to Gemini AI Server API
    setIsLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          region: selectedRegion,
          direction,
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || !data) {
        setResult({
          thai: direction === 'th_to_dialect' ? text : 'คำค้นหา',
          dialect: direction === 'dialect_to_th' ? text : 'ไม่พบคำแปลตรงตัว',
          region: selectedRegion,
          pronunciation: '-',
          meaning: 'ระบบแปลภาษา AI กำลังมีผู้ใช้งานหนาแน่นชั่วคราว คุณสามารถเลือกคำศัพท์ที่มีอยู่ในคลัง Tin Talk หรือลองใหม่อีกครั้ง',
          example: '-',
          exampleThai: '-',
          source: 'ai',
          uncertain: true,
          notes: 'แนะนำ: ทดลองเลือกคำศัพท์จากแถบตัวอย่างด้านบน เช่น "กิน", "อร่อย", "พูด", "คิดถึง"',
        });
        setErrorMsg('เซิร์ฟเวอร์ AI มีผู้ใช้งานหนาแน่นชั่วคราว แนะนำให้ค้นหาคำศัพท์จากคลัง Tin Talk');
        return;
      }

      setResult({
        thai: data.thai || (direction === 'th_to_dialect' ? text : 'ไม่ระบุ'),
        dialect: data.dialect || (direction === 'dialect_to_th' ? text : 'ไม่ระบุ'),
        region: selectedRegion,
        pronunciation: data.pronunciation || '-',
        meaning: data.meaning || 'ไม่พบความหมายที่แน่นอน',
        example: data.example || '-',
        exampleThai: data.exampleThai || '-',
        source: 'ai',
        uncertain: data.uncertain ?? (!data.found),
        notes: data.notes,
      });

      if (data.isServiceBusy) {
        setErrorMsg('หมายเหตุ: ระบบ AI กำลังมีผู้ใช้งานหนาแน่นชั่วคราว จึงแสดงผลลัพธ์แนะนำเบื้องต้น');
      }
    } catch (err: any) {
      console.warn('Translate fetch error:', err);
      // Graceful fallback display without throwing uncaught exception
      setResult({
        thai: direction === 'th_to_dialect' ? text : 'คำค้นหา',
        dialect: direction === 'dialect_to_th' ? text : 'ไม่พบคำแปลตรงตัว',
        region: selectedRegion,
        pronunciation: '-',
        meaning: 'ไม่สามารถติดต่อเซิร์ฟเวอร์แปลภาษาได้ในขณะนี้ กรุณาค้นหาคำในคลังคำศัพท์ Tin Talk หรือลองใหม่อีกครั้ง',
        example: '-',
        exampleThai: '-',
        source: 'ai',
        uncertain: true,
        notes: 'คลังคำศัพท์ Tin Talk มีคำศัพท์พร้อมใช้งานกว่า 105 คำ',
      });
      setErrorMsg('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ AI ได้ในขณะนี้ แนะนำให้ค้นหาคำศัพท์จากคลังของแอป');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDirection = () => {
    setDirection((prev) => (prev === 'th_to_dialect' ? 'dialect_to_th' : 'th_to_dialect'));
    // clear result to encourage new translation
    if (result) {
      setInputText(direction === 'th_to_dialect' ? result.dialect : result.thai);
    }
  };

  const handleSpeak = (text: string) => {
    if (!speechAvailable) return;
    setIsPlayingAudio(true);
    speakThai(text, () => setIsPlayingAudio(false), () => setIsPlayingAudio(false));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCurrentResult = () => {
    if (!result) return;
    const wordToSave: DialectWord = {
      id: `saved_${Date.now()}`,
      region: result.region,
      category: 'greeting', // default category
      thai: result.thai,
      dialect: result.dialect,
      pronunciation: result.pronunciation,
      example: result.example,
      exampleThai: result.exampleThai,
      notes: result.notes,
    };
    onSaveWord(wordToSave);
  };

  const isCurrentResultSaved = result
    ? isSaved(result.dialect) || isSaved(`saved_${result.dialect}`)
    : false;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCD2FF] text-[#3D3A4B] text-xs font-medium">
          <span>🌿 ภาคเหนือ • 🌾 ภาคอีสาน • 🌊 ภาคใต้</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#3D3A4B]">
          แปลภาษาถิ่น 3 ภาค
        </h1>
        <p className="text-sm sm:text-base text-[#3D3A4B]/75 font-light">
          ค้นหาความหมาย คำอ่าน และตัวอย่างประโยค แม่นยำด้วยคลังข้อมูลร่วมกับ Gemini AI
        </p>
      </div>

      {/* Region Selector Tabs */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-white border border-[#3D3A4B]/10 shadow-xs max-w-lg mx-auto">
        {(['north', 'isan', 'south'] as Region[]).map((regionKey) => {
          const cfg = REGIONS_CONFIG[regionKey];
          const isSelected = selectedRegion === regionKey;
          return (
            <button
              key={regionKey}
              onClick={() => {
                setSelectedRegion(regionKey);
                setResult(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? `${cfg.bgBadge} text-[#3D3A4B] font-semibold shadow-xs`
                  : 'text-[#3D3A4B]/70 hover:bg-black/5'
              }`}
            >
              <span>{cfg.icon}</span>
              <span>{cfg.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Translation Box Container */}
      <div className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-5 sm:p-8 shadow-sm space-y-6">
        {/* Direction Switcher Header */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10">
          <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-[#3D3A4B]">
            <span className={direction === 'th_to_dialect' ? 'font-semibold text-indigo-900' : 'text-[#3D3A4B]/70'}>
              🇹🇭 ภาษาไทยกลาง
            </span>
          </div>

          <button
            onClick={handleToggleDirection}
            className="p-2.5 rounded-xl bg-[#FFF0A8] hover:bg-[#FFE885] text-[#3D3A4B] shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="สลับทิศทางการแปล"
            aria-label="สลับทิศทางการแปล"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-[#3D3A4B]">
            <span className={direction === 'dialect_to_th' ? 'font-semibold text-emerald-900' : 'text-[#3D3A4B]/70'}>
              {currentRegionCfg.icon} {currentRegionCfg.name}
            </span>
          </div>
        </div>

        {/* Input Area */}
        <div className="relative">
          <label htmlFor="translator-input" className="sr-only">
            ข้อความที่ต้องการแปล
          </label>
          <textarea
            id="translator-input"
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
            placeholder={
              direction === 'th_to_dialect'
                ? `พิมพ์คำหรือประโยคภาษาไทยกลางที่ต้องการแปลเป็น${currentRegionCfg.name} เช่น อร่อย, กิน, พูด...`
                : `พิมพ์คำภาษา${currentRegionCfg.name} เช่น ${
                    selectedRegion === 'north'
                      ? 'กิ๋น, อู้, ม่วน'
                      : selectedRegion === 'isan'
                      ? 'แซบ, เฮ็ด, คึดฮอด'
                      : 'หรอย, เคียด, หลบบ้าน'
                  }...`
            }
            className="w-full p-4 text-lg rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/15 text-[#3D3A4B] placeholder:text-[#3D3A4B]/40 focus:outline-none focus:ring-2 focus:ring-[#DCD2FF] resize-none"
          />

          {inputText && (
            <button
              onClick={() => {
                setInputText('');
                setResult(null);
              }}
              className="absolute right-3 top-3 p-1.5 rounded-lg text-[#3D3A4B]/50 hover:text-[#3D3A4B] hover:bg-black/5"
              title="ล้างข้อความ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Sample Queries */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#3D3A4B]/60 font-medium">ตัวอย่างคำค้น:</span>
          {recentQueries.map((query) => (
            <button
              key={query}
              onClick={() => {
                setInputText(query);
                handleTranslate(query);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#FFFDF8] border border-[#3D3A4B]/10 hover:bg-[#FFF0A8] text-[#3D3A4B]/80 hover:text-[#3D3A4B] transition-colors cursor-pointer"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => handleTranslate()}
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#B8EBD0] hover:bg-[#A3E5C1] disabled:opacity-50 disabled:cursor-not-allowed text-[#3D3A4B] font-medium text-base shadow-sm transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#3D3A4B]/30 border-t-[#3D3A4B] rounded-full animate-spin" />
                <span>กำลังแปลความหมาย...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>แปลภาษา</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FFD9E5] border border-pink-300 text-pink-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Translation Result Card */}
      {result && (
        <div className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
          {/* Header of Result */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#3D3A4B]/10">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentRegionCfg.bgBadge}`}>
                {currentRegionCfg.icon} {getRegionLabel(result.region)}
              </span>

              {result.source === 'database' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#B8EBD0] text-[#3D3A4B] text-xs font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>จากคลังคำศัพท์ Tin Talk</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF0A8] text-[#3D3A4B] text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>แปลด้วย AI (Gemini)</span>
                </span>
              )}

              {result.needsVerify && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFD9E5] text-pink-800 text-xs font-normal">
                  มีสำเนียงเฉพาะถิ่น
                </span>
              )}
            </div>

            {/* Quick Actions: Audio, Copy, Bookmark */}
            <div className="flex items-center gap-2">
              {speechAvailable && (
                <button
                  onClick={() => handleSpeak(direction === 'th_to_dialect' ? result.dialect : result.thai)}
                  disabled={isPlayingAudio}
                  className="p-2.5 rounded-xl bg-[#DCD2FF]/60 hover:bg-[#DCD2FF] text-[#3D3A4B] transition-transform active:scale-95 cursor-pointer"
                  title="ฟังเสียงอ่านออกเสียง"
                  aria-label="ฟังเสียงคำศัพท์"
                >
                  <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                </button>
              )}

              <button
                onClick={() => handleCopy(`${result.dialect} (${result.thai}) - ${result.meaning}`)}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#3D3A4B] transition-transform active:scale-95 cursor-pointer"
                title="คัดลอกผลลัพธ์"
                aria-label="คัดลอกผลลัพธ์"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>

              <button
                onClick={handleSaveCurrentResult}
                className={`p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
                  isCurrentResultSaved
                    ? 'bg-[#FFD9E5] text-pink-700'
                    : 'bg-gray-100 hover:bg-[#FFD9E5]/60 text-[#3D3A4B]'
                }`}
                title={isCurrentResultSaved ? 'บันทึกแล้วในสมุดคำ' : 'บันทึกลงสมุดคำศัพท์'}
                aria-label="บันทึกลงสมุดคำศัพท์"
              >
                {isCurrentResultSaved ? (
                  <BookmarkCheck className="w-5 h-5 fill-pink-500" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Primary Words Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dialect Box */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10 space-y-2">
              <div className="text-xs font-medium text-[#3D3A4B]/60">คำภาษาถิ่น ({currentRegionCfg.shortName}):</div>
              <div className="text-3xl font-semibold text-[#3D3A4B] tracking-tight">
                {result.dialect}
              </div>
              <div className="text-sm text-[#3D3A4B]/80 font-light">
                คำอ่าน: <span className="font-medium text-[#3D3A4B]">{result.pronunciation}</span>
              </div>
            </div>

            {/* Thai Standard Box */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10 space-y-2">
              <div className="text-xs font-medium text-[#3D3A4B]/60">ความหมายภาษาไทยกลาง:</div>
              <div className="text-2xl font-medium text-emerald-800">
                {result.thai}
              </div>
              <p className="text-sm text-[#3D3A4B]/80 font-light leading-relaxed">
                {result.meaning}
              </p>
            </div>
          </div>

          {/* Example Sentence Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#DCD2FF]/20 to-[#B8EBD0]/20 border border-[#3D3A4B]/10 space-y-2">
            <div className="text-xs font-medium text-[#3D3A4B]/70">ตัวอย่างประโยคในชีวิตประจำวัน:</div>
            <p className="text-lg font-medium text-[#3D3A4B] italic">
              "{result.example}"
            </p>
            <p className="text-sm text-[#3D3A4B]/75 font-light">
              แปลว่า: "{result.exampleThai}"
            </p>
          </div>

          {/* Notes or Nuances */}
          {result.notes && (
            <div className="p-4 rounded-xl bg-[#FFF0A8]/40 border border-[#FFF0A8] text-xs text-[#3D3A4B]/90 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>เกร็ดภาษาและข้อแนะนำ:</strong> {result.notes}
              </div>
            </div>
          )}

          {/* AI Disclaimer Warning */}
          {result.source === 'ai' && (
            <div className="pt-2 flex items-center justify-center text-xs text-[#3D3A4B]/65 font-light">
              <span>⚠️ ข้อควรระวัง: ผลแปลจาก AI อาจคลาดเคลื่อน ควรตรวจสอบกับเจ้าของภาษา</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
