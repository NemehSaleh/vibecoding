import React, { useState, useRef, useEffect } from 'react';
import { UserProgress, AchievementBadge } from '../types';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Award, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  User, 
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  badges: AchievementBadge[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ShareCertificateModal: React.FC<ShareCertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  badges,
  showToast
}) => {
  const [userName, setUserName] = useState<string>('بطل Vibe Coding');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const completedLevelsCount = progress.completedLevelIds.length;
  const unlockedBadgesCount = badges.filter(b => b.isUnlocked).length;
  
  const quizScores = progress.quizScores || {};
  const scoreValues: number[] = Object.values(quizScores);
  const avgQuizScore = scoreValues.length > 0
    ? Math.round(scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length)
    : 100;

  // Rank Title based on XP and completed levels
  const getRankTitle = () => {
    if (completedLevelsCount >= 5) return 'خبير Vibe Master المعتمد 🏆';
    if (completedLevelsCount >= 3) return 'مطور العصر الذكي 🚀';
    if (completedLevelsCount >= 1) return 'مبتكر الواجهات البرمجية ⚡';
    return 'مستكشف Vibe Coding 🌟';
  };

  const rankTitle = getRankTitle();
  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const shareText = `🎉 حصلت على ${rankTitle} في منصة "ڤايب كود عربي" بحصيلة ${progress.xp} XP وإكمال ${completedLevelsCount} مستويات تعليمية بدون كتابة أسطر كود يدويًا! 🚀\n#VibeCoding #الذكاء_الاصطناعي #تطوير_التطبيقات`;

  // Draw Certificate to HTML5 Canvas for instant high-quality PNG download
  const generateCanvasImage = (): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set high DPI Resolution (1200 x 800)
    canvas.width = 1200;
    canvas.height = 800;

    // Background Gradient (Dark Luxury Navy to Indigo)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e1b4b');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative Outer Border
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1140, 740);

    // Inner Gold Fine Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(46, 46, 1108, 708);

    // Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(60, 60);
    drawCorner(1140, 60);
    drawCorner(60, 740);
    drawCorner(1140, 740);

    // Header Title: منصة ڤايب كود عربي
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('منصة "ڤايب كود عربي" — Vibe Coding Arabic', 600, 110);

    // Main Certificate Heading
    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 54px system-ui, sans-serif';
    ctx.fillText('شهادة إنجاز واحتراف 🏆', 600, 185);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('تشهد المنصة بأن المبتكر(ة):', 600, 240);

    // User Name
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.fillText(userName || 'بطل Vibe Coding', 600, 310);

    // Achievements Statement
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText(`قد أتم بنجاح متطلبات رتبة:`, 600, 370);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillText(rankTitle, 600, 425);

    // Metrics Box Background
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.beginPath();
    ctx.roundRect(150, 470, 900, 140, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Metrics Text inside box
    ctx.textAlign = 'center';

    // XP
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText(`${progress.xp} XP`, 300, 525);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('نقاط الخبرة المكتسبة', 300, 565);

    // Completed Levels
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText(`${completedLevelsCount} / 5`, 600, 525);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('مستويات تعليمية مكتملة', 600, 565);

    // Quiz Accuracy
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText(`${avgQuizScore}%`, 900, 525);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('متوسط دقة الاختبارات', 900, 565);

    // Footer Info
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748b';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText(`تاريخ الإصدار: ${currentDate}`, 1050, 680);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('✓ شهادة موثقة ومحفوظة برقم تسلسلي ذكي', 150, 680);

    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => generateCanvasImage(), 100);
    }
  }, [isOpen, userName, progress]);

  const handleDownloadImage = () => {
    setIsGeneratingImg(true);
    try {
      const dataUrl = generateCanvasImage();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `Vibe_Certificate_${userName.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        showToast('تم تحميل شهادة الإنجاز بصيغة صورة عالية الدقة! 🎓', 'success');
      }
    } catch (err) {
      showToast('حدث خطأ أثناء إنشاء الصورة، يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    showToast('تم نسخ نص الإنجاز للحافظة بنجاح! 📋', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      {/* Offscreen Canvas for drawing PNG image */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Share Certificate Modal Box */}
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-[2.5rem] max-w-3xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-800/80 inline-block mb-1">
                شهادة إنجاز معتمدة
              </span>
              <h3 className="font-black text-xl text-white">
                مشاركة شهادة الإنجاز بطاقة الـ Vibe Master 🏆
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Custom Name Input */}
        <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            الاسم المراد طباعته على الشهادة:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="ادخل اسمك ثلاثياً..."
                className="w-full pr-9 pl-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>
            <button
              onClick={() => generateCanvasImage()}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition shrink-0"
            >
              تحديث الشهادة
            </button>
          </div>
        </div>

        {/* Live Certificate Card Preview Box */}
        <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 border-2 border-indigo-500/40 shadow-2xl space-y-6 overflow-hidden">
          
          {/* Decorative Corner Stars */}
          <div className="absolute top-3 right-3 text-amber-400/80">✦</div>
          <div className="absolute bottom-3 left-3 text-amber-400/80">✦</div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>منصة ڤايب كود عربي — Vibe Coding Arabic</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
              شهادة إنجاز واحتراف 🏆
            </h2>

            <p className="text-xs text-slate-400">
              تشهد المنصة بأن المبتكر(ة):
            </p>

            <div className="text-2xl md:text-3xl font-black text-amber-400 font-sans tracking-wide">
              {userName || 'بطل Vibe Coding'}
            </div>

            <p className="text-xs text-slate-300">
              قد أتم بنجاح متطلبات رتبة: <strong className="text-indigo-300 block text-sm font-black pt-1">{rankTitle}</strong>
            </p>
          </div>

          {/* Certificate Achievements Stats Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/30 text-center">
            <div>
              <div className="text-lg md:text-xl font-black text-amber-400">{progress.xp} XP</div>
              <span className="text-[10px] text-slate-400 block">نقاط الخبرة</span>
            </div>
            <div className="border-r border-l border-slate-800">
              <div className="text-lg md:text-xl font-black text-indigo-400">{completedLevelsCount} / 5</div>
              <span className="text-[10px] text-slate-400 block">مستويات مكتملة</span>
            </div>
            <div>
              <div className="text-lg md:text-xl font-black text-emerald-400">{avgQuizScore}%</div>
              <span className="text-[10px] text-slate-400 block">دقة الاختبارات</span>
            </div>
          </div>

          {/* Seal and Date Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>شهادة موثقة إلكترونياً</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>الإصدار: {currentDate}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons: Download & Social Shares */}
        <div className="space-y-3 pt-2">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImg}
              className="py-3.5 px-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الشهادة كصورة عالي الجودة (PNG)</span>
            </button>

            <button
              onClick={handleCopyText}
              className="py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{isCopied ? 'تم نسخ النص!' : 'نسخ نص الإنجاز للمشاركة'}</span>
            </button>
          </div>

          {/* Social Media Quick Share Shortcuts */}
          <div className="flex items-center justify-center space-x-3 space-x-reverse pt-2">
            <span className="text-xs text-slate-400 font-bold">مشاركة سريعة:</span>
            
            <button
              onClick={handleShareTwitter}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>منصة X (تويتر)</span>
            </button>

            <button
              onClick={handleShareWhatsapp}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
