export interface ReadyProjectTemplate {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  prompt: string;
  tone: 'clean' | 'dark' | 'vibrant' | 'luxury';
  badge: string;
  tags: string[];
}

export const READY_PROJECT_TEMPLATES: ReadyProjectTemplate[] = [
  {
    id: 'landing-page',
    title: 'صفحة هبوط تسويقية لمنتج SaaS الذكي',
    category: 'تسويق ومبيعات',
    icon: '🚀',
    description: 'واجهة هبوط كاملة واحترافية تحتوي على قسم رئيسي Hero، مميزات الخدمة، باقات الأسعار، وآراء العملاء.',
    prompt: 'ابنِ صفحة هبوط تسويقية جبارة لمنتج ذكاء اصطناعي SaaS بـ HTML و Tailwind CSS، تحتوي على قسم Hero مع CTA، بطاقات المميزات، جدول باقات الأسعار، وآراء العملاء.',
    tone: 'luxury',
    badge: 'شائع جداً 🔥',
    tags: ['Hero Section', 'Pricing', 'Testimonials']
  },
  {
    id: 'calorie-calc',
    title: 'حاسبة السعرات الحرارية والماكروز',
    category: 'أدوات وصحة',
    icon: '⚡',
    description: 'تطبيق صحي تفاعلي يحسب معدل الأيض الاحتياجي BMR والاحتياج اليومي من البروتين والكارب والدهون.',
    prompt: 'ابنِ حاسبة سعرات حرارية وتغذية صحية تفاعلية بـ HTML و Tailwind CSS مع ألوان Indigo وحواف زوايا rounded-2xl وحساب الماكروز.',
    tone: 'clean',
    badge: 'جاهز للاستخدام ✨',
    tags: ['BMR Calc', 'Macros', 'Interactive']
  },
  {
    id: 'task-manager',
    title: 'منظم المهام اليومية المتطور',
    category: 'إنتاجية',
    icon: '✅',
    description: 'واجهة إدارية لإضافة وشطب المهام مع شريط تقدم حي ومؤشر نسبة الإنجاز المكتملة.',
    prompt: 'ابنِ تطبيق منظم مهام To-Do List تفاعلي وأنيق بـ HTML و Tailwind CSS مع شريط تقدم الإنجاز وإمكانية شطب وحذف المهام.',
    tone: 'vibrant',
    badge: 'تفاعلي 🎯',
    tags: ['To-Do', 'Progress Bar', 'LocalStorage']
  },
  {
    id: 'digital-store',
    title: 'متجر البطاقات والاشتراكات الرقمية',
    category: 'تجارة إلكترونية',
    icon: '🎮',
    description: 'واجهة متجر إلكتروني بنمط مظلم متناسق، يحتوي على سلة تسوق تفاعلية ونافذة إتمام الشراء.',
    prompt: 'ابنِ متجر بطاقات واشتراكات رقمية بـ HTML و Tailwind CSS بنمط Dark Mode، مع بطاقات منتجات وسلة شراء تفاعلية حسابية.',
    tone: 'dark',
    badge: 'Dark Mode 🌙',
    tags: ['Cart System', 'E-commerce', 'Checkout Modal']
  },
  {
    id: 'ai-chatbot',
    title: 'واجهة محادثة ذكاء اصطناعي (AI Chatbot UI)',
    category: 'ذكاء اصطناعي',
    icon: '🤖',
    description: 'واجهة شات تفاعلية شبيبة بـ ChatGPT مع سجل رسائل متسلسل ومؤشر كتابة ومساعد ذكي.',
    prompt: 'ابنِ واجهة محادثة شات ذكاء اصطناعي تفاعلية شبيبة بـ ChatGPT بـ HTML و Tailwind CSS مع إدخال الرسائل والردود التلقائية المباشرة.',
    tone: 'dark',
    badge: 'ذكاء اصطناعي 🤖',
    tags: ['Chat UI', 'Auto Reply', 'Glow Effects']
  },
  {
    id: 'portfolio-resume',
    title: 'معرض الأعمال والسيرة الذاتية المبتكرة',
    category: 'شخصي وبورتفوليو',
    icon: '💼',
    description: 'صفحة تعريفية شخصية لمبرمج/مصمم تعرض المشاريع، المهارات البرمجية، ونموذج تواصل مباشر.',
    prompt: 'ابنِ صفحة معرض أعمال شخصية Portfolio بـ HTML و Tailwind CSS مع قسم التعريف بالمطور، المهارات التقنية، شبكة المشاريع، ونموذج تواصل.',
    tone: 'luxury',
    badge: 'احترافي 🌟',
    tags: ['Portfolio', 'Skills Grid', 'Contact Form']
  }
];

