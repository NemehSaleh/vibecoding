import React from 'react';
import { UserAvatar, predefinedAvatars } from '../data/avatarsData';
import { X, Check, Sparkles, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatar: UserAvatar;
  onSelectAvatar: (avatar: UserAvatar) => void;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedAvatar,
  onSelectAvatar
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-[2.5rem] max-w-2xl w-full p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6 relative overflow-hidden text-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-bold text-2xl shadow-sm">
                🎨
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>اختر صورتك الرمزية (Avatar)</span>
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500">اختر الأيقونة وشخصية الـ Vibe Coder التي تعبر عن أسلوبك</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Avatars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto p-1 dir-rtl">
            {predefinedAvatars.map((avatar) => {
              const isSelected = selectedAvatar.id === avatar.id;
              return (
                <div
                  key={avatar.id}
                  onClick={() => onSelectAvatar(avatar)}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-md scale-[1.02]'
                      : 'border-slate-200/90 hover:border-indigo-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  {/* Selected Indicator Badge */}
                  {isSelected && (
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  {/* Avatar Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center text-2xl shrink-0 shadow-md text-white border ${avatar.borderColor}`}>
                    {avatar.emoji}
                  </div>

                  {/* Avatar Info */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-900">{avatar.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-indigo-700 border border-indigo-200 rounded-full shadow-2xs">
                        {avatar.badgeTag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {avatar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>تُحفظ الصورة الرمزية تلقائياً في ذاكرة المتصفح (LocalStorage)</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition"
            >
              تم الاختيار 👍
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
