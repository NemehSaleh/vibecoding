import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Vibe Code Generation using Gemini API
  app.post("/api/generate-vibe", async (req, res) => {
    try {
      const { prompt, tone, language } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "الرجاء إدخال الوصف (Prompt)" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          success: false,
          usingFallback: true,
          message: "ملاحظة: مفتاح Gemini API غير مفعّل، تم التوليد بواسطة محاكي النماذج السريعة."
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
أنت مهندس خبير في تطوير الواجهات واستجابات Vibe Coding.
يطلب منك المستخدم بناء تطبيق أو مكون تفاعلي بالـ HTML/Tailwind CSS/JavaScript.
المستخدم غير مبرمج، لذا صمم الشيء بأعلى جودة بصرية، ألوان عصرية (Slate/Indigo/Blue)، خطوط واضحة، تفاعلية ممتازة، ومحتوى عربي ملهم.

قواعد الإجابة:
1. ارجع كود HTML متكامل تماماً يمكن تشغيله مباشرة داخل iframe.
2. استخدم Tailwind CSS عبر CDN: <script src="https://cdn.tailwindcss.com"></script>
3. استخدم أيقونات FontAwesome أو Lucide إذا لزم الأمر عبر CDN.
4. أضف وسكريبتات JavaScript التفاعلية داخل نفس الملف.
5. ارجع الكود فقط داخل وسم html أو كود متكامل.
6. أضف أيضاً شريط شرح مبسط باللغة العربية يشرح ما تم بناؤه في أسطر قليلة.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nطلب المستخدم (Vibe Prompt): ${prompt}` }] }
        ]
      });

      const resultText = response.text || "";

      // Extract HTML code block if formatted with markdown
      let extractedCode = resultText;
      const htmlMatch = resultText.match(/```html([\s\S]*?)```/) || resultText.match(/```([\s\S]*?)```/);
      if (htmlMatch) {
        extractedCode = htmlMatch[1].trim();
      }

      return res.json({
        success: true,
        code: extractedCode,
        rawText: resultText,
        aiModel: "gemini-2.5-flash"
      });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.json({
        success: false,
        usingFallback: true,
        error: error.message || "حدث خطأ أثناء التواصل مع Gemini API."
      });
    }
  });

  // API Route: AI Vibe Concept Explanation using Gemini API
  app.post("/api/explain-concept", async (req, res) => {
    try {
      const { term } = req.body;
      if (!term) {
        return res.status(400).json({ error: "الرجاء تحديد المصطلح" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      
      // Fallback explanations for instant answers if API Key is not set or rate-limited
      const fallbackMap: Record<string, string> = {
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

      if (!apiKey) {
        return res.json({
          success: true,
          usingFallback: true,
          explanation: fallbackMap[term] || `مصطلح "${term}" يعبر عن مفهوم أساسي في تطوير التطبيقات بالتوجيه الذكي Vibe Coding لتسهيل التواصل مع المحاكي.`
        });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `اشرح مصطلح الـ Vibe Coding التالي: "${term}" لشخص غير مبرمج في جملتين قصيرتين ومبسطتين جداً بلغة عربية مشوقة مع تشبيه من الحياة اليومية.`,
      });

      const explanation = response.text || fallbackMap[term] || `مصطلح "${term}" مفهوم هام في الـ Vibe Coding.`;

      return res.json({
        success: true,
        term,
        explanation,
        aiModel: "gemini-3.6-flash"
      });

    } catch (error: any) {
      console.error("Gemini Explain Concept Error:", error);
      return res.json({
        success: true,
        usingFallback: true,
        explanation: `مفهوم برمجي يعبر عن ${req.body.term || 'العنصر'} لتسريع بناء الواجهات بالـ Vibe Coding.`
      });
    }
  });

  // API Route: AI Support Chatbot for Debugging Preview Errors
  app.post("/api/support-chat", async (req, res) => {
    try {
      const { query, errorMessage, codeContext } = req.body;
      if (!query && !errorMessage) {
        return res.status(400).json({ error: "الرجاء إدخال الاستفسار أو رسالة الخطأ" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Smart Arabized fallback guidance based on error keywords
        let reply = "أهلاً بك! أنا مساعد الدعم الفوري للـ Vibe Coding. ";
        const textToAnalyze = `${query || ''} ${errorMessage || ''}`.toLowerCase();

        if (textToAnalyze.includes('syntax') || textToAnalyze.includes('unexpected token')) {
          reply += "يبدو أن هناك أسلوب كتابة غير مكتمل أو فاصلة مفقودة في الكود. نوصي بتجربة زر 'تحسين الوصف (Prompt Doctor)' لإعادة بناء الهيكل بشكل متناسق.";
        } else if (textToAnalyze.includes('undefined') || textToAnalyze.includes('null') || textToAnalyze.includes('cannot read property')) {
          reply += "هذا الخطأ يعني أن التطبيق يحاول قراءة متغير غير معروف أو لم يتم إعطاؤه قيمة أولية. أضف شرط تحقق للتأكد من وجود البيانات قبل عرضها.";
        } else if (textToAnalyze.includes('import') || textToAnalyze.includes('module not found')) {
          reply += "هذا يعني أن المكتبة المستوردة غير مثبتة أو هناك typo في اسم المكون. تأكد من استيراد الأيقونات من lucide-react بصورة صحيحة.";
        } else {
          reply += "لحل هذا الخطأ بأسلوب Vibe Coding: انقل رسالة الخطأ الظاهرة إلى مربع الوصف واطلب من الذكاء الاصطناعي: 'أصلح هذا الخطأ واجعل التطبيق يعمل بسلاسة'.";
        }

        return res.json({
          success: true,
          usingFallback: true,
          reply
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `أنت مساعد الدعم الفوري الخبير الذكي لم منصة 'ڤايب كود عربي' الموجهة لغير المبرمجين.
المستخدم يسأل عن خطأ أو استفسار في معاينة التطبيق.
استفسار المستخدم: "${query || 'كيف أصلح هذا الخطأ؟'}"
رسالة الخطأ الظاهرة: "${errorMessage || 'لا توجد رسالة خطأ صريحة'}"
سياق الكود: "${codeContext ? codeContext.substring(0, 300) : 'غير متوفر'}"

أجب بلغة عربية مشجعة وبسيطة جداً في 2-3 أسطر قصيرة، مع إعطاء خطوة عملية ومباشرة دون تعقيدات برمجية.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

      const reply = response.text || "نقترح إعادة صياغة الأمر وتوليد التطبيق مجدداً لتجاوز المشكلة.";

      return res.json({
        success: true,
        reply,
        aiModel: "gemini-3.6-flash"
      });

    } catch (error: any) {
      console.error("Gemini Support Chat Error:", error);
      return res.json({
        success: true,
        usingFallback: true,
        reply: "تحدث هذه المشكلة عادةً بسبب عدم اكتمال البيانات. جرب النقر على 'إعادة توليد الكود' في المحاكي."
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "ڤايب كود عربي" });
  });

  // Vite development middleware vs production static
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ڤايب كود عربي] Dev Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