export function getPresetSimulationCode(prompt: string, tone: string = 'clean'): string {
  const lowerPrompt = prompt.toLowerCase();

  // 1. SaaS Landing Page Preset
  if (lowerPrompt.includes('هبوط') || lowerPrompt.includes('landing') || lowerPrompt.includes('saas') || lowerPrompt.includes('تسويق')) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>منصة VibeFlow الذكية - مستقبل البرمجة</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>body { font-family: 'Cairo', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">

  <!-- Header / Navbar -->
  <header class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
        ⚡
      </div>
      <span class="text-xl font-black text-white tracking-wide">VibeFlow AI</span>
    </div>

    <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
      <a href="#features" class="hover:text-indigo-400 transition">المميزات</a>
      <a href="#pricing" class="hover:text-indigo-400 transition">الأسعار</a>
      <a href="#testimonials" class="hover:text-indigo-400 transition">آراء العملاء</a>
    </nav>

    <button onclick="alert('مرحباً بك! جاري تحويلك لصفحة تسجيل الدخول... 🚀')" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30">
      ابدأ مجاناً 🔥
    </button>
  </header>

  <!-- Hero Section -->
  <section class="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
    <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-bold mb-6">
      ✨ الجيل الثالث من البرمجة بالنوايا Vibe Coding
    </span>
    
    <h1 class="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
      حوّل أفكارك إلى تطبيقات متكاملة في <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">ثوانٍ معدودة</span>
    </h1>

    <p class="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
      اكتب برومبت بسيط بلغة عربية طبيعية، ودع محرك Vibe AI يتولى كتابة الكود، التنسيق، والربط مع الخوادم تلقائياً بدون تعقيد.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button onclick="alert('تم تفعيل التجربة المجانية! 🚀')" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-500/25 transition transform active:scale-95">
        تجربة المنصة الآن مجاناً 🚀
      </button>
      <button onclick="alert('فيديو الشرح التفاعلي سيعمل الآن 🎬')" class="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-base rounded-2xl border border-slate-800 transition">
        مشاهدة العرض التوضيحي 🎬
      </button>
    </div>
  </section>

  <!-- Features Grid Section -->
  <section id="features" class="max-w-6xl mx-auto px-6 py-16 border-t border-slate-900">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-extrabold text-white">لماذا يفضل المطورون VibeFlow؟</h2>
      <p class="text-slate-400 text-sm mt-2">بيئة عمل متكاملة مصممة خصيصاً للتطوير السريع بأعلى معايير الأداء</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition">
        <div class="w-12 h-12 rounded-2xl bg-indigo-950 text-indigo-400 flex items-center justify-center text-2xl font-bold mb-4">
          ⚡
        </div>
        <h3 class="text-xl font-bold text-white mb-2">توليد فوري للكود</h3>
        <p class="text-slate-400 text-sm leading-relaxed">تجهيز الواجهات والتنسيقات والتفاعلات بلحظات مع معالجة الأخطاء الذكية.</p>
      </div>

      <div class="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition">
        <div class="w-12 h-12 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center text-2xl font-bold mb-4">
          🐙
        </div>
        <h3 class="text-xl font-bold text-white mb-2">ربط حي مع GitHub</h3>
        <p class="text-slate-400 text-sm leading-relaxed">دفعت بنقرة واحدة لملفات المستودع مع حفظ إصدارات التغييرات 100%.</p>
      </div>

      <div class="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-pink-500/40 transition">
        <div class="w-12 h-12 rounded-2xl bg-pink-950 text-pink-400 flex items-center justify-center text-2xl font-bold mb-4">
          📱
        </div>
        <h3 class="text-xl font-bold text-white mb-2">استجابة لجميع الشاشات</h3>
        <p class="text-slate-400 text-sm leading-relaxed">معاينة تفاعلية حية لشاشات الجوال، التابلت والحاسوب بدقة فائقة.</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
    <p>© 2026 VibeFlow AI Inc. جميع الحقوق محفوظة - تم البناء بواسطة Vibe Coding</p>
  </footer>

</body>
</html>`;
  }

  // 2. AI Chatbot UI Preset
  if (lowerPrompt.includes('شات') || lowerPrompt.includes('محادث') || lowerPrompt.includes('بوت') || lowerPrompt.includes('chat')) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>المساعد الذكي Vibe Chat Bot</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Cairo', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col p-4">

  <!-- Chat Container Card -->
  <div class="max-w-2xl w-full mx-auto bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl flex flex-col flex-1 overflow-hidden my-auto h-[550px]">
    
    <!-- Chat Header -->
    <div class="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl text-white font-bold shadow-md">
          🤖
        </div>
        <div>
          <h2 class="font-extrabold text-white text-base">المساعد الذكي Vibe AI</h2>
          <span class="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> متصل الآن
          </span>
        </div>
      </div>

      <button onclick="clearChat()" class="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
        مسح المحادثة 🗑️
      </button>
    </div>

    <!-- Messages Body Area -->
    <div id="messagesArea" class="flex-1 p-5 overflow-y-auto space-y-4">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">AI</div>
        <div class="bg-slate-800 p-4 rounded-2xl rounded-tr-none text-sm text-slate-200 border border-slate-700/80 max-w-[85%] leading-relaxed">
          أهلاً بك! أنا مساعد Vibe الذكي. كيف يمكنني مساعدتك في تطوير تطبيقك اليوم؟ ✨
        </div>
      </div>
    </div>

    <!-- Input Footer Bar -->
    <form onsubmit="sendMessage(event)" class="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
      <input type="text" id="userInput" placeholder="اكتب سؤالك هنا..." required class="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition">
      <button type="submit" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/20">
        إرسال 🚀
      </button>
    </form>

  </div>

  <script>
    function sendMessage(e) {
      e.preventDefault();
      const input = document.getElementById('userInput');
      const text = input.value.trim();
      if (!text) return;

      const area = document.getElementById('messagesArea');

      // User Message Bubble
      area.innerHTML += \`
        <div class="flex items-start justify-end gap-3">
          <div class="bg-indigo-600 p-4 rounded-2xl rounded-tl-none text-sm text-white max-w-[85%] leading-relaxed shadow-md">
            \${text}
          </div>
        </div>
      \`;

      input.value = '';
      area.scrollTop = area.scrollHeight;

      // Simulated Bot Reply
      setTimeout(() => {
        const replies = [
          "ممتاز! هذا المفهوم يعتمد على تبسيط البرومبت بدقة. يمكنك تطبيقه فوراً في المحاكي! 🚀",
          "فكرة رائعة جداً! سأساعدك في ضبط تصميم Tailwind لهذه الواجهة. ✨",
          "تم تسجيل الطلب وتنسيق الكود المناسب له بنجاح! 🔥"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        area.innerHTML += \`
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">AI</div>
            <div class="bg-slate-800 p-4 rounded-2xl rounded-tr-none text-sm text-slate-200 border border-slate-700/80 max-w-[85%] leading-relaxed">
              \${randomReply}
            </div>
          </div>
        \`;
        area.scrollTop = area.scrollHeight;
      }, 700);
    }

    function clearChat() {
      document.getElementById('messagesArea').innerHTML = \`
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">AI</div>
          <div class="bg-slate-800 p-4 rounded-2xl rounded-tr-none text-sm text-slate-200 border border-slate-700/80 max-w-[85%] leading-relaxed">
            تم إعادة ضبط المحادثة بنجاح! جاهز لأسئلتك الجديدة ✨
          </div>
        </div>
      \`;
    }
  </script>
</body>
</html>`;
  }

  // 3. Calorie & Fitness Calculator Preset
  if (lowerPrompt.includes('سعرات') || lowerPrompt.includes('كالوري') || lowerPrompt.includes('bmr') || lowerPrompt.includes('وزن')) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>حاسبة الرشاقة الذكية</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Cairo', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 p-4 md:p-8 min-h-screen">
  <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
    <div class="flex items-center space-x-3 space-x-reverse mb-6 pb-4 border-b border-slate-100">
      <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-200">
        ⚡
      </div>
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900">حاسبة الرشاقة والماكروز الذكية</h1>
        <p class="text-sm text-slate-500">تم التوليد بأسلوب Vibe Coding عبر Gemini</p>
      </div>
    </div>

    <form id="calcForm" onsubmit="calculate(event)" class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">الوزن (كجم)</label>
          <input type="number" id="weight" value="75" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">الطول (سم)</label>
          <input type="number" id="height" value="175" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">العمر</label>
          <input type="number" id="age" value="26" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">مستوى النشاط</label>
          <select id="activity" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white">
            <option value="1.2">خفيف (مكتبي)</option>
            <option value="1.375" selected>متوسط (تمرين 2-3 أيام)</option>
            <option value="1.55">عالي (تمرين 4-5 أيام)</option>
            <option value="1.725">رياضي محترف</option>
          </select>
        </div>
      </div>

      <button type="submit" class="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition transform active:scale-95">
        احسب الاحتياج اليومي الآن 🔥
      </button>
    </form>

    <div id="result" class="mt-8 hidden space-y-4">
      <div class="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
        <div class="text-center">
          <span class="text-sm font-bold text-indigo-600 uppercase tracking-wider">احتياجك اليومي للمحافظة على الوزن</span>
          <div class="text-4xl font-black text-slate-900 my-2" id="caloriesVal">2,250 <span class="text-lg font-normal text-slate-600">سعرة/يوم</span></div>
          <p class="text-xs text-slate-500">ملاحظة: لخسارة الوزن اطرح 400 سعرة، ولزيادة العضلات أضف 300 سعرة.</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
          <div class="text-xs text-emerald-700 font-bold">البروتين</div>
          <div id="proteinVal" class="text-xl font-bold text-emerald-900 mt-1">150g</div>
        </div>
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
          <div class="text-xs text-amber-700 font-bold">الكارب</div>
          <div id="carbVal" class="text-xl font-bold text-amber-900 mt-1">220g</div>
        </div>
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <div class="text-xs text-blue-700 font-bold">الدهون الصحية</div>
          <div id="fatVal" class="text-xl font-bold text-blue-900 mt-1">60g</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    function calculate(e) {
      e.preventDefault();
      const w = parseFloat(document.getElementById('weight').value);
      const h = parseFloat(document.getElementById('height').value);
      const a = parseFloat(document.getElementById('age').value);
      const act = parseFloat(document.getElementById('activity').value);

      const bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
      const tdee = Math.round(bmr * act);

      document.getElementById('caloriesVal').innerText = tdee.toLocaleString('ar-SA') + ' سعرة/يوم';
      document.getElementById('proteinVal').innerText = Math.round(w * 2) + ' جم';
      document.getElementById('carbVal').innerText = Math.round((tdee * 0.4) / 4) + ' جم';
      document.getElementById('fatVal').innerText = Math.round((tdee * 0.25) / 9) + ' جم';

      const resDiv = document.getElementById('result');
      resDiv.classList.remove('hidden');
      resDiv.scrollIntoView({ behavior: 'smooth' });
    }
  </script>
</body>
</html>`;
  }

  // 4. E-commerce Store Preset
  if (lowerPrompt.includes('متجر') || lowerPrompt.includes('بطاق') || lowerPrompt.includes('سلة') || lowerPrompt.includes('شراء')) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>متجر فيايب كاردز الرقمي</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Cairo', sans-serif; }</style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-4 md:p-8">
  <div class="max-w-4xl mx-auto">
    <header class="flex justify-between items-center bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/50 mb-8">
      <div class="flex items-center space-x-3 space-x-reverse">
        <span class="text-3xl">🎮</span>
        <div>
          <h1 class="text-xl font-bold text-white">متجر Vibe Cards</h1>
          <p class="text-xs text-indigo-400">بطاقات واشتراكات رقمية فورية</p>
        </div>
      </div>
      <button onclick="toggleCart()" class="relative px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 transition">
        <span>السلة 🛒</span>
        <span id="cartCount" class="bg-white text-indigo-900 text-xs px-2 py-0.5 rounded-full font-black">0</span>
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-800 rounded-2xl p-5 border border-slate-700/60 hover:border-indigo-500/50 transition">
        <div class="text-4xl mb-3 text-center">📱</div>
        <h3 class="font-bold text-lg mb-1">بطاقة شحن 100 ريال</h3>
        <p class="text-xs text-slate-400 mb-4">تسليم فوري عبر الكود الرقمي</p>
        <div class="flex items-center justify-between">
          <span class="text-indigo-400 font-extrabold text-lg">100 ر.س</span>
          <button onclick="addToCart('بطاقة شحن 100 ريال', 100)" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition">+ أضف</button>
        </div>
      </div>

      <div class="bg-slate-800 rounded-2xl p-5 border border-slate-700/60 hover:border-indigo-500/50 transition">
        <div class="text-4xl mb-3 text-center">🎬</div>
        <h3 class="font-bold text-lg mb-1">اشتراك سينما 3 أشهر</h3>
        <p class="text-xs text-slate-400 mb-4">جودة 4K على كافة الأجهزة</p>
        <div class="flex items-center justify-between">
          <span class="text-indigo-400 font-extrabold text-lg">120 ر.س</span>
          <button onclick="addToCart('اشتراك سينما 3 أشهر', 120)" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition">+ أضف</button>
        </div>
      </div>

      <div class="bg-slate-800 rounded-2xl p-5 border border-slate-700/60 hover:border-indigo-500/50 transition">
        <div class="text-4xl mb-3 text-center">🎯</div>
        <h3 class="font-bold text-lg mb-1">اشتراك ألعاب Premium</h3>
        <p class="text-xs text-slate-400 mb-4">وصول لأكثر من 500 لعبة</p>
        <div class="flex items-center justify-between">
          <span class="text-indigo-400 font-extrabold text-lg">150 ر.س</span>
          <button onclick="addToCart('اشتراك ألعاب Premium', 150)" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition">+ أضف</button>
        </div>
      </div>
    </div>

    <div id="cartModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-700">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">محتويات السلة 🛒</h2>
          <button onclick="toggleCart()" class="text-slate-400 hover:text-white">✕</button>
        </div>
        <div id="cartItems" class="space-y-3 max-h-60 overflow-y-auto pr-1">
          <p class="text-sm text-slate-400 text-center py-4">السلة فارغة حالياً</p>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
          <span class="font-bold text-slate-300">الإجمالي:</span>
          <span id="cartTotal" class="text-xl font-extrabold text-emerald-400">0 ر.س</span>
        </div>
        <button onclick="alert('تم إرسال طلب الشراء بنجاح! 🚀')" class="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl transition">
          إتمام الطلب وتلقي الكود ✨
        </button>
      </div>
    </div>
  </div>

  <script>
    let cart = [];
    function addToCart(title, price) {
      cart.push({ title, price });
      updateCartUI();
    }
    function toggleCart() {
      document.getElementById('cartModal').classList.toggle('hidden');
    }
    function updateCartUI() {
      document.getElementById('cartCount').innerText = cart.length;
      const itemsContainer = document.getElementById('cartItems');
      if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="text-sm text-slate-400 text-center py-4">السلة فارغة حالياً</p>';
        document.getElementById('cartTotal').innerText = '0 ر.س';
        return;
      }
      let html = '';
      let total = 0;
      cart.forEach((item, index) => {
        total += item.price;
        html += \`<div class="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl">
          <span class="text-sm font-medium">\${item.title}</span>
          <span class="text-sm font-bold text-indigo-400">\${item.price} ر.س</span>
        </div>\`;
      });
      itemsContainer.innerHTML = html;
      document.getElementById('cartTotal').innerText = total + ' ر.س';
    }
  </script>
</body>
</html>`;
  }

  // 5. To-Do & Task Manager Preset
  if (lowerPrompt.includes('مهم') || lowerPrompt.includes('مهام') || lowerPrompt.includes('منظم') || lowerPrompt.includes('قائمة')) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>منظم المهام Vibe To-Do</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Cairo', sans-serif; }</style>
