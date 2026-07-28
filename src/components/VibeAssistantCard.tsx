import React, { useState } from 'react';
import { Sparkles, Wand2, CheckCircle2, AlertCircle, ArrowLeft, ChevronDown, ChevronUp, Lightbulb, Zap, ShieldCheck } from 'lucide-react';

interface VibeAssistantCardProps {
  prompt: string;
  onUpdatePrompt: (enhancedPrompt: string) => void;
  designTone: string;
}

interface SuggestionItem {
  id: string;
  title: string;
  explanation: string;
  textToAppend: string;
  category: 'style' | 'interactivity' | 'layout' | 'ux';
  applied: boolean;
}

export const VibeAssistantCard: React.FC<VibeAssistantCardProps> = ({
  prompt,
  onUpdatePrompt,
  designTone
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  // Calculate Quality Score
  const calculateScore = () => {
    if (!prompt || prompt.trim().length === 0) return 0;
    let score = 20;

    const len = prompt.trim().length;
    if (len > 30) score += 20;
    if (len > 80) score += 15;

    const lower = prompt.toLowerCase();
    if (lower.includes('tailwind') || lower.includes('ألوان') || lower.includes('تصميم') || lower.includes('شاشة') || lower.includes('داكن') || lower.includes('rounded')) score += 15;
    if (lower.includes('تفاعلي') || lower.includes('دالة') || lower.includes('حفظ') || lower.includes('زر') || lower.includes('حاسبة') || lower.includes('حذف') || lower.includes('إضافة')) score += 15;
    if (lower.includes('جوال') || lower.includes('rtl') || lower.includes('عربي') || lower.includes('متجاوب')) score += 15;

    return Math.min(100, score);
  };

  const score = calculateScore();

  // Score Badge Meta
  const getScoreBadge = () => {
    if (score < 40) return { label: 'يحتاج تفاصيل إضافية', color: 'bg-rose-500/10 text-rose-600 border-rose-200', bar: 'bg-rose-500' };
    if (score < 75) return { label: 'جيد وقابل للتوليد', color: 'bg-amber-500/10 text-amber-700 border-amber-200', bar: 'bg-amber-500' };
    return { label: 'برومبت مثالي ومكتمل ✨', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
  };

  const badge = getScoreBadge();

  // Generate dynamic suggestions based on current prompt content
  const getSuggestions = (): SuggestionItem[] => {
    const list: SuggestionItem[] = [];
    const lower = prompt.toLowerCase();

    if (!lower.includes('tailwind') && !lower.includes('تصميم')) {
      list.push({
        id: 'tailwind-style',
        title: 'إضافة توجيه تنسيقات Tailwind CSS وجماليات الحواف',
        explanation: 'يحدد للمحاكي استخدام مكتبة Tailwind CSS مع حواف rounded-2xl وظلال ناعمة لمنع ظهور تصميمات قديمة.',
        textToAppend: ' بـ HTML و Tailwind CSS مع ألوان أنيقة وحواف rounded-2xl',
        category: 'style',
        applied: appliedIds.includes('tailwind-style')
      });
    }

    if (!lower.includes('تفاعلي') && !lower.includes('حفظ') && !lower.includes('زر')) {
      list.push({
        id: 'interactivity',
        title: 'تعزيز التفاعلية والأنيميشن التفاعلي (JavaScript)',
        explanation: 'يضيف دالة برمجية لمعالجة النقرات والأحداث فوراً بدون إنعاش الصفحة.',
        textToAppend: ' واجعل جميع الأزرار تفاعلية مع تأثيرات حركية عند التحويم والنقر',
        category: 'interactivity',
        applied: appliedIds.includes('interactivity')
      });
    }

    if (!lower.includes('جوال') && !lower.includes('متجاوب') && !lower.includes('rtl')) {
      list.push({
        id: 'responsive-rtl',
        title: 'ضمان استجابة الجوال والاتجاه العربي RTL',
        explanation: 'يضمن ظهور الواجهة بشكل ممتاز على جميع المقاسات (Tablet & Mobile) وباتجاه عربي صحيح.',
        textToAppend: ' مع دعم اتجاه RTL الكامل والاستجابة لشاشات الجوال والتصميم المتجاوب',
        category: 'ux',
        applied: appliedIds.includes('responsive-rtl')
      });
    }

    if (!lower.includes('تنبيه') && !lower.includes('رسالة') && !lower.includes('حالة')) {
      list.push({
        id: 'toast-ux',
        title: 'إضافة تنبيهات تفاعلية ومؤشرات نجاح العملية',
        explanation: 'يضيف رسائل تأكيد توست (Toast notifications) تظهر للمستخدم عند إتمام أي إجراء.',
        textToAppend: ' مع إظهار رسائل تنبيهية جليّة عند تنفيذ أي إجراء من المستخدم',
        category: 'layout',
        applied: appliedIds.includes('toast-ux')
      });
    }

    return list;
  };

  const suggestions = getSuggestions();

  const handleApplySuggestion = (s: SuggestionItem) => {
    if (appliedIds.includes(s.id)) return;

    let newPrompt = prompt.trim();
    if (!newPrompt.endsWith('.') && newPrompt.length > 0) {
      newPrompt += s.textToAppend;
    } else {
      newPrompt += s.textToAppend;
    }

    onUpdatePrompt(newPrompt);
    setAppliedIds([...appliedIds, s.id]);
    setLastActionMsg(`تم تطبيق: ${s.title}`);
    setTimeout(() => setLastActionMsg(null), 3000);
  };

  // Full Prompt Auto-Enhance Transformer
  const handleAutoEnhance = () => {
    let base = prompt.trim();
    if (!base) {
      base = 'ابنِ تطبيقي المميز';
    }

    let enhanced = base;
    if (!enhanced.includes('Tailwind')) enhanced += ' بـ HTML و Tailwind CSS';
    if (!enhanced.includes('RTL')) enhanced += ' بدعم اتجاه RTL كامل للغة العربية';
    if (!enhanced.includes('تفاعلي')) enhanced += ' مع أزرار وتفاعلات حية باستخدام JavaScript';
    if (!enhanced.includes('rounded')) enhanced += ' وتصميم عصري بحواف rounded-2xl وشريط تقدم أنيق';

    onUpdatePrompt(enhanced);
    setAppliedIds(['tailwind-style', 'interactivity', 'responsive-rtl', 'toast-ux']);
    setLastActionMsg('تم تحسين وتزويد الـ Prompt بجميع المعايير الاحترافية! ✨');
    setTimeout(() => setLastActionMsg(null), 3500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-2xl p-4 border border-indigo-800/60 text-slate-100 shadow-xl space-y-3 font-sans transition-all">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Wand2 className="w-4 h-4 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-xs text-white">مساعد الـ Vibe الذكي</h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                AI Prompt Doctor 🤖
              </span>
            </div>
            <p className="text-[11px] text-slate-400">تحليل جودة الطلب واقتراح تحسينات الكود قبل التوليد</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg transition border border-slate-700/60"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3 pt-2 border-t border-indigo-900/60 animate-fadeIn">
          
          {/* Quality Score Bar */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>مؤشر اكتمال تفاصيل الـ Prompt:</span>
              </span>
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                {badge.label} ({score}%)
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className={`h-full rounded-full transition-all duration-500 ${badge.bar}`}
                style={{ width: `${Math.max(8, score)}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Auto-Enhance Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoEnhance}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>تعزيز الـ Prompt تلقائياً بضغطة زر ✨</span>
            </button>
          </div>

          {/* Success / Action Notification Toast */}
          {lastActionMsg && (
            <div className="p-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lastActionMsg}</span>
            </div>
          )}

          {/* Suggestions List */}
          {suggestions.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>اقتراحات المساعد لتحسين دقة الكود المطلوب:</span>
              </span>

              <div className="space-y-2">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-900/90 p-3 rounded-xl border border-indigo-900/40 hover:border-indigo-500/50 transition space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-xs text-indigo-200 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{s.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {s.explanation}
                        </p>
                      </div>

                      <button
                        onClick={() => handleApplySuggestion(s)}
                        disabled={s.applied}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                          s.applied
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95'
                        }`}
                      >
                        {s.applied ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>مطبق</span>
                          </>
                        ) : (
                          <>
                            <span>تطبيق</span>
                            <ArrowLeft className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-center space-y-1">
              <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>رائع جداً! الـ Prompt يحتوي على كافة التوجيهات الهيكلية والتصميمية.</span>
              </p>
              <p className="text-[11px] text-slate-400">جاهز للتوليد الآن بأقصى دقة بكود متكامل!</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
