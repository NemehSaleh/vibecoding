import React from 'react';
import { SectionType } from '../types';

interface FooterProps {
  setActiveSection: (section: SectionType) => void;
  openGlossary: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveSection, openGlossary }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand & Bio */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-base shadow-md">
              ⚡
            </div>
            <span className="font-extrabold text-xl text-white">ڤايب كود عربي</span>
          </div>
          <p className="text-sm leading-relaxed max-w-md text-slate-400">
            منصة تعليمية تفاعلية مصممة خصيصاً لتمكين غير المبرمجين في العالم العربي من بناء أفكارهم وتطبيقاتهم الإلكترونية باستخدام الذكاء الاصطناعي Gemini وGitHub بدون الحاجة لكتابة الأكواد المعقدة.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-base mb-4">أقسام المنصة</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => { setActiveSection('home'); window.scrollTo(0, 0); }} className="hover:text-indigo-400 transition">الرئيسية</button>
            </li>
            <li>
              <button onClick={() => { setActiveSection('learning'); window.scrollTo(0, 0); }} className="hover:text-indigo-400 transition">المسار التعليمي</button>
            </li>
            <li>
              <button onClick={() => { setActiveSection('simulator'); window.scrollTo(0, 0); }} className="hover:text-indigo-400 transition">محاكي الـ Vibe</button>
            </li>
            <li>
              <button onClick={() => { setActiveSection('library'); window.scrollTo(0, 0); }} className="hover:text-indigo-400 transition">مكتبة الأوامر الجاهزة</button>
            </li>
            <li>
              <button onClick={() => { setActiveSection('dashboard'); window.scrollTo(0, 0); }} className="hover:text-indigo-400 transition">لوحة التقدم والشارات</button>
            </li>
          </ul>
        </div>

        {/* Col 3: Tech Terms & Tools */}
        <div>
          <h4 className="text-white font-bold text-base mb-4">أدوات ومصطلحات</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={openGlossary} className="hover:text-indigo-400 transition">قاموس المصطلحات الميسرة</button>
            </li>
            <li>
              <span className="text-slate-500">Google Gemini 2.5 Flash</span>
            </li>
            <li>
              <span className="text-slate-500">GitHub السحابي</span>
            </li>
            <li>
              <span className="text-slate-500">Tailwind CSS & React</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 ڤايب كود عربي | تم البناء لتمكين الابتكار بالذكاء الاصطناعي.</p>
        <p className="flex items-center gap-1">
          مستوحى من ثورة Vibe Coding ورؤية تمكين غير المبرمجين 🚀
        </p>
      </div>
    </footer>
  );
};