</head>
<body class="bg-slate-100 text-slate-800 p-4 md:p-8 min-h-screen">
  <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8">
    <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
      <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
        <span>✅</span> منظم المهام الشخصية
      </h1>
      <span id="progressText" class="text-xs font-extrabold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
        0% مكتمل
      </span>
    </div>

    <div class="flex gap-2 mb-6">
      <input type="text" id="taskInput" placeholder="أدخل مهمة جديدة..." class="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm">
      <button onclick="addTask()" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1 shadow-md shadow-indigo-200">
        إضافة ➕
      </button>
    </div>

    <div class="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
      <div id="progressBar" class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: 0%"></div>
    </div>

    <div id="tasksList" class="space-y-3">
    </div>
  </div>

  <script>
    let tasks = [
      { id: 1, text: 'تعلم مفهوم Vibe Prompting مع Gemini', done: true },
      { id: 2, text: 'إنشاء خزانة سحابية على GitHub', done: false },
      { id: 3, text: 'بناء أول تطبيق تفاعلي في المحاكي', done: false }
    ];

    function renderTasks() {
      const list = document.getElementById('tasksList');
      if (tasks.length === 0) {
        list.innerHTML = '<p class="text-center text-slate-400 py-6 text-sm">لا توجد مهام حالياً!</p>';
        updateProgress();
        return;
      }
      list.innerHTML = tasks.map(t => \`
        <div class="flex items-center justify-between p-3.5 rounded-xl border \${t.done ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' : 'bg-white border-slate-200 text-slate-800'} shadow-sm transition">
          <div class="flex items-center gap-3">
            <input type="checkbox" \${t.done ? 'checked' : ''} onchange="toggleTask(\${t.id})" class="w-5 h-5 rounded text-indigo-600 cursor-pointer">
            <span class="text-sm font-semibold">\${t.text}</span>
          </div>
          <button onclick="deleteTask(\${t.id})" class="text-rose-500 hover:text-rose-700 text-xs font-bold px-2 py-1">حذف 🗑️</button>
        </div>
      \`).join('');
      updateProgress();
    }

    function addTask() {
      const input = document.getElementById('taskInput');
      if (!input.value.trim()) return;
      tasks.push({ id: Date.now(), text: input.value.trim(), done: false });
      input.value = '';
      renderTasks();
    }

    function toggleTask(id) {
      tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }

    function updateProgress() {
      if (tasks.length === 0) {
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressText').innerText = '0% مكتمل';
        return;
      }
      const doneCount = tasks.filter(t => t.done).length;
      const pct = Math.round((doneCount / tasks.length) * 100);
      document.getElementById('progressBar').style.width = pct + '%';
      document.getElementById('progressText').innerText = pct + '% مكتمل (' + doneCount + '/' + tasks.length + ')';
    }

    renderTasks();
  </script>
</body>
</html>`;
  }

  // 6. Portfolio Preset
  if (lowerPrompt.includes('معرض') || lowerPrompt.includes('سيرة') || lowerPrompt.includes('portfolio') || lowerPrompt.includes('مطور')) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>معرض أعمال المطور Vibe Developer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>body { font-family: 'Cairo', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8">
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-5">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-xl">
          👨‍💻
        </div>
        <div>
          <h1 class="text-2xl font-black text-white">المهندس أحمد علي</h1>
          <p class="text-sm text-indigo-400 font-bold mt-1">مطوّر تطبيقات Vibe Coding & Full-Stack</p>
          <p class="text-xs text-slate-400 mt-2">متخصص في بناء واجهات React واستخدام نماذج الذكاء الاصطناعي</p>
        </div>
      </div>
      <button onclick="alert('شكراً لتواصلك! تم إرسال رسالتك بنجاح ✨')" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-2xl text-sm transition">
        تواصل معي 📬
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <span class="text-xs font-bold text-indigo-400">المشروع 01</span>
        <h3 class="text-lg font-bold text-white mt-1 mb-2">منصة الذكاء الاصطناعي العربي</h3>
        <p class="text-xs text-slate-400 leading-relaxed mb-4">تطبيق ويب تفاعلي يولد أكواد وتصميمات جاهزة بلغة عربية طبيعية.</p>
        <div class="flex gap-2">
          <span class="text-[10px] bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-800">React</span>
          <span class="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">Tailwind</span>
        </div>
      </div>

      <div class="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <span class="text-xs font-bold text-purple-400">المشروع 02</span>
        <h3 class="text-lg font-bold text-white mt-1 mb-2">لوحة تحليل بيانات المبيعات</h3>
        <p class="text-xs text-slate-400 leading-relaxed mb-4">داشبورد تفاعلي بالرسوم البيانية لمتابعة الأداء وإجمالي الأرباح.</p>
        <div class="flex gap-2">
          <span class="text-[10px] bg-purple-950 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-800">Chart.js</span>
          <span class="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">Node.js</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  // Generic Default Beautiful Responsive Vibe App Preset
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تطبيق Vibe Code العربي</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Cairo', sans-serif; }</style>
</head>
<body class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen flex items-center justify-center p-4">
  <div class="max-w-xl w-full bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/80 shadow-2xl text-center">
    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30">
      ✨
    </div>
    <h1 class="text-2xl font-black mb-2 text-white">تطبيق Vibe Coding تفاعلي</h1>
    <p class="text-sm text-slate-300 mb-6 leading-relaxed">
      تم توليد هذه الواجهة استجابةً لأمرك: <br>
      <span class="text-indigo-400 font-bold bg-indigo-950/60 px-3 py-1 rounded-lg inline-block mt-2 border border-indigo-800/50">"${prompt.slice(0, 70)}${prompt.length > 70 ? '...' : ''}"</span>
    </p>

    <div class="bg-slate-900/60 p-5 rounded-xl border border-slate-700/50 mb-6 text-right space-y-3">
      <div class="flex items-center gap-3 text-emerald-400 font-bold text-sm">
        <span>✓</span> تم بناء الهيكل والتنسيق بواسطة Tailwind CSS
      </div>
      <div class="flex items-center gap-3 text-blue-400 font-bold text-sm">
        <span>✓</span> جاهز للاستجابة للتفاعلات والتعديلات
      </div>
      <div class="flex items-center gap-3 text-purple-400 font-bold text-sm">
        <span>✓</span> حفظ التعديلات والربط التلقائي بـ GitHub
      </div>
    </div>

    <div class="flex gap-3 justify-center">
      <button onclick="alert('أحسنت! هذا التفاعل تم تنفيذه بـ JavaScript 🚀')" class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition transform active:scale-95 text-sm">
        تجربة التفاعل الحي ⚡
      </button>
      <button onclick="document.body.classList.toggle('bg-slate-100'); document.body.classList.toggle('text-slate-900');" class="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-sm transition">
        تغيير المظهر 🌙/☀️
      </button>
    </div>
  </div>
</body>
</html>`;
}
