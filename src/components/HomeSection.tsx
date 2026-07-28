import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { SectionType } from '../types';
import { vibeProjects } from '../data/projectsData';
import { 
  Sparkles, 
  ArrowLeft, 
  Terminal, 
  BookOpen, 
  BrainCircuit, 
  GitBranch, 
  CloudCheck, 
  Rocket, 
  Code2, 
  Zap,
  CheckCircle2,
  MousePointer,
  Sparkle
} from 'lucide-react';

interface HomeSectionProps {
  setActiveSection: (section: SectionType) => void;
  loadPromptIntoSimulator: (promptText: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  setActiveSection,
  loadPromptIntoSimulator
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [heroMouse, setHeroMouse] = useState<{ x: number; y: number; normalizedX: number; normalizedY: number }>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0
  });
  const [interactiveGlow, setInteractiveGlow] = useState<boolean>(true);

  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse Move Handler for Hero Section Parallax & Spotlight
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current || !interactiveGlow) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized values from -1 to 1
    const normalizedX = ((x / rect.width) - 0.5) * 2;
    const normalizedY = ((y / rect.height) - 0.5) * 2;

    setHeroMouse({ x, y, normalizedX, normalizedY });
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const vibeSteps = [
    {
      step: 1,
      title: 'صف الفكرة بلغة عربية بسيطة',
      subtitle: 'المرحلة 1: صياغة الـ Vibe Prompt',
      icon: <BrainCircuit className="w-6 h-6 text-indigo-400" />,
      analogy: 'مثل إعطاء طلب تفصيلي لنادل المطعم عما تحب أن تأكله.',
      details: 'اكتب ما يدور في خاطرك بلغة طبيعية. مثلاً: "أريد تطبيق حاسبة سعرات عصرية باللون الأزرق مع أزرار دائرية وتفاعل حي".'
    },
    {
      step: 2,
      title: 'التوليد الفوري عبر Gemini AI',
      subtitle: 'المرحلة 2: معالجة الذكاء الاصطناعي',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      analogy: 'المطور السوبر المعاون يترجم وصفك لكود HTML/Tailwind متناسق في ثوانٍ.',
      details: 'يقوم نموذج Gemini 2.5 Flash بتحليل وصفك وتوليد واجهة كاملة بجودة أرقى شركات التكنولوجيا.'
    },
    {
      step: 3,
      title: 'المعاينة والتحسين التفاعلي',
      subtitle: 'المرحلة 3: تجربة المحاكي الحي',
      icon: <Terminal className="w-6 h-6 text-emerald-400" />,
      analogy: 'تجربة التطبيق فوراً وتوجيه المساعد للتعديل بطلب بسيط.',
      details: 'شاهد تطبيقك وهو يعمل مباشرة في المحاكي، وإذا أردت تغيير الألوان أو إضافة ميزة، اطلب من المساعد ذلك فوراً.'
    },
    {
      step: 4,
      title: 'الحفظ في GitHub السحابي والنشر',
      subtitle: 'المرحلة 4: الخزانة السحابية والوصول للعالم',
      icon: <GitBranch className="w-6 h-6 text-blue-400" />,
      analogy: 'GitHub مثل خزانة سحابية تحفظ ملفاتك وتمنحك رابطاً حياً لتطبيقه.',
      details: 'احفظ مشروعك في خزانة GitHub السحابية، وشاركه مع أصدقائك أو عملائك عبر رابط ويب يعمل على كل الهواتف.'
    }
  ];

  return (
    <div className="space-y-16 pb-16 relative">
      
      {/* Vibe Coding Dynamic Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl">
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[100px]" />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full mix-blend-multiply dark:mix-blend-screen opacity-30 dark:opacity-20 blur-3xl"
            style={{
              background: ['#818cf8', '#34d399', '#f472b6', '#c084fc', '#60a5fa'][i % 5],
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section with Dynamic Mouse-Reactive Animated Gradient Background */}
      <section 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative overflow-hidden rounded-3xl text-white border border-slate-800/90 p-8 md:p-16 text-center shadow-2xl transition-all duration-300 group"
        style={{
          background: interactiveGlow 
            ? `radial-gradient(ellipse at ${50 + heroMouse.normalizedX * 25}% ${50 + heroMouse.normalizedY * 25}%, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 55%, rgba(2, 6, 23, 1) 100%)`
            : 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 60%, #020617 100%)'
        }}
      >
        
        {/* Animated Dynamic Mesh Gradient Layer */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at ${heroMouse.x || 300}px ${heroMouse.y || 200}px, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.2) 35%, rgba(16, 185, 129, 0.1) 65%, transparent 80%)`,
            filter: 'blur(30px)'
          }}
        />

        {/* Dynamic Multi-Color Interactive Spotlight following cursor */}
        {interactiveGlow && (
          <div 
            className="absolute rounded-full pointer-events-none transition-transform duration-75 ease-out z-0 blur-3xl opacity-75"
            style={{
              width: '520px',
              height: '520px',
              left: `${heroMouse.x - 260}px`,
              top: `${heroMouse.y - 260}px`,
              background: 'radial-gradient(circle, rgba(129,140,248,0.3) 0%, rgba(192,132,252,0.2) 40%, rgba(52,211,153,0.12) 70%, transparent 90%)'
            }}
          />
        )}

        {/* Ambient Parallax Orbs with Dynamic Hue Shifts */}
        <div 
          className="absolute top-10 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out animate-pulse-slow"
          style={{
            transform: `translate(${heroMouse.normalizedX * -35}px, ${heroMouse.normalizedY * -35}px) scale(${1 + Math.abs(heroMouse.normalizedX) * 0.1})`
          }}
        />
        <div 
          className="absolute bottom-5 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${heroMouse.normalizedX * 40}px, ${heroMouse.normalizedY * 40}px) scale(${1 + Math.abs(heroMouse.normalizedY) * 0.1})`
          }}
        />
        <div 
          className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${heroMouse.normalizedX * 20}px, ${heroMouse.normalizedY * -20}px)`
          }}
        />

        {/* Floating Code Symbols & Decorative Tech Badges reacting to Parallax */}
        <div 
          className="hidden lg:block absolute top-12 right-12 text-slate-700/60 font-mono text-xs font-bold pointer-events-none transition-transform duration-300 select-none"
          style={{
            transform: `translate(${heroMouse.normalizedX * -18}px, ${heroMouse.normalizedY * -18}px) rotate(${heroMouse.normalizedX * 8}deg)`
          }}
        >
          &lt;VibeCoding /&gt;
        </div>

        <div 
          className="hidden lg:block absolute bottom-12 left-12 text-indigo-400/30 font-mono text-sm font-bold pointer-events-none transition-transform duration-200 select-none"
          style={{
            transform: `translate(${heroMouse.normalizedX * 22}px, ${heroMouse.normalizedY * 22}px)`
          }}
        >
          {`{ prompt: "ابتكر تطبيقاً" }`}
        </div>

        <div 
          className="hidden lg:block absolute top-1/3 left-16 text-amber-400/25 font-black text-lg pointer-events-none transition-transform duration-500 select-none"
          style={{
            transform: `translate(${heroMouse.normalizedX * -12}px, ${heroMouse.normalizedY * 15}px)`
          }}
        >
          ✨ Gemini 2.5 Flash
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          
          {/* Top Pill & Glow Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-indigo-500/10 via-indigo-500/20 to-blue-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold text-indigo-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>ثورة Vibe Coding باللغة العربية لغير المبرمجين</span>
            </div>

            {/* Mouse Ambient Effect Toggle */}
            <button
              onClick={() => setInteractiveGlow(!interactiveGlow)}
              className={`text-[11px] font-extrabold px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                interactiveGlow
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/60 shadow-md shadow-indigo-950/50'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/80'
              }`}
              title="تشغيل/إيقاف خلفية التتبع التفاعلية للماوس"
            >
              <MousePointer className="w-3 h-3 text-amber-300" />
              <span>{interactiveGlow ? 'توهج الماوس: مفعّل ✨' : 'توهج الماوس: متوقف'}</span>
            </button>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            برمج أفكارك وتطبيقاتك بأسلوب <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Vibe Coding
            </span> دون كتابة كود واحد!
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            تعلم كيف تحول خيالك وأفكارك التجارية إلى تطبيقات حقيقية تعمل على المتصفح والهاتف باستخدام الذكاء الاصطناعي <span className="text-indigo-400 font-bold">Gemini</span> و <span className="text-blue-400 font-bold">GitHub الخزانة السحابية</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveSection('simulator')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Terminal className="w-5 h-5 text-indigo-200" />
              <span>جرب المحاكي التفاعلي الآن ⚡</span>
            </button>

            <button
              onClick={() => setActiveSection('learning')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-base rounded-2xl transition flex items-center justify-center space-x-2 space-x-reverse"
            >
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>استكشف المسار التعليمي</span>
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center justify-center space-x-1.5 space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>بدون خبرة برمجة سابقة</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>توليد بالذكاء الاصطناعي Gemini</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>خزانة GitHub السحابية</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>مجاني وتطبيقي 100%</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Stepper Journey Section */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm space-y-8">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            طريقة العمل
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            رحلة بناء مشروعك بالـ Vibe Coding خطوة بخطوة
          </h2>
          <p className="text-sm text-slate-600">
            اضغط على أي مرحلة لاستكشاف التشبيه والتطبيق العملي لغير المبرمجين
          </p>
        </div>

        {/* Stepper Buttons Horizontal Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vibeSteps.map((stepItem) => {
            const isCurrent = activeStep === stepItem.step;
            return (
              <button
                key={stepItem.step}
                onClick={() => setActiveStep(stepItem.step)}
                className={`p-5 rounded-2xl border text-right transition-all duration-200 relative ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10 ring-2 ring-indigo-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stepItem.step}
                  </div>
                  {stepItem.icon}
                </div>
                <h3 className={`font-bold text-base mb-1 ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                  {stepItem.title}
                </h3>
                <p className={`text-xs ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                  {stepItem.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        {vibeSteps.find(s => s.step === activeStep) && (() => {
          const current = vibeSteps.find(s => s.step === activeStep)!;
          return (
            <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-slate-50 rounded-2xl border border-indigo-100 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse text-indigo-700 font-extrabold text-lg">
                    {current.icon}
                    <span>المرحلة {current.step}: {current.title}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed max-w-2xl font-medium">
                    {current.details}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm shrink-0 md:max-w-xs text-xs text-indigo-950 font-semibold space-y-1">
                  <span className="text-indigo-600 font-bold block">💡 التشبيه التبسيطي:</span>
                  <p>{current.analogy}</p>
                </div>
              </div>
            </div>
          );
        })()}

      </section>

      {/* Hands-On Projects Section */}
      <section className="space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              مشاريع جاهزة للتجربة
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
              مشاريع عمليّة يمكنك بناؤها اليوم!
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              اختر أي مشروع وسيتم تحميل الأمر المخصص له في المحاكي لبنائه فوراً.
            </p>
          </div>

          <button
            onClick={() => setActiveSection('library')}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:gap-2 transition-all self-start md:self-auto"
          >
            <span>عرض كل أوامر المكتبة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vibeProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-indigo-500/60 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header Icon */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${project.previewColor} text-white flex items-center justify-center font-bold text-xl shadow-md`}>
                    ✨
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {project.difficulty}
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center text-[11px] font-semibold text-slate-600 space-x-1.5 space-x-reverse">
                      <span className="text-emerald-500">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => loadPromptIntoSimulator(project.promptText)}
                className="mt-6 w-full py-3 bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 space-x-reverse"
              >
                <span>جرب بناءه في المحاكي ⚡</span>
              </button>
            </div>
          ))}
        </div>

      </section>

      {/* Call to Action Banner */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 max-w-xl text-center md:text-right">
          <h3 className="text-2xl font-black text-white">
            جاهز للانطلاق في المسار التعليمي المخصص؟
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            انتقل إلى المسار التعليمي، واطلع على الدروس الخمسة الميسرة، واجتز الاختبارات السريعة لتحصل على شهادة إتقان الـ Vibe Coding!
          </p>
        </div>

        <button
          onClick={() => setActiveSection('learning')}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl transition transform active:scale-95 shrink-0"
        >
          ابدأ المسار التعليمي مجاناً 🎓
        </button>
      </section>

    </div>
  );
};
