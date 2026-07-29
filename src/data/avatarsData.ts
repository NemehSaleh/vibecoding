import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/storage';
export interface UserAvatar {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  badgeTag: string;
  description: string;
}

export const predefinedAvatars: UserAvatar[] = [
  {
    id: 'avatar-rocket',
    name: 'رائد الـ Vibe 🚀',
    emoji: '🚀',
    bgGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-900',
    badgeTag: 'مستكشف المستقبل',
    description: 'ينطلق بسرعة نحو احتراف بناء التطبيقات بالذكاء الاصطناعي.'
  },
  {
    id: 'avatar-robot',
    name: 'مهندس البرومبت 🤖',
    emoji: '🤖',
    bgGradient: 'from-blue-500 via-cyan-500 to-teal-400',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-900',
    badgeTag: 'خبير C-A-R-T',
    description: 'يصيغ الأوامر بدقة فائقة ويحصل على أفضل مخرجات الكود.'
  },
  {
    id: 'avatar-wizard',
    name: 'ساحر الكود 🧙‍♂️',
    emoji: '🧙‍♂️',
    bgGradient: 'from-purple-600 via-fuchsia-500 to-indigo-600',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-900',
    badgeTag: 'صانع المعجزات',
    description: 'يحول الأفكار المعقدة إلى واجهات حية بلمسة زر.'
  },
  {
    id: 'avatar-zap',
    name: 'المطور الخارق ⚡',
    emoji: '⚡',
    bgGradient: 'from-amber-400 via-orange-500 to-amber-600',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-900',
    badgeTag: 'تطوير فائق السرعة',
    description: 'يبني ويعدل الواجهات في ثوانٍ معدودة.'
  },
  {
    id: 'avatar-cat',
    name: 'قط الـ Vibe 🐱',
    emoji: '🐱',
    bgGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-900',
    badgeTag: 'برمجة بإنتاجية وهدوء',
    description: 'يعمل بهدوء وذكاء ليحقق نتائج مبهرة بدون توتر.'
  },
  {
    id: 'avatar-fox',
    name: 'ثعلب الكود 🦊',
    emoji: '🦊',
    bgGradient: 'from-orange-500 via-rose-500 to-amber-500',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-900',
    badgeTag: 'سريع البديهة',
    description: 'يجد الحلول الابتكارية للأخطاء والمشكلات فور ظهورها.'
  },
  {
    id: 'avatar-gem',
    name: 'الجوهرة الذكية 💎',
    emoji: '💎',
    bgGradient: 'from-cyan-400 via-sky-500 to-blue-600',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-900',
    badgeTag: 'جودة واجهات فائقة',
    description: 'يهتم بالتفاصيل الدقيقة والجماليات البصرية العالية.'
  },
  {
    id: 'avatar-gamer',
    name: 'بطل التفاعل 👾',
    emoji: '👾',
    bgGradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
    borderColor: 'border-violet-300',
    textColor: 'text-violet-900',
    badgeTag: 'واجهات ممتعة',
    description: 'يضيف روح التسلية والتحفيز إلى كل تطبيق يبتكره.'
  },
  {
    id: 'avatar-coder',
    name: 'المبرمج الشغوف 👨‍💻',
    emoji: '👨‍💻',
    bgGradient: 'from-slate-800 via-slate-900 to-slate-950',
    borderColor: 'border-slate-500',
    textColor: 'text-slate-900',
    badgeTag: 'تركيز واستمرارية',
    description: 'يبحث دائماً عن النظافة في الكود وبنية البرمجيات.'
  },
  {
    id: 'avatar-star',
    name: 'النجم الصاعد 🌟',
    emoji: '🌟',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-400',
    borderColor: 'border-yellow-300',
    textColor: 'text-amber-900',
    badgeTag: 'طموح متجدد',
    description: 'يتعلم باستمرار ويرتقي بمستواه يوماً بعد يوم.'
  }
];

export const AVATAR_STORAGE_KEY = 'vibe_coder_user_selected_avatar_v1';

export const getStoredAvatar = (): UserAvatar => {
  try {
    const savedId = safeGetItem(AVATAR_STORAGE_KEY);
    if (savedId) {
      const found = predefinedAvatars.find(a => a.id === savedId);
      if (found) return found;
    }
  } catch (err) {
    console.error('Failed to read avatar from localStorage:', err);
  }
  return predefinedAvatars[0]; // Default to Rocket avatar
};
