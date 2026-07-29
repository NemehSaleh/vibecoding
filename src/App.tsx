import { safeGetItem, safeSetItem, safeRemoveItem } from './utils/storage';
import React, { useState, useEffect, useRef } from 'react';
import { SectionType, UserProgress, AchievementBadge } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { GlossaryModal } from './components/GlossaryModal';
import { OnboardingTourModal } from './components/OnboardingTourModal';
import { HomeSection } from './components/HomeSection';
import { LearningPathSection } from './components/LearningPathSection';
import { SimulatorSection } from './components/SimulatorSection';
import { PromptLibrarySection } from './components/PromptLibrarySection';
import { DashboardSection } from './components/DashboardSection';
import { ConfirmModal } from './components/ConfirmModal';
import { playLevelCompleteSound, playBadgeUnlockSound, playXPGainSound, playClickSound } from './utils/soundEffects';
import { triggerBadgeConfetti } from './utils/confetti';

const initialBadges: AchievementBadge[] = [
  {
    id: 'badge-1',
    title: 'شعار المبتدئ الذكي 🧠',
    description: 'إكمال المستوى الأول وفهم فلسفة الـ Vibe Coding.',
    howToEarn: 'انتقل للمسار التعليمي واقرأ دروس المستوى الأول (مدخل الـ Vibe Coding) ثم أجب على أسئلة الاختبار بنجاح.',
    icon: '🧠',
    isUnlocked: false,
    category: 'learning'
  },
  {
    id: 'badge-2',
    title: 'مهندس الأوامر C-A-R-T ⚡',
    description: 'إكمال مستوى صياغة الأوامر لـ Gemini.',
    howToEarn: 'أكمل دروس المستوى الثاني الخاص بالصياغة الاحترافية وفق نموذج C-A-R-T واجتز الاختبار الخاص به.',
    icon: '⚡',
    isUnlocked: false,
    category: 'learning'
  },
  {
    id: 'badge-3',
    title: 'ملك الخزانة السحابية ☁️',
    description: 'تعلم كيفية حفظ المشاريع ونشرها في GitHub.',
    howToEarn: 'أكمل المستوى الثالث الخاص بإدارة المشاريع والأكواد والمزامنة السحابية عبر GitHub.',
    icon: '☁️',
    isUnlocked: false,
    category: 'learning'
  },
  {
    id: 'badge-4',
    title: 'صانع التطبيقات 🎨',
    description: 'توليد وتجربة تطبيقك الأول داخل المحاكي.',
    howToEarn: 'ادخل قسم المحاكي (Simulator)، اكتب أو اختر أمراً لتوليد تطبيق تفاعلي واضغط على زر "توليد التطبيق والتعديل".',
    icon: '🎨',
    isUnlocked: false,
    category: 'simulator'
  },
  {
    id: 'badge-5',
    title: 'قائد الـ Vibe Master 🏆',
    description: 'إكمال جميع مستويات المسار التعليمي بنجاح!',
    howToEarn: 'أكمل جميع مستويات المسار التعليمي الـ 5 بنسبة إتقان كاملة واجتز كافة الاختبارات بنجاح.',
    icon: '🏆',
    isUnlocked: false,
    category: 'general'
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('home');
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);
  const [tourOpen, setTourOpen] = useState<boolean>(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [simulatorPrompt, setSimulatorPrompt] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = safeGetItem('vibe_dark_mode');
    return savedMode !== null ? savedMode === 'true' : true; // default to high-contrast dark theme
  });

  const prevXpRef = useRef<number>(150);

  // Sync Dark Mode state
  useEffect(() => {
    safeSetItem('vibe_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-launch Onboarding Tour on First Visit
  useEffect(() => {
    const tourCompleted = safeGetItem('vibe_tour_completed');
    if (!tourCompleted) {
      const timer = setTimeout(() => {
        setTourOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Local Storage User Progress State
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = safeGetItem('vibe_arabic_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      xp: 150,
      completedLevelIds: [],
      generatedAppsCount: 1,
      copiedPromptsCount: 0,
      unlockedBadgeIds: [],
      simulatorHistory: []
    };
  });

  const [badges, setBadges] = useState<AchievementBadge[]>(initialBadges);

  // Audio Feedback on XP Increase
  useEffect(() => {
    if (userProgress.xp > prevXpRef.current) {
      playXPGainSound();
    }
    prevXpRef.current = userProgress.xp;
  }, [userProgress.xp]);

  // Sync Progress to LocalStorage
  useEffect(() => {
    safeSetItem('vibe_arabic_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Check Badge Unlocks dynamically and trigger Badge Unlock Sound
  useEffect(() => {
    setBadges(prevBadges => {
      let newlyUnlocked = false;
      const updated = prevBadges.map(badge => {
        let unlocked = badge.isUnlocked;

        if (badge.id === 'badge-1' && userProgress.completedLevelIds.includes(1)) unlocked = true;
        if (badge.id === 'badge-2' && userProgress.completedLevelIds.includes(2)) unlocked = true;
        if (badge.id === 'badge-3' && userProgress.completedLevelIds.includes(3)) unlocked = true;
        if (badge.id === 'badge-4' && userProgress.generatedAppsCount > 0) unlocked = true;
        if (badge.id === 'badge-5' && userProgress.completedLevelIds.length === 5) unlocked = true;

        if (!badge.isUnlocked && unlocked) {
          newlyUnlocked = true;
        }

        return { ...badge, isUnlocked: unlocked };
      });

      if (newlyUnlocked) {
        playBadgeUnlockSound();
        triggerBadgeConfetti();
      }

      return updated;
    });
  }, [userProgress]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({
      id: Date.now().toString(),
      type,
      text
    });
  };

  // Complete a Learning Path Level and save Quiz Score
  const handleCompleteLevel = (levelId: number, xpValue: number, scorePercentage: number = 100) => {
    playLevelCompleteSound();
    setUserProgress(prev => {
      const alreadyCompleted = prev.completedLevelIds.includes(levelId);
      const updatedLevelIds = alreadyCompleted ? prev.completedLevelIds : [...prev.completedLevelIds, levelId];
      const xpToAdd = alreadyCompleted ? Math.round(xpValue * 0.2) : xpValue; // bonus for retakes or full initial completion
      const updatedScores = { ...(prev.quizScores || {}), [levelId]: scorePercentage };

      return {
        ...prev,
        xp: prev.xp + xpToAdd,
        completedLevelIds: updatedLevelIds,
        quizScores: updatedScores
      };
    });
  };

  // Trigger when app is generated in simulator
  const handleAppGeneratedInSimulator = () => {
    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + 50,
      generatedAppsCount: prev.generatedAppsCount + 1
    }));
  };

  // Trigger when prompt is copied
  const handleCopyPrompt = () => {
    setUserProgress(prev => ({
      ...prev,
      copiedPromptsCount: prev.copiedPromptsCount + 1
    }));
  };

  // Load Prompt into Simulator and switch view
  const loadPromptIntoSimulator = (promptText: string) => {
    setSimulatorPrompt(promptText);
    setActiveSection('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('تم تحميل النص في المحاكي! اضغط على زر التوليد لبدء البناء ⚡', 'info');
  };

  // Reset Progress
  const handleResetProgressRequest = () => {
    setResetConfirmOpen(true);
  };

  const executeResetProgress = () => {
    const defaultState: UserProgress = {
      xp: 0,
      completedLevelIds: [],
      generatedAppsCount: 0,
      copiedPromptsCount: 0,
      unlockedBadgeIds: [],
      simulatorHistory: []
    };
    setUserProgress(defaultState);
    safeRemoveItem('vibe_arabic_progress');
    setResetConfirmOpen(false);
    showToast('تم تصفير تقدمك وإعادة الضبط بنجاح 🔄', 'info');
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Navbar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        openGlossary={() => setGlossaryOpen(true)}
        openTour={() => setTourOpen(true)}
        xp={userProgress.xp}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Section Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {activeSection === 'home' && (
          <HomeSection
            setActiveSection={setActiveSection}
            loadPromptIntoSimulator={loadPromptIntoSimulator}
          />
        )}

        {activeSection === 'learning' && (
          <LearningPathSection
            completedLevelIds={userProgress.completedLevelIds}
            onCompleteLevel={handleCompleteLevel}
            showToast={showToast}
          />
        )}

        {activeSection === 'simulator' && (
          <SimulatorSection
            initialPrompt={simulatorPrompt}
            onAppGenerated={handleAppGeneratedInSimulator}
            showToast={showToast}
          />
        )}

        {activeSection === 'library' && (
          <PromptLibrarySection
            loadPromptIntoSimulator={loadPromptIntoSimulator}
            showToast={showToast}
            onCopyPrompt={handleCopyPrompt}
          />
        )}

        {activeSection === 'dashboard' && (
          <DashboardSection
            progress={userProgress}
            badges={badges}
            onResetProgress={handleResetProgressRequest}
            showToast={showToast}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        setActiveSection={setActiveSection}
        openGlossary={() => setGlossaryOpen(true)}
      />

      {/* Non-Technical Terms Glossary Popup Modal */}
      <GlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
      />

      {/* Onboarding Tour Modal */}
      <OnboardingTourModal
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        setActiveSection={setActiveSection}
        showToast={showToast}
      />

      {/* Global Floating Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

      {/* Confirm Reset Modal */}
      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="إعادة ضبط التقدم"
        message="هل أنت متأكد من رغبتك في تصفير تقدمك بالكامل وإعادة البدء؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={executeResetProgress}
        onCancel={() => setResetConfirmOpen(false)}
      />

    </div>
  );
}
