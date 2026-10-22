import React, { useState } from 'react';
import { 
  Compass, 
  Volume2, 
  Sparkles, 
  Quote, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { Region } from '../types';
import { CULTURAL_STORIES, CultureCard } from '../data/culturalInfo';
import { REGIONS_CONFIG } from '../data/dialectDatabase';
import { speakThai, isSpeechSupported } from '../utils/speechHelper';

export const CultureView: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const speechAvailable = isSpeechSupported();

  const handleSpeak = (text: string) => {
    if (!speechAvailable) return;
    setIsPlayingAudio(true);
    speakThai(text, () => setIsPlayingAudio(false), () => setIsPlayingAudio(false));
  };

  const filteredStories = selectedRegion === 'all'
    ? CULTURAL_STORIES
    : CULTURAL_STORIES.filter((s) => s.region === selectedRegion);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCD2FF] text-[#3D3A4B] text-xs font-medium">
          <Compass className="w-4 h-4 text-indigo-700" />
          <span>มุมวัฒนธรรมและภาษาถิ่น</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#3D3A4B]">
          เกร็ดวัฒนธรรม คำลงท้าย และสำเนียง
        </h1>
        <p className="text-sm sm:text-base text-[#3D3A4B]/75 font-light">
          เข้าใจบริบท มารยาท และวิถีชีวิตเพื่อการสื่อสารที่เข้าถึงใจคนทุกถิ่น
        </p>
      </div>

      {/* Region Filter Buttons */}
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

      {/* Cultural Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStories.map((story) => {
          const regCfg = REGIONS_CONFIG[story.region];
          return (
            <div
              key={story.id}
              className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${regCfg.bgBadge}`}>
                    {story.icon} {regCfg.shortName}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-lg bg-gray-100 text-[#3D3A4B]/70 font-light">
                    {story.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#3D3A4B] mb-1">
                    {story.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3D3A4B]/70 font-light">
                    {story.subtitle}
                  </p>
                </div>

                {/* Content Bullets */}
                <ul className="space-y-2 text-sm text-[#3D3A4B]/80 font-light leading-relaxed">
                  {story.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-xs text-indigo-500 mt-1 shrink-0">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Useful Phrases Box */}
              <div className="pt-4 border-t border-[#3D3A4B]/10 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#3D3A4B]">
                  <Quote className="w-3.5 h-3.5 text-amber-600" />
                  <span>วลีทองติดปากที่ควรรู้:</span>
                </div>

                <div className="space-y-2">
                  {story.phrases.map((phrase, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#3D3A4B]/10 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="text-base font-semibold text-[#3D3A4B]">
                          "{phrase.phrase}"
                        </div>
                        <div className="text-xs text-emerald-800 font-medium">
                          หมายถึง: {phrase.meaning}
                        </div>
                        <div className="text-2xs text-[#3D3A4B]/60 font-light mt-0.5">
                          สถานการณ์: {phrase.situation}
                        </div>
                      </div>

                      {speechAvailable && (
                        <button
                          onClick={() => handleSpeak(phrase.phrase)}
                          disabled={isPlayingAudio}
                          className="p-2 rounded-xl bg-white hover:bg-[#DCD2FF]/60 text-[#3D3A4B] shadow-2xs shrink-0 cursor-pointer"
                          title="ฟังเสียงอ่านสำเนียง"
                          aria-label={`ฟังเสียงวลี ${phrase.phrase}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
