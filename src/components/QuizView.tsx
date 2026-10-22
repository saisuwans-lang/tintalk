import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Star, 
  Trophy, 
  Volume2,
  Award,
  HelpCircle
} from 'lucide-react';
import { Region, QuizQuestion, DialectWord } from '../types';
import { DIALECT_DATABASE, REGIONS_CONFIG } from '../data/dialectDatabase';
import { generateQuizQuestions, getRegionLabel } from '../utils/dialectLogic';
import { speakThai, isSpeechSupported } from '../utils/speechHelper';

interface QuizViewProps {
  initialRegion?: Region;
  onRecordQuizResult: (record: { region: string; score: number; total: number; percentage: number }) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialRegion = 'north',
  onRecordQuizResult,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>(initialRegion);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const speechAvailable = isSpeechSupported();

  // Start new quiz round
  const startQuiz = (region: Region | 'all' = selectedRegion) => {
    const newQuestions = generateQuizQuestions(DIALECT_DATABASE, region, 10);
    setQuestions(newQuestions);
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    startQuiz(selectedRegion);
  }, [selectedRegion]);

  const currentQ = questions[currentIdx] as QuizQuestion | undefined;

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      // Quiz complete
      setIsCompleted(true);
      const finalScore = score + (selectedOptionId && currentQ?.options.find((o) => o.id === selectedOptionId)?.isCorrect ? 0 : 0);
      const percentage = Math.round((finalScore / questions.length) * 100);

      onRecordQuizResult({
        region: selectedRegion === 'all' ? 'ทุกภาค' : REGIONS_CONFIG[selectedRegion].shortName,
        score: finalScore,
        total: questions.length,
        percentage,
      });

      // Confetti celebration if scored well
      try {
        if (finalScore >= 6) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#B8EBD0', '#DCD2FF', '#FFD6C2', '#FFF0A8', '#FFD9E5'],
          });
        }
      } catch (e) {
        // ignore confetti errors
      }
    }
  };

  const handleSpeak = (text: string) => {
    if (!speechAvailable) return;
    setIsPlayingAudio(true);
    speakThai(text, () => setIsPlayingAudio(false), () => setIsPlayingAudio(false));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0A8] text-[#3D3A4B] text-xs font-medium">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>แบบทดสอบทายใจภาษาถิ่น 10 ข้อ/รอบ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#3D3A4B]">
          ควิซท้าทายความรู้ภาษาถิ่น
        </h1>
        <p className="text-sm sm:text-base text-[#3D3A4B]/75 font-light">
          ทดสอบความจำและความเข้าใจ สนุกสนาน พร้อมเฉลยละเอียดและคำอ่าน
        </p>
      </div>

      {/* Region Selector Filter */}
      {!isCompleted && (
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white border border-[#3D3A4B]/10 shadow-xs max-w-xl mx-auto">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedRegion === 'all'
                ? 'bg-[#3D3A4B] text-white font-semibold shadow-xs'
                : 'text-[#3D3A4B]/70 hover:bg-black/5'
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
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? `${cfg.bgBadge} text-[#3D3A4B] font-semibold shadow-xs`
                    : 'text-[#3D3A4B]/70 hover:bg-black/5'
                }`}
              >
                <span>{cfg.icon}</span> <span>{cfg.shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* QUIZ ACTIVE SCREEN */}
      {!isCompleted && currentQ && (
        <div className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-9 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#3D3A4B]/75 pb-2">
            <span className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${REGIONS_CONFIG[currentQ.region].bgBadge}`}>
                {REGIONS_CONFIG[currentQ.region].icon} {REGIONS_CONFIG[currentQ.region].shortName}
              </span>
              <span>ข้อที่ {currentIdx + 1} จาก {questions.length}</span>
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF0A8] text-[#3D3A4B]">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>คะแนน: {score}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#3D3A4B]/10 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#B8EBD0] h-2.5 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Prompt */}
          <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10 space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#3D3A4B] leading-snug">
              {currentQ.prompt}
            </h2>
            {currentQ.subPrompt && (
              <p className="text-xs sm:text-sm text-[#3D3A4B]/70 font-light">
                {currentQ.subPrompt}
              </p>
            )}
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let btnClass = 'bg-white border-[#3D3A4B]/15 text-[#3D3A4B] hover:bg-black/5';

              if (hasAnswered) {
                if (option.isCorrect) {
                  // Mint Green for correct answer!
                  btnClass = 'bg-[#B8EBD0] border-emerald-500 text-[#3D3A4B] font-semibold ring-2 ring-emerald-400';
                } else if (isSelected && !option.isCorrect) {
                  // Soft Pink for incorrect answer!
                  btnClass = 'bg-[#FFD9E5] border-pink-400 text-pink-900 font-medium';
                } else {
                  btnClass = 'opacity-50 bg-gray-50 border-gray-200 text-[#3D3A4B]/60';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id, option.isCorrect)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between text-base sm:text-lg transition-all duration-200 cursor-pointer ${btnClass}`}
                >
                  <span className="font-medium">{option.text}</span>

                  {hasAnswered && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-pink-700 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Card after answer */}
          {hasAnswered && (
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedOptionId && currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
                    <span className="px-3 py-1 rounded-full bg-[#B8EBD0] text-emerald-900 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> เก่งมาก! ตอบถูกต้อง
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#FFD9E5] text-pink-900 text-xs font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> ยังไม่ถูกนะ แต่ไม่เป็นไร!
                    </span>
                  )}
                </div>

                {speechAvailable && (
                  <button
                    onClick={() => handleSpeak(currentQ.correctWord.dialect)}
                    disabled={isPlayingAudio}
                    className="p-1.5 rounded-lg hover:bg-black/5 text-[#3D3A4B] text-xs flex items-center gap-1"
                    title="ฟังเสียงอ่านสำเนียง"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>ฟังสำเนียง</span>
                  </button>
                )}
              </div>

              <div className="text-sm text-[#3D3A4B] space-y-1">
                <div>
                  <strong>คำตอบที่ถูกต้อง:</strong>{' '}
                  <span className="font-semibold text-emerald-900">{currentQ.correctWord.dialect}</span>{' '}
                  <span className="text-[#3D3A4B]/70 font-light">({currentQ.correctWord.pronunciation})</span>
                  {' = '}{currentQ.correctWord.thai}
                </div>
                <div className="text-xs text-[#3D3A4B]/80 font-light italic bg-white p-2.5 rounded-xl border border-black/5">
                  ตัวอย่าง: "{currentQ.correctWord.example}" ({currentQ.correctWord.exampleThai})
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#B8EBD0] hover:bg-[#A3E5C1] text-[#3D3A4B] font-medium text-sm shadow-xs transition-all cursor-pointer"
                >
                  <span>{currentIdx + 1 === questions.length ? 'ดูผลคะแนนรวม' : 'ข้อถัดไป'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUIZ COMPLETED SCREEN */}
      {isCompleted && (
        <div className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-8 sm:p-12 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-[#FFF0A8] flex items-center justify-center mx-auto text-4xl shadow-xs">
            <Trophy className="w-10 h-10 text-amber-600" />
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-[#3D3A4B]">
              ยินดีด้วย! ทำควิซครบ 10 ข้อแล้ว
            </h2>
            <p className="text-sm sm:text-base text-[#3D3A4B]/70 font-light mt-1">
              แบบทดสอบ: {selectedRegion === 'all' ? 'ทุกภูมิภาค' : REGIONS_CONFIG[selectedRegion].name}
            </p>
          </div>

          {/* Butter Yellow Stars Display */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((starNum) => {
              const starThreshold = starNum * 2;
              const isFilled = score >= starThreshold - 1;
              return (
                <div
                  key={starNum}
                  className={`p-2 rounded-2xl transition-all ${
                    isFilled ? 'bg-[#FFF0A8] text-amber-500 scale-110' : 'bg-gray-100 text-gray-300'
                  }`}
                >
                  <Star className={`w-7 h-7 ${isFilled ? 'fill-amber-400 text-amber-500' : ''}`} />
                </div>
              );
            })}
          </div>

          {/* Score Numbers Card */}
          <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10 max-w-sm mx-auto">
            <div className="text-5xl font-semibold text-[#3D3A4B]">
              {score} <span className="text-2xl font-normal text-[#3D3A4B]/60">/ 10</span>
            </div>
            <div className="text-sm font-medium text-emerald-800 mt-2">
              คิดเป็น {Math.round((score / 10) * 100)}%
            </div>
            <p className="text-xs text-[#3D3A4B]/70 font-light mt-1">
              {score >= 8
                ? 'ยอดเยี่ยมมาก! คุณเข้าใจภาษาถิ่นได้ระดับผู้เชี่ยวชาญ 🌟'
                : score >= 5
                ? 'ทำได้ดีทีเดียว! ฝึกฝนอีกนิดจะคุยกับคนท้องถิ่นคล่องปร๋อ 👍'
                : 'เริ่มต้นได้ดีมาก! มาทบทวนคำศัพท์ในแฟลชการ์ดแล้วลองใหม่อีกครั้งนะ 💖'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => startQuiz(selectedRegion)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#B8EBD0] hover:bg-[#A3E5C1] text-[#3D3A4B] font-medium text-base shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>เล่นใหม่อีกรอบ</span>
            </button>

            <button
              onClick={() => setSelectedRegion(selectedRegion === 'north' ? 'isan' : selectedRegion === 'isan' ? 'south' : 'north')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#DCD2FF] hover:bg-[#CEBFFF] text-[#3D3A4B] font-medium text-base shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-purple-700" />
              <span>ลองท้าทายภาคอื่น</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
