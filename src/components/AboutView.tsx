import React from 'react';
import { 
  Info, 
  BookMarked, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Heart,
  Globe2,
  ExternalLink
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCD2FF] text-[#3D3A4B] text-xs font-medium">
          <Info className="w-4 h-4 text-purple-700" />
          <span>เกี่ยวกับโครงงาน & ข้อมูลวิชาการ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#3D3A4B]">
          เกี่ยวกับโครงการ Tin Talk (ทิน ทอล์ก)
        </h1>
        <p className="text-base text-[#3D3A4B]/80 font-normal">
          สโลแกน: <span className="font-semibold text-[#6D52C5]">"เรียนรู้ทุกถิ่น ได้ยินทุกใจ"</span>
        </p>
      </div>

      {/* Project Overview */}
      <section className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#DCD2FF] flex items-center justify-center text-xl shrink-0">
            💬
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#3D3A4B]">
              ที่มาและวัตถุประสงค์ของ Tin Talk
            </h2>
            <p className="text-xs text-[#3D3A4B]/70 font-light">
              สื่อมัลติมีเดียเพื่อการศึกษาและการอนุรักษ์ความหลากหลายทางภาษาไทย
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#3D3A4B]/80 font-light leading-relaxed">
          <strong>Tin Talk (ทิน ทอล์ก)</strong> เป็นเว็บแอปพลิเคชันสื่อมัลติมีเดียเพื่อการเรียนรู้ภาษาถิ่นของไทย 
          ครอบคลุม 3 ภูมิภาคหลัก ได้แก่ <strong>ภาษาเหนือ (คำเมือง)</strong>, <strong>ภาษาอีสาน</strong>, 
          และ <strong>ภาษาใต้</strong> พัฒนาขึ้นโดยมุ่งเน้นกลุ่มเป้าหมายนักเรียน นิสิต นักศึกษา 
          ตลอดจนบุคคลทั่วไปที่ต้องการเดินทาง ท่องเที่ยว ทำงาน หรือสื่อสารกับคนต่างถิ่นได้อย่างเข้าใจ ลึกซึ้ง และเคารพในความหลากหลาย
        </p>

        <p className="text-sm sm:text-base text-[#3D3A4B]/80 font-light leading-relaxed">
          ด้วยแนวคิด <span className="text-[#6D52C5] font-medium">"เรียนรู้ทุกถิ่น ได้ยินทุกใจ"</span> แอปพลิเคชันนี้จึงไม่ได้ทำหน้าที่เป็นเพียงแค่พจนานุกรมแปลคำ 
          แต่เป็นสะพานเชื่อมใจที่นำเสนอทั้งบริบทวัฒนธรรม ท่วงทำนองเสียงอ่าน คำลงท้าย และวิถีชีวิตจริงของแต่ละท้องถิ่น
        </p>
      </section>

      {/* Features & Pedagogical Design */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#3D3A4B]/10 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[#B8EBD0] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-emerald-800" />
          </div>
          <h3 className="text-lg font-semibold text-[#3D3A4B]">
            กลุ่มเป้าหมาย & ประโยชน์ในการเรียนรู้
          </h3>
          <ul className="text-xs sm:text-sm text-[#3D3A4B]/75 font-light space-y-2 leading-relaxed">
            <li>• <strong>นักเรียนและนักศึกษา:</strong> ใช้เป็นสื่อเสริมวิชาภาษาไทย สังคมศึกษา และพหุวัฒนธรรม</li>
            <li>• <strong>ผู้เดินทางและนักท่องเที่ยว:</strong> เข้าใจคำศัพท์ตลาด การเดินทาง และการทักทายคนท้องถิ่น</li>
            <li>• <strong>ประชาชนทั่วไป:</strong> เสริมสร้างความเข้าใจอันดีและลดอุปสรรคทางภาษาข้ามวัฒนธรรม</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#3D3A4B]/10 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF0A8] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="text-lg font-semibold text-[#3D3A4B]">
            นวัตกรรมเทคโนโลยีที่ใช้
          </h3>
          <ul className="text-xs sm:text-sm text-[#3D3A4B]/75 font-light space-y-2 leading-relaxed">
            <li>• <strong>ฐานข้อมูลคำศัพท์มาตรฐาน:</strong> บันทึกคำศัพท์ถิ่นพื้นฐานพร้อมตรวจสอบความถูกต้อง</li>
            <li>• <strong>Google Gemini API:</strong> ช่วยแปลและอธิบายคำศัพท์เชิงลึกที่ไม่ปรากฏในคลังข้อมูล</li>
            <li>• <strong>Web Speech API:</strong> เสียงอ่านออกเสียงภาษาไทยสำหรับผู้เริ่มต้นฝึกพูด</li>
            <li>• <strong>Local-first Storage:</strong> บันทึกความคืบหน้า ควิซ และสมุดคำไว้ในเครื่องของผู้ใช้โดยตรง</li>
          </ul>
        </div>
      </section>

      {/* Academic References Section */}
      <section className="rounded-3xl bg-white border border-[#3D3A4B]/10 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFD6C2] flex items-center justify-center text-xl shrink-0">
            <BookMarked className="w-5 h-5 text-orange-800" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#3D3A4B]">
              แหล่งอ้างอิงทางวิชาการและพจนานุกรม
            </h2>
            <p className="text-xs text-[#3D3A4B]/70 font-light">
              ข้อมูลคำศัพท์และสำเนียงได้รับการตรวจสอบและอ้างอิงจากแหล่งข้อมูลมาตรฐาน
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#3D3A4B]/80 font-light divide-y divide-[#3D3A4B]/5">
          <div className="pt-2">
            <strong>1. สำนักงานราชบัณฑิตยสภา:</strong> พจนานุกรมภาษาไทยถิ่น ฉบับราชบัณฑิตยสภา พ.ศ. 2550
          </div>
          <div className="pt-2">
            <strong>2. ภาควิชาภาษาไทย คณะมนุษยศาสตร์ มหาวิทยาลัยเชียงใหม่:</strong> สารานุกรมวัฒนธรรมไทยภาคเหนือ และพจนานุกรมภาษาล้านนาไทย
          </div>
          <div className="pt-2">
            <strong>3. สถาบันวิจัยภาษาและวัฒนธรรมเอเชีย มหาวิทยาลัยมหิดล:</strong> คลังข้อมูลภาษาถิ่นกลุ่มไตและภาษาอีสาน
          </div>
          <div className="pt-2">
            <strong>4. ปรีชา พิณทอง:</strong> สารานุกรมภาษาอีสาน-ไทย-อังกฤษ (พจนานุกรมภาษาอีสานฉบับสมบูรณ์)
          </div>
          <div className="pt-2">
            <strong>5. สถาบันทักษิณคดีศึกษา มหาวิทยาลัยทักษิณ:</strong> สารานุกรมวัฒนธรรมภาคใต้ และพจนานุกรมภาษาไทยถิ่นใต้
          </div>
        </div>
      </section>

      {/* Disclaimer & Ethics */}
      <section className="rounded-2xl bg-[#FFF0A8]/30 border border-[#FFF0A8] p-5 text-xs text-[#3D3A4B]/80 font-light space-y-2">
        <div className="flex items-center gap-2 font-medium text-[#3D3A4B]">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>ข้อสังเกตและการใช้ระบบแปลภาษา AI อย่างมีความรับผิดชอบ</span>
        </div>
        <p className="leading-relaxed">
          ภาษาถิ่นไทยแต่ละภาคมีความหลากหลายตามชุมชนและจังหวัดย่อย (เช่น คำเมืองเชียงใหม่ vs ลำปาง vs เชียงราย, 
          ภาษาอีสานตอนบน vs ตอนล่าง, สำเนียงปักษ์ใต้สงขลา vs นครศรีธรรมราช vs ภูเก็ต) 
          การแสดงผลแปลจากแบบจำลอง AI เป็นการเทียบเคียงความหมายเพื่อการศึกษาเบื้องต้น 
          ผู้ใช้งานควรเรียนรู้ร่วมกับการสังเกตและสนทนากับเจ้าของภาษาในพื้นที่จริงเพื่อความถูกต้องตามบริบทวัฒนธรรม
        </p>
      </section>

      {/* Developer Credits */}
      <div className="text-center pt-4 text-xs text-[#3D3A4B]/60 font-light">
        Tin Talk (ทิน ทอล์ก) • โครงการสื่อการเรียนรู้ภาษาและวัฒนธรรมไทย • สงวนลิขสิทธิ์เพื่อการศึกษา
      </div>
    </div>
  );
};
