import React, { useState } from 'react';
import { glossaryTerms } from '../data/glossaryData';
import { X, Search, BookMarked, Sparkles } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTerms = glossaryTerms.filter(
    item =>
      item.term.includes(searchQuery) ||
      item.englishTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">قاموس المصطلحات الميسرة</h3>
              <p className="text-xs text-slate-400">شرح المفاهيم البرمجية بتشبهات من الحياة اليومية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مصطلح (مثل: GitHub، API، Prompt)..."
              className="w-full pr-11 pl-4 py-2.5 bg-slate-800/80 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Terms List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>لم نجد نتائج مطابقة لـ "{searchQuery}"</p>
            </div>
          ) : (
            filteredTerms.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 hover:border-indigo-500/40 transition space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-lg text-white flex items-center gap-2">
                      <span>{item.term}</span>
                      <span className="text-xs text-indigo-400 font-mono font-medium dir-ltr inline-block">
                        ({item.englishTerm})
                      </span>
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Simple Analogy Box */}
                <div className="p-3 bg-indigo-950/40 border border-indigo-800/30 rounded-xl flex items-start gap-2.5 text-xs text-indigo-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-amber-300">التشبيه الميسر: </span>
                    {item.simpleAnalogy}
                  </p>
                </div>

                {/* Explanation */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition"
          >
            حسناً، فهمت! 🚀
          </button>
        </div>

      </div>
    </div>
  );
};
