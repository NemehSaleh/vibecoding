import React, { useState } from 'react';
import { UserProgress, AchievementBadge } from '../types';
import { learningLevels } from '../data/learningPathData';
import { ShareCertificateModal } from './ShareCertificateModal';
import { AvatarSelectorModal } from './AvatarSelectorModal';
import { UserAvatar, getStoredAvatar, AVATAR_STORAGE_KEY } from '../data/avatarsData';
import { triggerBadgeConfetti } from '../utils/confetti';
import { playBadgeUnlockSound, playClickSound } from '../utils/soundEffects';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle, 
  Award, 
  RotateCcw, 
  BarChart3, 
  BrainCircuit, 
  Code2, 
  Zap, 
  Clock,
  CheckCircle2,
  HelpCircle,
  BarChart,
  Share2,
  Download,
  TrendingUp,
  UserCircle2,
  Palette,
  Target,
  Github,
  GitBranch
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend
} from 'recharts';
interface DashboardSectionProps {
  progress: UserProgress;
  badges: AchievementBadge[];
  onResetProgress: () => void;
  showToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  progress,
  badges,
  onResetProgress,
  showToast = (msg: string, type?: 'success' | 'info' | 'error') => {}
}) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<UserAvatar>(() => getStoredAvatar());
  const [activePanelTab, setActivePanelTab] = useState<'stats' | 'tasks'>('stats');
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, text: 'استخدم المحاكي لتجربة أمر جديد', completed: progress.generatedAppsCount > 0 },
    { id: 2, text: 'أكمل مستوى واحد في مسار التعلم', completed: progress.completedLevelIds.length > 0 },
    { id: 3, text: 'انسخ أمراً من مكتبة الأوامر', completed: progress.copiedPromptsCount > 0 },
  ]);

  const handleToggleTask = (id: number) => {
    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    playClickSound();
  };

  const handleSelectAvatar = (avatar: UserAvatar) => {
    try {
      setSelectedAvatar(avatar);
      localStorage.setItem(AVATAR_STORAGE_KEY, avatar.id);
      playBadgeUnlockSound();
      triggerBadgeConfetti();
      showToast(`تم تعيين الصورة الرمزية: "${avatar.name}" بنجاح! 🎨`, 'success');
      setIsAvatarModalOpen(false);
    } catch (err) {
      console.error('Failed to save avatar choice:', err);
    }
  };

  const completedLevelsCount = progress.completedLevelIds.length;
  const unlockedBadgesCount = badges.filter(b => b.isUnlocked).length;
  const quizScores = progress.quizScores || {};

  // Calculate Quiz Average Score
  const scoreValues: number[] = Object.values(quizScores);
  const avgQuizScore = scoreValues.length > 0
    ? Math.round(scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length)
    : 0;

  // Timeframe state for prompts & apps growth chart
  const [growthTimeframe, setGrowthTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  // Generate dynamic data based on user progress for GitHub contributions
  const githubData = [
    { name: 'السبت', commits: 1 + Math.floor(progress.xp * 0.01), projects: 0 },
    { name: 'الأحد', commits: 2 + Math.floor(progress.xp * 0.02), projects: 1 },
    { name: 'الإثنين', commits: 5 + Math.floor(progress.xp * 0.03), projects: progress.generatedAppsCount > 0 ? 1 : 0 },
    { name: 'الثلاثاء', commits: 3 + Math.floor(progress.xp * 0.01), projects: 0 },
    { name: 'الأربعاء', commits: 8 + Math.floor(progress.xp * 0.05), projects: progress.generatedAppsCount > 1 ? 2 : 1 },
    { name: 'الخميس', commits: 4 + Math.floor(progress.xp * 0.02), projects: 1 },
    { name: 'الجمعة', commits: 7 + Math.floor(progress.xp * 0.04), projects: progress.generatedAppsCount > 2 ? 1 : 0 },
  ];

  // Dynamic growth data for Prompts & App Generations (Recharts)
  const promptsGrowthData = growthTimeframe === 'weekly' ? [
    { name: 'السبت', prompts: 3 + Math.floor(progress.copiedPromptsCount * 0.15), apps: Math.floor(progress.generatedAppsCount * 0.1) },
    { name: 'الأحد', prompts: 7 + Math.floor(progress.copiedPromptsCount * 0.3), apps: 1 + Math.floor(progress.generatedAppsCount * 0.25) },
    { name: 'الإثنين', prompts: 12 + Math.floor(progress.copiedPromptsCount * 0.45), apps: 2 + Math.floor(progress.generatedAppsCount * 0.4) },
    { name: 'الثلاثاء', prompts: 18 + Math.floor(progress.copiedPromptsCount * 0.6), apps: 3 + Math.floor(progress.generatedAppsCount * 0.6) },
    { name: 'الأربعاء', prompts: 25 + Math.floor(progress.copiedPromptsCount * 0.75), apps: 5 + Math.floor(progress.generatedAppsCount * 0.8) },
    { name: 'الخميس', prompts: 32 + Math.floor(progress.copiedPromptsCount * 0.9), apps: 7 + Math.floor(progress.generatedAppsCount * 0.9) },
    { name: 'الجمعة', prompts: 40 + progress.copiedPromptsCount * 2, apps: 10 + progress.generatedAppsCount * 2 },
  ] : [
    { name: 'الأسبوع 1', prompts: 12 + Math.floor(progress.copiedPromptsCount * 0.2), apps: 2 + Math.floor(progress.generatedAppsCount * 0.2) },
    { name: 'الأسبوع 2', prompts: 28 + Math.floor(progress.copiedPromptsCount * 0.5), apps: 6 + Math.floor(progress.generatedAppsCount * 0.5) },
    { name: 'الأسبوع 3', prompts: 52 + Math.floor(progress.copiedPromptsCount * 0.8), apps: 12 + Math.floor(progress.generatedAppsCount * 0.8) },
    { name: 'الأسبوع 4', prompts: 85 + progress.copiedPromptsCount * 2.5, apps: 20 + progress.generatedAppsCount * 2.5 },
  ];

  // Dynamic growth data for XP (Recharts)
  const xpGrowthData = growthTimeframe === 'weekly' ? [
    { name: 'السبت', xp: Math.floor(progress.xp * 0.1) },
    { name: 'الأحد', xp: Math.floor(progress.xp * 0.2) },
    { name: 'الإثنين', xp: Math.floor(progress.xp * 0.35) },
    { name: 'الثلاثاء', xp: Math.floor(progress.xp * 0.5) },
    { name: 'الأربعاء', xp: Math.floor(progress.xp * 0.65) },
    { name: 'الخميس', xp: Math.floor(progress.xp * 0.8) },
    { name: 'الجمعة', xp: progress.xp || 50 },
  ] : [
    { name: 'الأسبوع 1', xp: Math.floor(progress.xp * 0.2) },
    { name: 'الأسبوع 2', xp: Math.floor(progress.xp * 0.45) },
    { name: 'الأسبوع 3', xp: Math.floor(progress.xp * 0.75) },
    { name: 'الأسبوع 4', xp: progress.xp || 50 },
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header Banner & User Profile Avatar Section */}
      <section className="bg-slate-900 rounded-[2.5rem] p-6 md:p-10 text-white border border-slate-800 shadow-2xl space-y-8">
        
        {/* Top Bar: User Profile Avatar Card */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-5 md:p-6 bg-slate-800/80 rounded-[2rem] border border-slate-700/80 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
            {/* Interactive Avatar Icon */}
            <div 
              onClick={() => {
                playClickSound();
                setIsAvatarModalOpen(true);
              }}
              className="relative group cursor-pointer shrink-0"
              title="انقر لتغيير الصورة الرمزية"
            >
              <div className={`w-18 h-18 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${selectedAvatar.bgGradient} flex items-center justify-center text-3xl md:text-4xl shadow-xl border-2 ${selectedAvatar.borderColor} transition transform group-hover:scale-105`}>
                {selectedAvatar.emoji}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-xl shadow-md border border-amber-300 transition group-hover:scale-110">
                <Palette className="w-4 h-4" />
              </div>
            </div>

            {/* User Info & Selected Avatar Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400">الصورة الرمزية الحالية:</span>
                <h3 className="text-lg md:text-xl font-black text-white">{selectedAvatar.name}</h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                  {selectedAvatar.badgeTag}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {selectedAvatar.description}
              </p>
            </div>
          </div>

          {/* Change Avatar Button */}
          <button
            onClick={() => {
              playClickSound();
              setIsAvatarModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-3 bg-slate-700/80 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-600 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>اختيار صورة رمزية 🎨</span>
          </button>
        </div>

        {/* Banner Details */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>لوحة التقدم والإنجازات الشخصية</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              سجل الإنجازات وشارات الـ Vibe Master 🏆
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              تابع تطور مهاراتك في هندسة الأوامر بالذكاء الاصطناعي، المستويات المكتملة، ونتائج الاختبارات التقييمية.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="w-full md:w-auto py-3.5 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs md:text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition transform active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Award className="w-5 h-5 text-slate-950" />
              <span>مشاركة شهادة الإنجاز 🎓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>نقاط الخبرة XP</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">{progress.xp} XP</div>
          <span className="text-[11px] text-emerald-600 font-bold block">مكتسبة من المستويات والاختبارات</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>المستويات المكتملة</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">{completedLevelsCount} / 5</div>
          <span className="text-[11px] text-indigo-600 font-bold block">{completedLevelsCount === 5 ? 'مكتمل بالكامل 🏆' : 'جاري التقدم'}</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>متوسط نتيجتك بالإختبارات</span>
            <BarChart className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">{avgQuizScore}%</div>
          <span className="text-[11px] text-blue-600 font-bold block">دقة إجاباتك بالاختبارات</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>الشارات المفتوحة</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">{unlockedBadgesCount} / {badges.length}</div>
          <span className="text-[11px] text-purple-600 font-bold block">وسامات إنجاز مميزة</span>
        </div>
      </div>

      {/* Quiz Progress & Scores Card Section */}
      <section className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">نتائج اختبارات تقييم المستويات</h3>
            <p className="text-xs text-slate-500">سجل نتائج إجاباتك على الأسئلة التفاعلية لكل مستوى</p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            {Object.keys(quizScores).length} من 5 اختُبرت
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {learningLevels.map((lvl) => {
            const isCompleted = progress.completedLevelIds.includes(lvl.id);
            const scorePct = quizScores[lvl.id];
            const hasScore = scorePct !== undefined;

            return (
              <div 
                key={lvl.id}
                className={`p-4 rounded-3xl border transition space-y-3 ${
                  hasScore && scorePct >= 70
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isCompleted
                    ? 'bg-indigo-50/50 border-indigo-200'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">المستوى {lvl.id}</span>
                  {hasScore ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      scorePct >= 70 ? 'bg-emerald-200 text-emerald-900 font-black' : 'bg-amber-200 text-amber-900 font-black'
                    }`}>
                      {scorePct}%
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">لم يختبر</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-xs text-slate-900 line-clamp-2 leading-snug">
                    {lvl.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {lvl.quiz.length} أسئلة تفاعلية
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                  {hasScore ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتمل</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">في انتظارك</span>
                  )}
                  <span className="text-slate-500 text-[10px]">+100 XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GitHub Contributions Section */}
      <section className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Github className="w-5 h-5 text-slate-900" />
              <span>مساهمات GitHub</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">تتبع نشاطك البرمجي ومشاريعك المرفوعة على مدار الأسبوع</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200 flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5" />
                <span>الفرع الرئيسي: main</span>
             </span>
          </div>
        </div>

        <div className="h-[300px] w-full mt-4" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={githubData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Cairo' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Cairo' }}
                itemStyle={{ fontFamily: 'Cairo', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'Cairo', fontSize: '13px', fontWeight: 'bold' }} />
              <Area 
                type="monotone" 
                dataKey="commits" 
                name="التحديثات (Commits)" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCommits)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
              />
              <Area 
                type="monotone" 
                dataKey="projects" 
                name="المشاريع المنشورة" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorProjects)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Prompts & App Generations Growth Chart (Recharts) */}
      <section className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>معدل نمو الأوامر (Prompts) وتوليد التطبيقات</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              رسم بياني تفاعلي يوضح معدل تقدمك في صياغة الأوامر البرمجية وتوليد التطبيقات بالمحاكي
            </p>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0">
            <button
              onClick={() => { setGrowthTimeframe('weekly'); playClickSound(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                growthTimeframe === 'weekly'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              أسبوعي 📅
            </button>
            <button
              onClick={() => { setGrowthTimeframe('monthly'); playClickSound(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                growthTimeframe === 'monthly'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              شهري 📊
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[320px] w-full mt-4" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={promptsGrowthData}
              margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02}/>
                </linearGradient>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Cairo' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                labelStyle={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Cairo', fontSize: '13px' }}
                itemStyle={{ fontFamily: 'Cairo', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'Cairo', fontSize: '13px', fontWeight: 'bold' }} />
              <Area 
                type="monotone" 
                dataKey="prompts" 
                name="معدل صياغة ونقل الأوامر (Prompts)" 
                stroke="#6366f1" 
                strokeWidth={3.5}
                fillOpacity={1} 
                fill="url(#colorPrompts)" 
                activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff', fill: '#6366f1' }}
              />
              <Area 
                type="monotone" 
                dataKey="apps" 
                name="التطبيقات المولدة بالمحاكي (Apps)" 
                stroke="#06b6d4" 
                strokeWidth={3.5}
                fillOpacity={1} 
                fill="url(#colorApps)" 
                activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff', fill: '#06b6d4' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Insight Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100/80 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-black text-indigo-950">معدل نشاط الأوامر</h4>
              <p className="text-[11px] text-indigo-700 font-medium">
                إجمالي الأوامر المستفاد منها: <strong className="font-extrabold text-indigo-900">{progress.copiedPromptsCount + progress.generatedAppsCount} أمرًا</strong>
              </p>
            </div>
          </div>

          <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-100/80 flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 text-white rounded-xl flex items-center justify-center font-bold shrink-0">
              🚀
            </div>
            <div>
              <h4 className="text-xs font-black text-cyan-950">سرعة التطوير الذكي</h4>
              <p className="text-[11px] text-cyan-700 font-medium">
                تطبيقات منشأة بالمحاكي: <strong className="font-extrabold text-cyan-900">{progress.generatedAppsCount} تطبيقًا تفاعليًا</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* XP Progression Chart (Recharts) */}
      <section className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>تطور نقاط الخبرة (XP) ومسار التعلم</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              رسم بياني يوضح معدل اكتسابك لنقاط الخبرة والتقدم في مهاراتك
            </p>
          </div>
        </div>

        {/* Recharts Area Chart for XP */}
        <div className="h-[320px] w-full mt-4" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={xpGrowthData}
              margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Cairo' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                labelStyle={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Cairo', fontSize: '13px' }}
                itemStyle={{ fontFamily: 'Cairo', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'Cairo', fontSize: '13px', fontWeight: 'bold' }} />
              <Area 
                type="monotone" 
                dataKey="xp" 
                name="نقاط الخبرة المكتسبة (XP)" 
                stroke="#f59e0b" 
                strokeWidth={3.5}
                fillOpacity={1} 
                fill="url(#colorXp)" 
                activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff', fill: '#f59e0b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Interactive Activity Panel */}
      <section className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <span>لوحة النشاط التفاعلية</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">تتبع إحصائياتك وأنجز مهامك اليومية لزيادة نقاط خبرتك</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => { setActivePanelTab('stats'); playClickSound(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePanelTab === 'stats'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              الإحصائيات
            </button>
            <button
              onClick={() => { setActivePanelTab('tasks'); playClickSound(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePanelTab === 'tasks'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              المهام اليومية
            </button>
          </div>
        </div>

        {activePanelTab === 'stats' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100/50 flex flex-col justify-center items-center text-center space-y-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                <BrainCircuit className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-black text-lg text-indigo-950">مستوى الإتقان</h4>
                <p className="text-xs text-indigo-700/80 mt-1 font-medium max-w-[200px] mx-auto">
                  لقد أتممت {completedLevelsCount} من أصل 5 مستويات. أنت في طريقك لتصبح خبيراً!
                </p>
              </div>
              <div className="w-full bg-indigo-200/50 rounded-full h-2.5 mt-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${(completedLevelsCount / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-rows-2 gap-4">
              <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">استخدام المحاكي</h4>
                  <p className="text-xs text-amber-700/70 mt-0.5">عدد المرات التي اختبرت فيها الأوامر</p>
                </div>
                <div className="text-2xl font-black text-amber-600">{progress.generatedAppsCount}</div>
              </div>
              <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">الأوامر المنسوخة</h4>
                  <p className="text-xs text-emerald-700/70 mt-0.5">من مكتبة الأوامر الجاهزة</p>
                </div>
                <div className="text-2xl font-black text-emerald-600">{progress.copiedPromptsCount}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  task.completed 
                    ? 'bg-emerald-50/50 border-emerald-200/60' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  task.completed ? 'bg-emerald-500 border-emerald-600' : 'bg-white border-slate-300'
                }`}>
                  {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div className={`text-sm font-bold transition-colors ${
                  task.completed ? 'text-emerald-800 line-through opacity-70' : 'text-slate-700'
                }`}>
                  {task.text}
                </div>
                <div className="mr-auto">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {task.completed ? 'مكتمل ✅' : '+50 XP'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Achievements Badges Grid */}
      <section className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>وسامات وشارات الإنجاز (Badges)</span>
              <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
            </h3>
            <p className="text-xs text-slate-500">أكمل الدروس وجرب الأوامر لتفتح شارات جديدة، اضغط على الشارة المفتوحة للاحتفال 🎉</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playBadgeUnlockSound();
                triggerBadgeConfetti();
              }}
              className="text-xs font-black px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-2xl shadow-sm transition transform active:scale-95 flex items-center gap-1.5"
              title="إطلاق القصاصات الورقية الاحتفالية"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>إطلاق احتفال Confetti 🎉</span>
            </button>
            <span className="text-xs font-extrabold px-3 py-1.5 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200">
              {unlockedBadgesCount} من {badges.length} مفتوحة
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => {
                if (badge.isUnlocked) {
                  playBadgeUnlockSound();
                  triggerBadgeConfetti();
                  showToast(`مبروك! شارة "${badge.title}" مفتوحة لديك 🏆`, 'success');
                } else {
                  playClickSound();
                  showToast(`الشارة مغلقة: ${badge.description}`, 'info');
                }
              }}
              className={`relative group p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex items-start space-x-4 space-x-reverse ${
                badge.isUnlocked
                  ? 'bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-amber-100/30 border-amber-300 shadow-sm hover:scale-[1.02] hover:shadow-lg hover:border-amber-400'
                  : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Hover Tooltip Popup - Details on How to Earn */}
              <div className="absolute bottom-full mb-3 right-1/2 translate-x-1/2 w-72 md:w-80 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/90 z-30 transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:-translate-y-1 opacity-0 invisible text-right space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs">
                    <Target className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>كيفية تحقيق الشارة:</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    badge.isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {badge.isUnlocked ? 'متحققة بالفعل ✅' : 'مغلقة 🔒'}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {badge.howToEarn || badge.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/80">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>الفئة: {
                      badge.category === 'learning' ? 'المسار التعليمي' :
                      badge.category === 'simulator' ? 'المحاكي التفاعلي' :
                      badge.category === 'library' ? 'مكتبة الأوامر' : 'عام'
                    }</span>
                  </span>
                  {badge.isUnlocked ? (
                    <span className="text-emerald-400 font-extrabold">انقر للاحتفال 🎉</span>
                  ) : (
                    <span className="text-slate-400">تابع التعلم لفتحها</span>
                  )}
                </div>

                {/* Arrow Pointer */}
                <div className="absolute top-full right-1/2 translate-x-1/2 -mt-px w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900"></div>
              </div>

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 transition ${
                badge.isUnlocked ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-300/80 animate-pulse-subtle' : 'bg-slate-200 text-slate-400'
              }`}>
                {badge.icon}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-900">{badge.title}</h4>
                  {badge.isUnlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
                <div className="flex items-center justify-between mt-1">
                  {badge.isUnlocked ? (
                    <span className="text-[10px] font-black text-amber-700 bg-amber-200/60 border border-amber-300/60 px-2 py-0.5 rounded-full inline-block">
                      انقر للاحتفال! 🎉
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                      مرر الماوس لمعرفة الطريقة 💡
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reset Progress Capability */}
      <div className="text-center pt-4">
        <button
          onClick={onResetProgress}
          className="text-xs text-rose-500 hover:text-rose-700 font-bold inline-flex items-center gap-1 hover:underline transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة ضبط البيانات وتصفير التقدم</span>
        </button>
      </div>

      {/* Share Certificate Modal */}
      <ShareCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        progress={progress}
        badges={badges}
        showToast={showToast}
      />

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        selectedAvatar={selectedAvatar}
        onSelectAvatar={handleSelectAvatar}
      />

    </div>
  );
};
