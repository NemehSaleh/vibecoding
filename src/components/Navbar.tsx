import React, { useState, useEffect } from 'react';
import { SectionType } from '../types';
import { isSoundMuted, setSoundMuted, playClickSound } from '../utils/soundEffects';
import { 
  Sparkles, 
  BookOpen, 
  Terminal, 
  Library, 
  LayoutDashboard, 
  HelpCircle, 
  Menu, 
  X,
  Trophy,
  Compass,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NavbarProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  openGlossary: () => void;
  openTour: () => void;
  xp: number;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  openGlossary,
  openTour,
  xp,
  darkMode,
  setDarkMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [muted, setMutedState] = useState<boolean>(() => isSoundMuted());

  const navItems: { id: SectionType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'learning', label: 'المسار التعليمي', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simulator', label: 'المحاكي', icon: <Terminal className="w-4 h-4" /> },
    { id: 'library', label: 'مكتبة الأوامر', icon: <Library className="w-4 h-4" /> },
    { id: 'dashboard', label: 'لوحة التقدم', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: SectionType) => {
    playClickSound();
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setSoundMuted(nextMuted);
    setMutedState(nextMuted);
    if (!nextMuted) playClickSound();
  };

  const toggleDarkMode = () => {
    playClickSound();
    setDarkMode(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 space-x-reverse cursor-pointer group"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition duration-300">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="font-black text-lg md:text-xl text-white tracking-tight">ڤايب كود</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">عربي</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">تعلم البرمجة بالذكاء الاصطناعي لغير المبرمجين</p>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl text-sm font-bold transition duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Badge & Glossary Modal Trigger */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* XP Badge */}
            <div className="flex items-center space-x-1.5 space-x-reverse bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm">
              <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{xp} XP</span>
            </div>

            {/* Dark Mode High-Contrast Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition flex items-center justify-center ${
                darkMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={darkMode ? "الوضع المضيء" : "الوضع الليلي عالي التباين"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>

            {/* Audio Effects Toggle Button */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition flex items-center justify-center ${
                !muted
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/20'
                  : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
              }`}
              title={muted ? "تشغيل المؤثرات الصوتية" : "كتم المؤثرات الصوتية"}
            >
              {!muted ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>

            {/* Onboarding Tour Button */}
            <button
              onClick={openTour}
              className="flex items-center space-x-1.5 space-x-reverse bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl font-bold text-xs md:text-sm transition"
              title="جولة تعليمية تفاعلية"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">جولة تعليمية</span>
            </button>

            {/* Glossary Button */}
            <button
              onClick={openGlossary}
              className="flex items-center space-x-1.5 space-x-reverse bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl font-semibold text-xs md:text-sm transition"
              title="قاموس المصطلحات الميسرة"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">القاموس</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl border border-slate-700"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl text-base font-bold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
