import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/storage';
import React, { useState } from 'react';
import { SectionType } from '../types';
import { 
  Sparkles, 
  BookOpen, 
  Terminal, 
  Library, 
  LayoutDashboard, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Compass, 
  CheckCircle2, 
  Wand2,
  Palette,
  LineChart,
  LayoutTemplate,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveSection: (section: SectionType) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

interface TourStep {
  id: number;
  section: SectionType;
  title: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  keyPoints: string[];
  actionText: string;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  setActiveSection,
  showToast
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const tourSteps: TourStep[] = [
    {
      id: 1,
      section: 'home',
      title: 'مرحباً بك في منصة "ڤايب كود عربي" ⚡',
      badge: 'المحطة الأولى: الفلسفة والقاموس التفاعلي',
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      description: 'المنصة الأولى باللغة العربية لبناء تطبيقات ويب تفاعلية باستخدام التوجيه الذكي (Vibe Coding) مع دعم "قاموس المصطلحات البرمجية" التفاعلي الجديد.',
      keyPoints: [
        'لا تحتاج لكتابة أو حفظ أكواد معقدة — توجيهك هو كودك.',
        'قاموس مصطلحات تفاعلي (Glossary) لشرح مفاهيم الـ API والـ Commits بأسلوب مبسط.',
        'نظام نقاط XP وشارات إنجاز تحفزك على استكمال التحديات.'
      ],
      actionText: 'استكشف الصفحة الرئيسية'
    },
    {
      id: 2,
      section: 'learning',
      title: 'مسار التعلم وتحديات قاعدة C-A-R-T 🎓',
      badge: 'المحطة الثانية: المسار التعليمي',
      icon: <BookOpen className="w-8 h-8 text-indigo-400" />,
      description: '5 مستويات تعليمية ميسرة تشرح لك بالتشبيهات الواقعية مفاهيم البرمجة وقاعدة C-A-R-T الذهبية لصياغة برومبتات واضحة واحترافية.',
      keyPoints: [
        'دروس قصيرة ومبسطة مع تشبيهات من الحياة اليومية.',
        'اختبارات تقييمية تفاعلية مع شرح وتغذية راجعة للإجابات.',
        'حصد نقاط XP وفتح وسامات انجاز معتمدة عند إكمال كل مستوى.'
      ],
      actionText: 'الانتقال للمسار التعليمي'
    },
    {
      id: 3,
      section: 'simulator',
      title: 'مساعد الـ Vibe الذكي (AI Prompt Doctor) 🤖',
      badge: 'ميزة جديدة 🔥: طبيب الأوامر',
      icon: <Wand2 className="w-8 h-8 text-amber-300" />,
      description: 'مساعد ذكي يحلل الـ Prompt الخاص بك فور كتابته، ويحدد نسبة اكتماله، ويقدم اقتراحات فورية مع خيار الترقية بضغطة زر قبل التوليد!',
      keyPoints: [
        'مؤشر ذكي يقيّم اكتمال مواصفات التصميم والتفاعل بنسبة مئوية.',
        'اقتراحات فورية لتوجيه Tailwind CSS ودعم اتجاه RTL العربي.',
        'زر "تعزيز الـ Prompt تلقائياً" لإضافة كافة الممارسات الاحترافية بضغطة واحدة.'
      ],
      actionText: 'تجربة مساعد الـ Vibe الذكي'
    },
    {
      id: 4,
      section: 'simulator',
      title: 'قوالب مشاريع جاهزة للتعديل والمحاكي الحي 🚀',
      badge: 'المحطة الرابعة: قوالب ومحاكي Git Push',
      icon: <LayoutTemplate className="w-8 h-8 text-emerald-400" />,
      description: 'اختر من بين قوالب جاهزة (صفحات هبوط SaaS، شات بوت، حاسبات سعرات، متاجر رقمية)، واسحب الـ Prompt لتعديله وتوليد كوده فوراً!',
      keyPoints: [
        'قوالب جاهزة ومتنوعة مغطية لكافة مجالات الأعمال والتطبيقات.',
        'معاينة تفاعلية حية على شاشات الحاسوب، التابلت، والجوال.',
        'محاكي GitHub تفاعلي يوضح عملية رفع الأكواد والـ Git Push بالتفصيل.'
      ],
      actionText: 'استكشاف القوالب الجاهزة'
    },
    {
      id: 5,
      section: 'simulator',
      title: 'تخصيص مظهر واجهة الكود والخطوط 🎨',
      badge: 'ميزة جديدة 🎨: تخصيص مظهر المحاكي',
      icon: <Palette className="w-8 h-8 text-purple-400" />,
      description: 'لوحة تخصيص كاملة لمظهر المحاكي! اختر من بين سمات ألوان VS Code Dark, GitHub Dark, Monokai, One Light، مع التحكم بحجم الخط ونوعه.',
      keyPoints: [
        '4 سمات ألوان عالمية تناسب تفضيلات عينيك أثناء القراءة.',
        'التحكم بحجم الخط البرمجي ونوعه (Fira Code, JetBrains Mono, Monaco).',
        'حفظ تفضيلاتك تلقائياً في المتصفح لاستخدامها في كل زيارة.'
      ],
      actionText: 'تخصيص مظهر المحاكي'
    },
    {
      id: 6,
      section: 'library',
      title: 'مكتبة الأوامر الجاهزة (Prompt Library) 📚',
      badge: 'المحطة السادسة: الموجهات السحرية',
      icon: <Library className="w-8 h-8 text-blue-400" />,
      description: 'مجموعة غنية من الموجهات الاحترافية المصممة وفق قاعدة C-A-R-T، جاهزة للنسخ أو الإرسال المباشر للمحاكي للتشغيل الفوري.',
      keyPoints: [
        'مصنفة حسب المجال (أعمال، حاسبات، إنتاجية، ذكاء اصطناعي).',
        'تشغيل مباشر داخل المحاكي بنقرة زر واحدة.',
        'إمكانية حفظ موجهاتك المخصصة واسترجاعها بسهولة.'
      ],
      actionText: 'تصفح مكتبة الأوامر'
    },
    {
      id: 7,
      section: 'dashboard',
      title: 'لوحة التحكم ورسم التطور الزمني للـ XP 🏆',
      badge: 'المحطة السابعة: المخطط الزمني والوسامات',
      icon: <LineChart className="w-8 h-8 text-amber-400" />,
      description: 'شاهد الرسم البياني الزمني المتطور لنقاط خبرتك (XP Timeline Chart)، ورادار المهارات، واطبع شهادة إنجازك المعتمدة!',
      keyPoints: [
        'رسم بياني خطي زمني يتابع نمو الـ XP والنشاط اليومي.',
        'رادار مهارات تفاعلي وفتح وسامات تميز تدريجياً.',
        'شهادة Vibe Coding Master قابلة للتحميل والمشاركة على LinkedIn.'
      ],
      actionText: 'فتح لوحة الإنجازات'
    }
  ];

  const activeStep = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCompleteTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCompleteTour = () => {
    safeSetItem('vibe_tour_completed', 'true');
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    showToast('أكملت الجولة التعليمية بنجاح! أنت جاهز للبدء 🎉', 'success');
    onClose();
  };

  const handleGoToSection = (section: SectionType) => {
    setActiveSection(section);
    handleCompleteTour();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Tour Dialog Modal Card */}
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-[2.5rem] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
              {activeStep.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/80 px-3 py-0.5 rounded-full border border-indigo-800/80 inline-block mb-1">
                {activeStep.badge}
              </span>
              <h3 className="font-black text-lg md:text-xl text-white">
                {activeStep.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            title="إغلاق الجولة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content Body */}
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {activeStep.description}
          </p>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>أبرز المميزات في هذه المحطة:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {activeStep.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Progress Dots & Navigation Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Progress Indicators */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {tourSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-8 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                    : idx < currentStep
                    ? 'w-2.5 bg-emerald-500'
                    : 'w-2.5 bg-slate-700'
                }`}
                title={`الخطوة ${idx + 1}`}
              />
            ))}
            <span className="text-xs text-slate-400 font-bold mr-2">
              {currentStep + 1} من {tourSteps.length}
            </span>
          </div>

          {/* Buttons Group */}
          <div className="flex items-center space-x-2 space-x-reverse w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
              >
                السابق
              </button>
            )}

            <button
              onClick={() => handleGoToSection(activeStep.section)}
              className="px-4 py-2.5 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 font-bold rounded-xl text-xs transition hidden md:block"
            >
              {activeStep.actionText} ↗
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-black rounded-xl text-xs shadow-lg shadow-indigo-500/20 transition flex items-center gap-1.5"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'إنهاء الجولة 🎉' : 'التالي'}</span>
              {currentStep < tourSteps.length - 1 && <ArrowLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
