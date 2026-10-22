import React from 'react';
import { NavTab } from './Header';
import { Region } from '../types';

interface FooterProps {
  onNavigate: (tab: NavTab, region?: Region) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto bg-white/70 border-t border-[#3D3A4B]/10 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#DCD2FF] via-[#B8EBD0] to-[#FFD6C2] flex items-center justify-center text-sm font-bold shadow-2xs">
                💬
              </div>
              <span className="font-semibold text-2xl tracking-tight" style={{ fontWeight: 600 }}>
                <span className="text-[#6D52C5]">Tin</span>{' '}
                <span className="text-[#1EA068]">Talk</span>
              </span>
            </div>

            <p className="text-sm font-medium text-[#3D3A4B]">
              สโลแกน: "เรียนรู้ทุกถิ่น ได้ยินทุกใจ"
            </p>

            <p className="text-xs text-[#3D3A4B]/70 font-light max-w-md leading-relaxed">
              เว็บแอปพลิเคชันสื่อมัลติมีเดียเพื่อการเรียนรู้และแปลภาษาถิ่น 3 ภาคของไทย 
              (ภาษาเหนือ คำเมือง, ภาษาอีสาน, ภาษาใต้) เพื่อส่งเสริมความเข้าใจในความหลากหลายทางภาษาและวัฒนธรรม
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#3D3A4B] uppercase tracking-wider">
              ฟีเจอร์หลัก
            </div>
            <ul className="space-y-1.5 text-xs text-[#3D3A4B]/75 font-light">
              <li>
                <button
                  onClick={() => onNavigate('translate')}
                  className="hover:text-[#6D52C5] hover:underline cursor-pointer"
                >
                  แปลภาษาถิ่น 3 ภาค
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('flashcards')}
                  className="hover:text-[#6D52C5] hover:underline cursor-pointer"
                >
                  เรียนรู้แฟลชการ์ด 7 หมวด
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="hover:text-[#6D52C5] hover:underline cursor-pointer"
                >
                  ควิซท้าทาย 10 ข้อ/รอบ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('culture')}
                  className="hover:text-[#6D52C5] hover:underline cursor-pointer"
                >
                  มุมวัฒนธรรมและสำเนียง
                </button>
              </li>
            </ul>
          </div>

          {/* Regions & References */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#3D3A4B] uppercase tracking-wider">
              ภูมิภาค & โครงการ
            </div>
            <ul className="space-y-1.5 text-xs text-[#3D3A4B]/75 font-light">
              <li>
                <button
                  onClick={() => onNavigate('flashcards', 'north')}
                  className="hover:text-[#6D52C5] hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌿</span> <span>ภาษาเหนือ (คำเมือง)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('flashcards', 'isan')}
                  className="hover:text-[#6D52C5] hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌾</span> <span>ภาษาอีสาน</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('flashcards', 'south')}
                  className="hover:text-[#6D52C5] hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌊</span> <span>ภาษาใต้</span>
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#6D52C5] hover:underline cursor-pointer font-medium text-[#3D3A4B]"
                >
                  แหล่งอ้างอิง & เกี่ยวกับโครงงาน →
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#3D3A4B]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#3D3A4B]/60 font-light gap-2">
          <div>
            © {new Date().getFullYear()} Tin Talk (ทิน ทอล์ก). เพื่อการศึกษาและการเรียนรู้ภาษาถิ่นไทย.
          </div>
          <div>
            สโลแกน: เรียนรู้ทุกถิ่น ได้ยินทุกใจ 💖
          </div>
        </div>
      </div>
    </footer>
  );
};
