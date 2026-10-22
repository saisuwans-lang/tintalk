import React, { useState } from 'react';
import { 
  Languages, 
  BookOpen, 
  Sparkles, 
  Compass, 
  BarChart2, 
  Info, 
  Menu, 
  X, 
  Flame, 
  Bookmark, 
  Home
} from 'lucide-react';

export type NavTab = 'home' | 'translate' | 'flashcards' | 'quiz' | 'culture' | 'progress' | 'about';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  streak: number;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  streak,
  savedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'หน้าแรก', icon: <Home className="w-4 h-4" /> },
    { id: 'translate', label: 'แปลภาษา', icon: <Languages className="w-4 h-4" /> },
    { id: 'flashcards', label: 'เรียนคำศัพท์', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz', label: 'ควิซท้าทาย', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'culture', label: 'มุมวัฒนธรรม', icon: <Compass className="w-4 h-4" /> },
    { id: 'progress', label: 'ความคืบหน้า', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'about', label: 'เกี่ยวกับ', icon: <Info className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#3D3A4B]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Slogan */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            aria-label="Tin Talk หน้าแรก"
          >
            {/* Cute Speech Bubble Icon */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#DCD2FF] via-[#B8EBD0] to-[#FFD6C2] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <svg 
                className="w-6 h-6 text-[#3D3A4B]" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 9h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1zm3-4H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z" />
              </svg>
              {/* Cute cheek dots */}
              <span className="absolute -bottom-1 -right-1 text-xs">✨</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline font-semibold text-2xl sm:text-3xl tracking-tight leading-none" style={{ fontWeight: 600 }}>
                <span className="text-[#6D52C5] drop-shadow-xs">Tin</span>
                <span className="text-[#1EA068] ml-1 drop-shadow-xs">Talk</span>
                <span className="text-xs ml-1.5 px-2 py-0.5 rounded-full bg-[#FFF0A8] text-[#3D3A4B] font-medium hidden sm:inline-block">
                  ทิน ทอล์ก
                </span>
              </div>
              <p className="text-xs text-[#3D3A4B]/75 font-light mt-0.5 tracking-normal">
                เรียนรู้ทุกถิ่น ได้ยินทุกใจ
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="แถบเมนูหลัก">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#DCD2FF] text-[#3D3A4B] shadow-xs scale-102 font-semibold'
                      : 'text-[#3D3A4B]/80 hover:bg-[#DCD2FF]/35 hover:text-[#3D3A4B]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <button
              onClick={() => handleTabClick('progress')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF0A8] text-[#3D3A4B] text-xs sm:text-sm font-medium shadow-xs hover:bg-[#FFE98A] transition-all cursor-pointer"
              title={`คุณเรียนต่อเนื่องแล้ว ${streak} วัน`}
              aria-label={`เรียนต่อเนื่อง ${streak} วัน`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streak} วัน</span>
            </button>

            {/* Saved Words Count */}
            <button
              onClick={() => handleTabClick('progress')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFD9E5] text-[#3D3A4B] text-xs sm:text-sm font-medium shadow-xs hover:bg-[#FFC4D6] transition-all cursor-pointer"
              title={`คำศัพท์ที่บันทึกไว้ ${savedCount} คำ`}
              aria-label={`สมุดคำศัพท์ ${savedCount} คำ`}
            >
              <Bookmark className="w-4 h-4 text-pink-600 fill-pink-600/30" />
              <span className="hidden sm:inline">สมุดคำ</span>
              <span>{savedCount}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl bg-[#DCD2FF]/60 text-[#3D3A4B] hover:bg-[#DCD2FF] transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF8] border-b border-[#3D3A4B]/10 px-4 pt-2 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#DCD2FF] text-[#3D3A4B] font-semibold shadow-xs'
                      : 'bg-white/80 border border-[#3D3A4B]/5 text-[#3D3A4B]/80 hover:bg-[#DCD2FF]/40'
                  }`}
                >
                  <span className="p-1 rounded-lg bg-[#FFFDF8]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#3D3A4B]/10 flex items-center justify-between text-xs text-[#3D3A4B]/70 px-2 font-light">
            <span>🌾 อีสาน • 🌿 เหนือ • 🌊 ใต้</span>
            <span>สโลแกน: เรียนรู้ทุกถิ่น ได้ยินทุกใจ</span>
          </div>
        </div>
      )}
    </header>
  );
};
