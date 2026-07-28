import React, { useState } from 'react';
import { Sparkles, HelpCircle, Loader2, Info } from 'lucide-react';

interface SmartConceptTooltipProps {
  term: string;
  label?: string;
  badgeText?: string;
  className?: string;
}

// In-memory cache to avoid duplicate API calls for the same concept term
const explanationCache: Record<string, string> = {
  'C-A-R-T': 'قاعدة صياغة الأوامر الذهبية: Context (السياق)، Action (الفعل)، Role (الدور)، Target (الهدف النهائي). تشبه إعطاء الوصفة لطهي وجبتك المفضلة.',
  'API Key': 'مفتاح الأمان الرقمي الذي يسمح لتطبيقك بالتواصل المعزز مع خوادم الذكاء الاصطناعي Gemini، مثل مفتاح الشقة الفندقية الخاص بك.',
  'Tailwind CSS': 'إطار عمل لتنسيق الألوان والحواف مباشرة باستخدام فئات جاهزة، مثل استخدام قطع الليجو الملونة لتجهيز الواجهة.',
  'Git Commit': 'لحظة حفظ نسخة من مشروعك في سجل التاريخ، مثل حفظ مرحلة تقدمك داخل لعبة فيديو لتستطيع العودة إليها دائماً.',
  'RTL Support': 'توجيه الواجهة لتناسب اللغة العربية من اليمين إلى اليسار تلقائياً لضمان تجربة مستخدم مريحة.',
  'Refactoring': 'إعادة ترتيب وتنظيف الكود البرمجي دون تغيير وظيفته الأساسية، مثل ترتيب خزانة الملابس لتسهيل الوصول للأغراض.',
  'State': 'ذاكرة التطبيق الحية التي تحفظ مدخلات المستخدم (مثل محتوى السلة أو القيمة المدخلة) أثناء التنقل.',
  'Iframe Sandbox': 'بيئة معزولة وآمنة داخل المتصفح لتشغيل ومعاينة تطبيقات الـ Vibe Coding دون التأثير على الموقع الرئيسي.',
  'DOM': 'هيكل الشجرة التفصيلي الذي يمثل جميع عناصر الصفحة (عناوين، أزرار، صور) ليتمكن الكود من التحكم بها.',
  'Prompt Doctor': 'مساعد ذكي يفحص طبيعة وصفك ويقترح إضافة تفاصيل التصميم والتفاعلية قبل البدء بالتوليد.'
};

export const SmartConceptTooltip: React.FC<SmartConceptTooltipProps> = ({
  term,
  label,
  badgeText,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string | null>(explanationCache[term] || null);

  const fetchExplanation = async () => {
    if (explanationCache[term]) {
      setExplanation(explanationCache[term]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/explain-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term })
      });

      const data = await res.json();
      if (data && data.explanation) {
        explanationCache[term] = data.explanation;
        setExplanation(data.explanation);
      } else {
        setExplanation(`مصطلح "${term}" مفهوم هام في بناء وتطوير تطبيقات الـ Vibe Coding.`);
      }
    } catch (e) {
      console.error('Failed to fetch concept explanation:', e);
      setExplanation(explanationCache[term] || `مصطلح "${term}" من أساسيات Vibe Coding.`);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (!explanation) {
      fetchExplanation();
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => {
        setIsVisible(!isVisible);
        if (!explanation && !isVisible) fetchExplanation();
      }}
    >
      {/* Interactive Concept Pill/Trigger */}
      <span 
        className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all border shadow-xs ${
          isVisible 
            ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-500/30' 
            : 'bg-indigo-950/70 hover:bg-indigo-900 text-indigo-200 border-indigo-800/80 hover:border-indigo-500'
        } ${className}`}
      >
        <HelpCircle className="w-3 h-3 text-amber-300 animate-pulse" />
        <span>{label || term}</span>
        {badgeText && (
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-bold">
            {badgeText}
          </span>
        )}
      </span>

      {/* Floating Smart Tooltip Bubble */}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 bg-slate-900/95 border border-indigo-500/60 text-slate-100 rounded-2xl shadow-2xl backdrop-blur-md z-50 animate-fadeIn pointer-events-auto">
          
          {/* Tooltip Arrow Indicator */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95"></div>

          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-900/60">
            <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>تلميح ذكي: {term}</span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Gemini AI 🤖
            </span>
          </div>

          {/* Body Content */}
          {loading ? (
            <div className="flex items-center justify-center py-3 text-xs text-indigo-300 gap-2 font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>جاري صياغة الشرح المبسط بـ Gemini...</span>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                {explanation}
              </p>
              <div className="flex items-center justify-end text-[9px] text-slate-400 pt-1 gap-1">
                <Info className="w-3 h-3 text-amber-400" />
                <span>مرر الماوس للتوضيح الفوري</span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
