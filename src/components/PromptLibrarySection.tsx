import React, { useState } from 'react';
import { promptLibraryData } from '../data/promptLibraryData';
import { VibePrompt } from '../types';
import { 
  Library, 
  Search, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Tag, 
  Filter,
  X,
  RotateCcw,
  Zap,
  Layers
} from 'lucide-react';

interface PromptLibrarySectionProps {
  loadPromptIntoSimulator: (promptText: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onCopyPrompt: () => void;
}

const POPULAR_SEARCH_KEYWORDS = [
  'حاسبة',
  'متجر',
  'مهام',
  'لعبة',
  'تهنئة',
  'SaaS',
  'تصحيح',
  'C-A-R-T'
];

export const PromptLibrarySection: React.FC<PromptLibrarySectionProps> = ({
  loadPromptIntoSimulator,
  showToast,
  onCopyPrompt
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'الكل',
    'تصميم الواجهات',
    'المتاجر والتطبيقات',
    'أدوات تفاعلية',
    'ألعاب وتسلية',
    'حل الأخطاء'
  ];

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filteredPrompts = promptLibraryData.filter((p) => {
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!trimmedQuery) return true;

    const matchesTitle = p.title.toLowerCase().includes(trimmedQuery);
    const matchesDesc = p.description.toLowerCase().includes(trimmedQuery);
    const matchesPromptText = p.promptText.toLowerCase().includes(trimmedQuery);
    const matchesTags = p.tags.some(t => t.toLowerCase().includes(trimmedQuery));
    const matchesCategoryText = p.category.toLowerCase().includes(trimmedQuery);
    const matchesDifficulty = p.difficulty.toLowerCase().includes(trimmedQuery);

    return matchesTitle || matchesDesc || matchesPromptText || matchesTags || matchesCategoryText || matchesDifficulty;
  });

  const handleCopyPromptText = (prompt: VibePrompt) => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopiedId(prompt.id);
    onCopyPrompt();
    showToast(`تم نسخ الأمر: "${prompt.title}" بنجاح! 📋`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleQuickKeywordClick = (keyword: string) => {
    if (searchQuery === keyword) {
      setSearchQuery('');
    } else {
      setSearchQuery(keyword);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('الكل');
    setSearchQuery('');
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header Banner */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Library className="w-3.5 h-3.5 text-indigo-400" />
              <span>مكتبة الأوامر الجاهزة Vibe Library</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">
              أوامر جاهزة ومجربة لأعلى جودة مخرجات 📚
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              تصفح أوامر الـ Prompts المصاغة خصيصاً وفق قواعد C-A-R-T للحصول على تطبيقات وواجهات مذهلة مباشرة.
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="shrink-0 bg-slate-800/80 border border-slate-700/80 px-4 py-3 rounded-2xl text-center shadow-inner">
            <span className="text-xs text-slate-400 block font-bold">المعروض في المكتبة</span>
            <span className="text-xl font-black text-amber-400">
              {filteredPrompts.length} <span className="text-xs text-slate-300 font-semibold">/ {promptLibraryData.length} أمر</span>
            </span>
          </div>
        </div>

        {/* Instant Search Bar Container */}
        <div className="space-y-3 pt-2 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-indigo-400 absolute right-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث فورياً بكلمة مفتاحية (مثل: حاسبة، متجر، لعبة، مهام، Tailwind)..."
              className="w-full pr-12 pl-11 py-4 bg-slate-800/90 border border-slate-700/90 focus:border-indigo-500 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 p-1 bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl transition"
                title="تفريغ البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Popular Quick Search Keywords Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-bold ml-1 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>بحث سريع:</span>
            </span>
            {POPULAR_SEARCH_KEYWORDS.map((kw) => {
              const isActive = searchQuery === kw;
              return (
                <button
                  key={kw}
                  onClick={() => handleQuickKeywordClick(kw)}
                  className={`px-3 py-1 rounded-xl font-extrabold text-[11px] transition flex items-center gap-1 border ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-slate-800/70 hover:bg-slate-700/90 text-slate-300 border-slate-700/80'
                  }`}
                >
                  <span>#{kw}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Filter Pills & Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Status Summary */}
        <div className="text-xs text-slate-500 font-bold shrink-0 flex items-center gap-2">
          <span>نتائج البحث: <strong className="text-indigo-600 font-black">{filteredPrompts.length}</strong> أمر</span>
          {(searchQuery || selectedCategory !== 'الكل') && (
            <button
              onClick={handleResetFilters}
              className="text-slate-500 hover:text-indigo-600 underline font-semibold transition flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>
      </div>

      {/* Prompt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrompts.length === 0 ? (
          <div className="md:col-span-2 text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm text-slate-600 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900">لم نجد أي أمر يطابق "{searchQuery || selectedCategory}"</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                جرب تغيير كلمة البحث أو اختيار تصنيف آخر من الشريط العلوي لعرض المزيد من النماذج.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-2 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة عرض كافة الأوامر</span>
            </button>
          </div>
        ) : (
          filteredPrompts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-indigo-500/60 hover:shadow-xl transition-all duration-300 space-y-4 relative group"
            >
              <div className="space-y-3">
                {/* Top Badge Info */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100/90 shadow-2xs">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-2 space-x-reverse text-xs text-slate-400 font-bold">
                    <span>مستوى: {item.difficulty}</span>
                    <span>•</span>
                    <span>نسخ {item.copyCount}+</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-black text-lg text-slate-900 mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, tIdx) => {
                    const isMatchedTag = trimmedQuery && tag.toLowerCase().includes(trimmedQuery);
                    return (
                      <span
                        key={tIdx}
                        onClick={() => handleQuickKeywordClick(tag)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg cursor-pointer transition ${
                          isMatchedTag
                            ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="انقر للبحث بهذا الوسم"
                      >
                        #{tag}
                      </span>
                    );
                  })}
                </div>

                {/* Copyable Code Snippet Box */}
                <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-xs font-mono dir-rtl leading-relaxed max-h-36 overflow-y-auto border border-slate-800 shadow-inner">
                  <p className="whitespace-pre-wrap select-all">{item.promptText}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleCopyPromptText(item)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700">تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>نسخ النص 📋</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => loadPromptIntoSimulator(item.promptText)}
                  className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Terminal className="w-4 h-4 text-indigo-200" />
                  <span>جرب بالمحاكي ⚡</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

