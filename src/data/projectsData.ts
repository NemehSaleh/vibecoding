import { VibeProject } from '../types';

export const vibeProjects: VibeProject[] = [
  {
    id: 'proj-1',
    title: 'حاسبة السعرات الحرارية والماكروز',
    description: 'تطبيق صحي تفاعلي يحسب احتياجاتك الغذائية اليومية ومؤشر كتلة الجسم مع رسوم بيانية ملونة.',
    category: 'صحة ولياقة',
    difficulty: 'مبتدئ',
    icon: 'PhHeartbeat',
    promptText: 'ابنِ حاسبة سعرات حرارية وتغذية صحية تفاعلية بـ HTML و Tailwind CSS و JavaScript مع شريط تقدم جذاب.',
    estimatedTime: '3 دقائق',
    previewColor: 'from-emerald-500 to-teal-600',
    features: ['حساب BMR & TDEE', 'توزيع البروتين والدهون', 'مؤشرات ألوان حية', 'حفظ المدخلات']
  },
  {
    id: 'proj-2',
    title: 'متجر مصغر للبطاقات الرقمية',
    description: 'واجهة متجر إلكتروني مع سلة تسوق تفاعلية وحساب إجمالي المشتريات وحقل كوبون الخصم.',
    category: 'تجارة إلكترونية',
    difficulty: 'متوسط',
    icon: 'PhShoppingBagOpen',
    promptText: 'اصنع واجهة متجر بطاقات رقمية إلكتروني بملف HTML كامل يحتوي على سلة تسوق حية وحساب إجمالي الخصم.',
    estimatedTime: '5 دقائق',
    previewColor: 'from-indigo-600 to-blue-500',
    features: ['سلة تسوق حية', 'كوبون خصم VIBE20', 'بطاقات منتجات جذابة', 'حساب التكلفة التلقائي']
  },
  {
    id: 'proj-3',
    title: 'منظم المهام اليومية (To-Do Vibe)',
    description: 'تطبيق إدارة المهام الشخصية مع إمكانية الفلترة، عداد الإنجاز، وإضافة مهام جديدة.',
    category: 'إنتاجية',
    difficulty: 'مبتدئ',
    icon: 'PhCheckCircle',
    promptText: 'أنشئ تطبيق قائمة مهام تفاعلية To-Do List مع إمكانية إضافة وشطب المهام وفلترتها وشريط نسبة الإنجاز.',
    estimatedTime: '2 دقيقة',
    previewColor: 'from-purple-600 to-indigo-500',
    features: ['إضافة وشطب المهام', 'شريط نسبة الإنجاز', 'حفظ تلقائي للمهام', 'تصفية المهام المكتملة']
  },
  {
    id: 'proj-4',
    title: 'صانع بطاقات التهنئة والمناسبات',
    description: 'واجهة لتصميم بطاقات تهنئة باسم المستلم والمناسبة وتغيير الألوان وحفظ البطاقة.',
    category: 'تطبيقات إبداعية',
    difficulty: 'مبتدئ',
    icon: 'PhSparkle',
    promptText: 'صمم أداة تفاعلية لإنشاء بطاقات تهنئة المظهر مع خيارات كتابة الاسم واختيار ألوان الخلفية وحفظ البطاقة.',
    estimatedTime: '4 دقائق',
    previewColor: 'from-amber-500 to-orange-600',
    features: ['تخصيص الاسم والرسالة', 'قوالب ألوان متعددة', 'معاينة حية فورية', 'زر نسخ التهنئة']
  }
];
