import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { 
  getPresetSimulationCode, 
  READY_PROJECT_TEMPLATES, 
  ReadyProjectTemplate 
} from '../data/presetSimulations';
import { ChatMessage } from '../types';
import { GitHubSimulator } from './GitHubSimulator';
import { CodeSyntaxHighlighter } from './CodeSyntaxHighlighter';
import { VibeAssistantCard } from './VibeAssistantCard';
import { SmartConceptTooltip } from './SmartConceptTooltip';
import { SupportChatPanel } from './SupportChatPanel';
import { 
  Terminal, 
  Play, 
  Code, 
  Eye, 
  MessageSquare, 
  Bot,
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw, 
  RotateCw,
  History,
  Wand2, 
  Send,
  SlidersHorizontal,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  FolderGit2,
  GitCommit,
  LayoutTemplate,
  ChevronDown,
  ChevronUp,
  Layers,
  Download,
  FileArchive,
  FolderDown,
  Save,
  Trash2
} from 'lucide-react';

export interface CodeHistoryItem {
  prompt: string;
  code: string;
  tone: 'clean' | 'dark' | 'vibrant' | 'luxury';
  label: string;
  timestamp: string;
}

const SIMULATOR_STORAGE_KEY = 'vibe_coder_simulator_draft_v1';

interface SimulatorDraft {
  promptInput: string;
  generatedHtml: string;
  designTone: 'clean' | 'dark' | 'vibrant' | 'luxury';
  featureToggles: {
    darkModeToggle: boolean;
    counterStats: boolean;
    localPersistence: boolean;
  };
  history: CodeHistoryItem[];
  historyIndex: number;
  chatMessages: ChatMessage[];
  lastSavedAt: string;
}

const loadSimulatorDraft = (): SimulatorDraft | null => {
  try {
    const raw = localStorage.getItem(SIMULATOR_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse simulator draft:', err);
  }
  return null;
};

interface SimulatorSectionProps {
  initialPrompt?: string;
  onAppGenerated?: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  initialPrompt = '',
  onAppGenerated,
  showToast
}) => {
  // Load saved draft from LocalStorage on mount
  const savedDraftRef = useRef<SimulatorDraft | null>(null);
  if (savedDraftRef.current === null) {
    savedDraftRef.current = loadSimulatorDraft();
  }
  const draft = savedDraftRef.current;

  const [subMode, setSubMode] = useState<'ai_builder' | 'github_push'>('ai_builder');

  const [promptInput, setPromptInput] = useState<string>(() => {
    if (initialPrompt) return initialPrompt;
    return draft?.promptInput || 'ابنِ حاسبة سعرات حرارية وتغذية صحية تفاعلية بـ HTML و Tailwind CSS مع ألوان Indigo وحواف زوايا rounded-2xl.';
  });

  const [designTone, setDesignTone] = useState<'clean' | 'dark' | 'vibrant' | 'luxury'>(() => {
    return draft?.designTone || 'clean';
  });

  const [featureToggles, setFeatureToggles] = useState<{
    darkModeToggle: boolean;
    counterStats: boolean;
    localPersistence: boolean;
  }>(() => {
    return draft?.featureToggles || {
      darkModeToggle: true,
      counterStats: true,
      localPersistence: true
    };
  });

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'chat'>('preview');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [supportChatOpen, setSupportChatOpen] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // Ready Projects Section State
  const [showReadySection, setShowReadySection] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // Auto-Save Status Timestamp
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => draft?.lastSavedAt || null);

  // Generated Output HTML
  const [generatedHtml, setGeneratedHtml] = useState<string>(() => {
    if (initialPrompt && draft?.promptInput !== initialPrompt) {
      return getPresetSimulationCode(initialPrompt, 'clean');
    }
    return draft?.generatedHtml || getPresetSimulationCode(initialPrompt || 'حاسبة سعرات', 'clean');
  });

  // Undo / Redo History Stack
  const [history, setHistory] = useState<CodeHistoryItem[]>(() => {
    if (draft?.history && draft.history.length > 0) return draft.history;
    const initCode = getPresetSimulationCode(initialPrompt || 'حاسبة سعرات', 'clean');
    const initPrompt = initialPrompt || 'ابنِ حاسبة سعرات حرارية وتغذية صحية تفاعلية بـ HTML و Tailwind CSS مع ألوان Indigo وحواف زوايا rounded-2xl.';
    return [{
      prompt: initPrompt,
      code: initCode,
      tone: 'clean',
      label: 'الإصدار الأول (الأصلي)',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }];
  });
  const [historyIndex, setHistoryIndex] = useState<number>(() => draft?.historyIndex ?? 0);

  // Chat Follow-up Timeline
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return draft?.chatMessages || [
      {
        id: '1',
        sender: 'assistant',
        text: 'مرحباً بك في محاكي الـ Vibe Coding! صغ طلبك أو اختر أحد النماذج، وسأقوم بتبسيط وبناء التطبيق لك مباشرة.',
        timestamp: 'الآن'
      }
    ];
  });
  const [chatInput, setChatInput] = useState<string>('');

  // Auto-save draft to LocalStorage whenever key states change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const timeStr = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        const draftObj: SimulatorDraft = {
          promptInput,
          generatedHtml,
          designTone,
          featureToggles,
          history,
          historyIndex,
          chatMessages,
          lastSavedAt: timeStr
        };
        localStorage.setItem(SIMULATOR_STORAGE_KEY, JSON.stringify(draftObj));
        setLastSavedTime(timeStr);
      } catch (err) {
        console.error('Failed to auto-save simulator draft:', err);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [promptInput, generatedHtml, designTone, featureToggles, history, historyIndex, chatMessages]);

  // Handle explicit new initialPrompt passed from props
  useEffect(() => {
    if (initialPrompt && initialPrompt !== promptInput) {
      setPromptInput(initialPrompt);
      const newCode = getPresetSimulationCode(initialPrompt, designTone);
      setGeneratedHtml(newCode);
      pushHistoryItem(newCode, initialPrompt, designTone, `تحميل: ${initialPrompt.slice(0, 20)}...`);
    }
  }, [initialPrompt]);

  // Clear Saved Draft Action
  const handleClearDraft = () => {
    try {
      localStorage.removeItem(SIMULATOR_STORAGE_KEY);
      const defaultPrompt = 'ابنِ حاسبة سعرات حرارية وتغذية صحية تفاعلية بـ HTML و Tailwind CSS مع ألوان Indigo وحواف زوايا rounded-2xl.';
      const defaultCode = getPresetSimulationCode('حاسبة سعرات', 'clean');
      
      setPromptInput(defaultPrompt);
      setGeneratedHtml(defaultCode);
      setDesignTone('clean');
      setHistory([{
        prompt: defaultPrompt,
        code: defaultCode,
        tone: 'clean',
        label: 'الإصدار الأول (الأصلي)',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }]);
      setHistoryIndex(0);
      setLastSavedTime(null);
      showToast('تم مسح المسودة وإعادة ضبط المحاكي للحالة الأولية 🔄', 'info');
    } catch (err) {
      console.error('Error clearing simulator draft:', err);
    }
  };

  // Helper to push new version to history
  const pushHistoryItem = (
    newCode: string,
    newPrompt: string,
    newTone: 'clean' | 'dark' | 'vibrant' | 'luxury',
    label: string
  ) => {
    const newItem: CodeHistoryItem = {
      prompt: newPrompt,
      code: newCode,
      tone: newTone,
      label,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, newItem];
    });
    setHistoryIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const target = history[prevIdx];
      setHistoryIndex(prevIdx);
      setGeneratedHtml(target.code);
      setPromptInput(target.prompt);
      setDesignTone(target.tone);
      showToast(`تم التراجع إلى [${target.label}] ↩️`, 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const target = history[nextIdx];
      setHistoryIndex(nextIdx);
      setGeneratedHtml(target.code);
      setPromptInput(target.prompt);
      setDesignTone(target.tone);
      showToast(`تم الإعادة إلى [${target.label}] ↪️`, 'info');
    }
  };

  const handleSelectReadyTemplate = (tpl: ReadyProjectTemplate) => {
    setPromptInput(tpl.prompt);
    setDesignTone(tpl.tone);
    const code = getPresetSimulationCode(tpl.prompt, tpl.tone);
    setGeneratedHtml(code);
    pushHistoryItem(code, tpl.prompt, tpl.tone, `قالب: ${tpl.title}`);
    setActiveTab('preview');
    showToast(`تم تحميل قالب "${tpl.title}" وتوليد كود التطبيق فوراً! 🚀`, 'success');
    if (onAppGenerated) onAppGenerated();
  };

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update iframe when code changes
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generatedHtml);
        doc.close();
      }
    }
  }, [generatedHtml, activeTab, viewMode]);

  // Handle Generate App
  const handleGenerateApp = async () => {
    if (!promptInput.trim()) {
      showToast('الرجاء كتابة وصف الفكرة (Prompt) قبل التوليد!', 'info');
      return;
    }

    setIsGenerating(true);
    showToast('جاري تحويل الفكرة لكود تفاعلي عبر Gemini...', 'info');

    try {
      // Call backend API if running, or use preset fallback
      const response = await fetch('/api/generate-vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          tone: designTone,
          features: featureToggles
        })
      });

      const data = await response.json();

      let newCode = '';
      if (data && data.success && data.code) {
        newCode = data.code;
        setGeneratedHtml(newCode);
        showToast('تم توليد التطبيق بنجاح بواسطة Gemini AI! 🚀', 'success');
      } else {
        // Use smart local preset fallback
        newCode = getPresetSimulationCode(promptInput, designTone);
        setGeneratedHtml(newCode);
        showToast('تم التوليد بنجاح عبر المحاكي الذكي ✨', 'success');
      }

      pushHistoryItem(newCode, promptInput, designTone, `توليد: ${promptInput.slice(0, 25)}...`);

      if (onAppGenerated) onAppGenerated();

      // Add to Chat Timeline
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'user',
          text: `توليد تطبيق جديد: "${promptInput.slice(0, 60)}..."`,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'تم بناء الواجهة المكونة من أحدث تنسيقات Tailwind CSS وJavaScript التفاعلي! يمكنك التجربة الآن في المعاينة الحية.',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          isCodeUpdate: true
        }
      ]);

    } catch (err) {
      // Fallback
      const presetCode = getPresetSimulationCode(promptInput, designTone);
      setGeneratedHtml(presetCode);
      pushHistoryItem(presetCode, promptInput, designTone, `توليد: ${promptInput.slice(0, 25)}...`);
      showToast('تم المعالجة والتوليد المباشر بالمحاكي! ✨', 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopiedCode(true);
    showToast('تم نسخ كود HTML/Tailwind بالكامل لحافظتك! 📋', 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Handle Download Project as ZIP Archive
  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      showToast('جاري ضغط ملفات الكود والتعليمات البرمجية...', 'info');

      const zip = new JSZip();

      // 1. Primary HTML file
      zip.file('index.html', generatedHtml);

      // 2. Comprehensive README.md
      const appTitle = promptInput.slice(0, 30).trim() || 'تطبيق Vibe Coding';
      const readmeContent = `# ⚡ ${appTitle}

تم توليد هذا المشروع بالكامل باستخدام **منصة Vibe Coding بالعربي** 🚀.

---

## 📂 محتويات مجلد المشروع:
- 📄 \`index.html\`: ملف الواجهة والتفاعلات المكتوبة بـ HTML5 + Tailwind CSS + JavaScript.
- 📝 \`README.md\`: دليل تشغيل المشروع المحلي.
- 📦 \`package.json\`: حزمة المشروع الجاهزة لتشغيل سيرفر محلي بنقرة واحدة.

---

## 🚀 كيفية تشغيل المشروع على جهازك المحلي:

### 1️⃣ الطريقة المباشرة (فتح فوري دون أدوات):
اضغط مرتين (Double Click) على ملف \`index.html\` لفتحه مباشرة في أي متصفح لديك (Chrome, Edge, Safari, Firefox).

### 2️⃣ عبر برنامج Visual Studio Code (Live Server):
1. افتح مجلد المشروع داخل **VS Code**.
2. ثبّت إضافة **Live Server**.
3. انقر بزر الفأرة الأيمن على \`index.html\` واختر **Open with Live Server**.

### 3️⃣ عبر سطر الأوامر (Terminal):
\`\`\`bash
# تشغيل خادم ويب محلي فوري
npx serve .
\`\`\`

---

## 🛠 التقنيات المستخدمة:
- **HTML5 & Modern CSS**
- **Tailwind CSS Utility Engine**
- **Vanilla JavaScript Interactive Functions**
- **دعم الاتجاه العربي RTL بالكامل**

---
صُنِع بشغف عبر **منصة Vibe Coding بالعربي** ❤️
`;

      zip.file('README.md', readmeContent);

      // 3. package.json for standard Node/serve setup
      const packageContent = JSON.stringify({
        name: 'vibe-app-project',
        version: '1.0.0',
        private: true,
        description: promptInput || 'Generated with Arabic Vibe Coding Platform',
        main: 'index.html',
        scripts: {
          'start': 'npx serve .'
        },
        keywords: ['vibe-coding', 'html5', 'tailwind-css', 'arabic-vibe-code']
      }, null, 2);

      zip.file('package.json', packageContent);

      // Generate the ZIP blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Trigger client browser file download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      
      const safePromptName = promptInput
        .trim()
        .slice(0, 20)
        .replace(/[^\w\u0600-\u06FF]/g, '_') || 'vibe_project';
        
      link.download = `${safePromptName}_project.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('تم تحميل كود المشروع كاملاً كملف مضغوط (.zip) بنجاح! 📦', 'success');
    } catch (err) {
      console.error('Error generating ZIP archive:', err);
      showToast('حدث خطأ أثناء إعداد ملفات الـ ZIP', 'error');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Quick Prompt Preset Loaders
  const quickPresets = [
    { title: 'حاسبة سعرات', text: 'ابنِ حاسبة سعرات حرارية وتغذية صحية تفاعلية بـ HTML و Tailwind CSS مع ألوان Indigo وحواف rounded-2xl.' },
    { title: 'متجر بطاقات', text: 'اصنع واجهة متجر إلكتروني مصغر للبطاقات الرقمية مع سلة تسوق حية وحساب الإجمالي.' },
    { title: 'منظم مهام', text: 'أنشئ تطبيق قائمة مهام تفاعلية To-Do List مع شطب المهام ونسبة الإنجاز وحذف العناصر.' },
    { title: 'بطاقة تهنئة', text: 'صمم صانع بطاقات تهنئة وتخصيص الاسم للمناسبات السعيدة.' }
  ];

  // Send Follow-up Chat Amendment
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput('');

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Simulate AI tweaking code
    setTimeout(() => {
      let updatedCode = generatedHtml;

      if (userText.includes('أزرق') || userText.includes('ازرق')) {
        updatedCode = updatedCode.replaceAll('indigo', 'blue').replaceAll('emerald', 'blue');
      } else if (userText.includes('داكن') || userText.includes('سوداء')) {
        updatedCode = updatedCode.replaceAll('bg-slate-50', 'bg-slate-900').replaceAll('bg-white', 'bg-slate-800').replaceAll('text-slate-900', 'text-white');
      } else if (userText.includes('عنوان') || userText.includes('اسم')) {
        updatedCode = updatedCode.replace(/<h1[^>]*>(.*?)<\/h1>/i, `<h1 class="text-2xl font-black">${userText}</h1>`);
      }

      setGeneratedHtml(updatedCode);
      pushHistoryItem(updatedCode, promptInput, designTone, `تعديل بالمحادثة: ${userText.slice(0, 20)}...`);

      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `تم استلام تعديلك: "${userText}". قمت بتحديث الكود والمعاينة الحية فوراً! 🎨`,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          isCodeUpdate: true
        }
      ]);

      showToast('تم تطبيق التعديل على المعاينة الحية! ✨', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title Header with Mode Switcher */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 md:p-8 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>المحاكي التفاعلي Vibe Simulator</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">
              منطقة الهندسة والمحاكاة المباشرة ⚡
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              جرب توليد التطبيقات بـ Gemini AI أو اختبر رفع الكود والتحكم بالنسخ عبر محاكي GitHub!
            </p>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-2">
            {lastSavedTime && (
              <span className="px-3.5 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <Save className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>محفوظ تلقائياً ({lastSavedTime})</span>
              </span>
            )}
            {subMode === 'ai_builder' && (
              <>
                <button
                  onClick={handleClearDraft}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950/70 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  title="مسح المسودة من LocalStorage وتصفيرها"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>مسح المسودة</span>
                </button>
                <button
                  onClick={() => setPromptInput('')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700/80"
                  title="تفريغ مربع النص فقط"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تفريغ المربع</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sub-Mode Switcher Pills */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => setSubMode('ai_builder')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
              subMode === 'ai_builder'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>محاكي التوليد الذكي (Gemini AI Builder)</span>
          </button>

          <button
            onClick={() => setSubMode('github_push')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
              subMode === 'github_push'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-emerald-300" />
            <span>محاكي GitHub والتحكم بالنسخ (Git Push)</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-400/30 font-extrabold">جديد 🔥</span>
          </button>
        </div>
      </div>

      {/* Render Sub-Mode: GitHub Simulator or AI Builder */}
      {subMode === 'github_push' ? (
        <GitHubSimulator
          currentAppCode={generatedHtml}
          onCommitSuccess={() => onAppGenerated && onAppGenerated()}
          showToast={showToast}
        />
      ) : (
        <div className="space-y-6">
          {/* SUBSECTION: Ready-to-edit Projects (مشاريع جاهزة للتعديل) */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                  🚀
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">مشاريع جاهزة للتعديل</h3>
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      قوالب تفاعلية 🔥
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    اختر قالباً جاهزاً لسحب الـ Prompt واستكشاف كوده وتعديله فوراً داخل المحاكي
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReadySection(!showReadySection)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700/80 shrink-0"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showReadySection ? 'طي القوالب' : 'عرض القوالب الجاهزة'}</span>
                {showReadySection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showReadySection && (
              <div className="space-y-4 pt-1 animate-fadeIn">
                {/* Category Pills Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 ml-1">التصنيف:</span>
                  {['الكل', 'تسويق ومبيعات', 'إنتاجية', 'أدوات وصحة', 'تجارة إلكترونية', 'ذكاء اصطناعي', 'شخصي وبورتفوليو'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of Ready Templates */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {READY_PROJECT_TEMPLATES.filter(tpl => selectedCategory === 'الكل' || tpl.category === selectedCategory).map((tpl) => (
                    <div
                      key={tpl.id}
                      className="bg-slate-900/90 hover:bg-slate-800/90 rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/60 transition group flex flex-col justify-between shadow-lg relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700/80 group-hover:scale-110 transition transform">
                            {tpl.icon}
                          </span>
                          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 rounded-full">
                            {tpl.badge}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition">
                            {tpl.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                            {tpl.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tpl.tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-semibold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleSelectReadyTemplate(tpl)}
                          className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transform active:scale-95"
                        >
                          <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                          <span>سحب وتعديل الـ Prompt ⚡</span>
                        </button>

                        <button
                          onClick={() => {
                            setPromptInput(tpl.prompt);
                            showToast('تم نسخ الـ Prompt المخصص للنموذج بنجاح!', 'info');
                          }}
                          title="نسخ الـ Prompt للـ Console"
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700/80 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Split Screen Container for AI Builder */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* RIGHT PANEL: Prompt Input Console (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-indigo-600" />
              <span>مدخلات الـ Vibe Prompt</span>
            </h3>
            <div className="flex items-center gap-2">
              {lastSavedTime && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1 shadow-2xs" title="يتم حفظ جميع المدخلات والكود تلقائياً في المتصفح">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>حفظ تلقائي {lastSavedTime}</span>
                </span>
              )}
              <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Gemini 2.5 Engine</span>
            </div>
          </div>

          {/* Smart AI Concept Tooltips Bar */}
          <div className="p-3.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 rounded-2xl border border-indigo-800/80 text-white space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>تلميحات ذكية للمفاهيم (Smart Tooltips)</span>
              </div>
              <span className="text-[10px] text-indigo-300/80 font-bold bg-indigo-900/50 px-2 py-0.5 rounded-full border border-indigo-700/50">
                مرر الماوس للتوضيح بـ Gemini
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <SmartConceptTooltip term="C-A-R-T" label="قاعدة C-A-R-T" badgeText="شديد الأهمية" />
              <SmartConceptTooltip term="Prompt Doctor" label="Prompt Doctor" />
              <SmartConceptTooltip term="Tailwind CSS" label="Tailwind CSS" />
              <SmartConceptTooltip term="API Key" label="API Key" />
              <SmartConceptTooltip term="RTL Support" label="اتجاه RTL" />
              <SmartConceptTooltip term="Iframe Sandbox" label="Iframe Sandbox" />
              <SmartConceptTooltip term="State" label="إدارة الـ State" />
              <SmartConceptTooltip term="Git Commit" label="Git Commit" />
            </div>
          </div>

          {/* Quick Preset Selector Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              اختر نموذجاً سريعاً للبدء:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPromptInput(p.text)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-xs font-semibold transition border border-slate-200/80"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              وصف التطبيق بكلماتك البسيطة:
            </label>
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={5}
              placeholder="مثال: ابنِ لي حاسبة سعرات حرارية تفاعلية بملف HTML كامل مع ألوان زاهية وأزرار لحساب الاحتياج اليومي..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition leading-relaxed"
            />
          </div>

          {/* Vibe Assistant Doctor Card */}
          <VibeAssistantCard
            prompt={promptInput}
            onUpdatePrompt={(newPrompt) => setPromptInput(newPrompt)}
            designTone={designTone}
          />

          {/* Customization Controls Accordion */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>تخصيص الطابع والمميزات:</span>
            </div>

            {/* Design Tone */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">نبرة وطابع التصميم (Design Vibe):</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'clean', label: 'ساطع وأنيق ☀️' },
                  { id: 'dark', label: 'داكن وعصري 🌙' },
                  { id: 'vibrant', label: 'زاهي ومرح 🎨' },
                  { id: 'luxury', label: 'فخم وراقٍ ✨' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setDesignTone(tone.id as any)}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition ${
                      designTone === tone.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Checkbox Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
              <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={featureToggles.darkModeToggle}
                  onChange={(e) => setFeatureToggles(p => ({ ...p, darkModeToggle: e.target.checked }))}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>تضمين زر تحويل المظهر (Dark/Light Mode)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={featureToggles.localPersistence}
                  onChange={(e) => setFeatureToggles(p => ({ ...p, localPersistence: e.target.checked }))}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>دعم الحفظ التلقائي في LocalStorage</span>
              </label>
            </div>
          </div>

          {/* Undo / Redo Version Navigation Control */}
          <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>سجل التغييرات والتراجع:</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-800/80">
                إصدار {historyIndex + 1} من {history.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  historyIndex > 0
                    ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700 active:scale-95 shadow-sm cursor-pointer'
                    : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-60'
                }`}
                title="تراجع عن آخر تعديل (Undo)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تراجع (Undo)</span>
              </button>

              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  historyIndex < history.length - 1
                    ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700 active:scale-95 shadow-sm cursor-pointer'
                    : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-60'
                }`}
                title="إعادة التعديل السابق (Redo)"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>إعادة (Redo)</span>
              </button>
            </div>

            {/* Current version label snippet */}
            <div className="text-[11px] text-slate-400 truncate bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <span className="truncate">📌 {history[historyIndex]?.label || 'الإصدار الحالي'}</span>
              <span className="text-[10px] text-slate-500 font-mono shrink-0 pr-2">{history[historyIndex]?.timestamp}</span>
            </div>
          </div>

          {/* Generate Main Button */}
          <button
            onClick={handleGenerateApp}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition transform active:scale-95 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري معالجة الفكرة بـ Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>توليد التطبيق بالـ Vibe Coding ⚡</span>
              </>
            )}
          </button>

        </div>

        {/* LEFT PANEL: Workspace Preview & Code Console (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Workspace Tabs Header Bar */}
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2">
            
            {/* Tabs */}
            <div className="flex space-x-1 space-x-reverse">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>المعاينة الحية</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  activeTab === 'code'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>كود الـ HTML/Tailwind</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition relative ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>المساعد الذكي</span>
                {chatMessages.length > 1 && (
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                )}
              </button>

              {/* Instant Support Chat Button */}
              <button
                onClick={() => setSupportChatOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm border border-purple-400/40"
                title="افتح دردشة الدعم الفوري لإصلاح أخطاء المعاينة بـ Gemini"
              >
                <Bot className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>دردشة الدعم الفوري ⚡</span>
              </button>
            </div>

            {/* Desktop / Tablet / Mobile View Mode Selector & Action Buttons */}
            <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-y-2">
              
              {/* Undo / Redo Quick Header Toolbar */}
              <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 gap-1">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    historyIndex > 0
                      ? 'text-indigo-300 hover:bg-slate-800 hover:text-white cursor-pointer'
                      : 'text-slate-600 cursor-not-allowed opacity-60'
                  }`}
                  title="تراجع (Undo)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">تراجع</span>
                </button>

                <span className="text-slate-800 font-extralight text-xs">|</span>

                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    historyIndex < history.length - 1
                      ? 'text-indigo-300 hover:bg-slate-800 hover:text-white cursor-pointer'
                      : 'text-slate-600 cursor-not-allowed opacity-60'
                  }`}
                  title="إعادة (Redo)"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">إعادة</span>
                </button>
              </div>

              {activeTab === 'preview' && (
                <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      viewMode === 'desktop'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="معاينة شاشة حاسوب Desktop"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>حاسوب</span>
                  </button>

                  <button
                    onClick={() => setViewMode('tablet')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      viewMode === 'tablet'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="معاينة شاشة تابلت Tablet (768px)"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>تابلت</span>
                  </button>

                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      viewMode === 'mobile'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="معاينة شاشة جوال Mobile (375px)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>جوال</span>
                  </button>
                </div>
              )}

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>

              <button
                onClick={handleDownloadZip}
                disabled={isDownloadingZip}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/50 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/30 active:scale-95 disabled:opacity-50"
                title="تحميل كود المشروع كاملاً كملف مضغوط (.zip) للتشغيل المحلي"
              >
                {isDownloadingZip ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FolderDown className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>تحميل المشروع (.ZIP) 📦</span>
              </button>
            </div>

          </div>

          {/* TAB 1: Live Interactive Frame Preview with Responsive Device Mockups */}
          {activeTab === 'preview' && (
            <div className="flex-1 bg-slate-950 p-4 md:p-6 flex items-center justify-center overflow-auto dir-ltr">
              <div 
                className={`transition-all duration-300 relative flex flex-col bg-slate-900 border shadow-2xl ${
                  viewMode === 'mobile'
                    ? 'w-full max-w-[380px] h-[660px] rounded-[3rem] border-[10px] border-slate-800 shadow-indigo-500/10'
                    : viewMode === 'tablet'
                    ? 'w-full max-w-[768px] h-[640px] rounded-[2rem] border-[10px] border-slate-800 shadow-xl'
                    : 'w-full h-[620px] rounded-2xl border-slate-800 shadow-2xl'
                }`}
              >
                {/* Device Frame Top Bar / Browser Notch */}
                {viewMode === 'mobile' ? (
                  <div className="bg-slate-900 pt-2 pb-1.5 px-6 flex items-center justify-between rounded-t-[2.2rem] shrink-0 border-b border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold font-mono">9:41</span>
                    {/* iPhone Dynamic Island / Notch */}
                    <div className="w-20 h-3.5 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 px-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/80"></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">100% 🔋</span>
                  </div>
                ) : viewMode === 'tablet' ? (
                  <div className="bg-slate-900 py-2 px-4 flex items-center justify-center rounded-t-[1.5rem] shrink-0 border-b border-slate-800">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
                  </div>
                ) : (
                  /* Desktop Browser Top Address Bar */
                  <div className="bg-slate-900 px-4 py-2 flex items-center justify-between rounded-t-2xl shrink-0 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                    </div>
                    
                    <div className="bg-slate-950 px-4 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2 max-w-sm w-full justify-center">
                      <span className="text-emerald-400 font-bold">🔒 https://</span>
                      <span className="text-slate-300">vibe-app-preview.local</span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">
                      Desktop View
                    </span>
                  </div>
                )}

                {/* Live iFrame Content */}
                <div className="flex-1 w-full h-full overflow-hidden bg-white relative">
                  <iframe
                    ref={iframeRef}
                    title="Vibe App Live Preview"
                    className="w-full h-full bg-white border-0"
                    sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                  />
                </div>

                {/* Mobile Bottom Home Bar Indicator */}
                {viewMode === 'mobile' && (
                  <div className="bg-slate-900 py-1.5 flex items-center justify-center rounded-b-[2.2rem] shrink-0">
                    <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Syntax Highlighted Code Viewer */}
          {activeTab === 'code' && (
            <div className="flex-1 bg-slate-950 p-4 overflow-auto space-y-3">
              
              {/* Export Bundle Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <FileArchive className="w-4 h-4 text-emerald-400" />
                  <span>تصدير حزمة كود المشروع المكتمل (Export Project Bundle)</span>
                </div>
                <button
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل كود المشروع (.ZIP) 📦</span>
                </button>
              </div>

              <CodeSyntaxHighlighter
                code={generatedHtml}
                language="html"
                fileName="index.html"
                maxHeight="470px"
              />
            </div>
          )}

          {/* TAB 3: Interactive Follow-up Chat Console */}
          {activeTab === 'chat' && (
            <div className="flex-1 bg-slate-950 flex flex-col justify-between p-4 h-[580px]">
              
              {/* Chat Timeline */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-sans leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tl-none shadow-md'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tr-none'
                    }`}>
                      <p>{msg.text}</p>
                      <span className="text-[10px] opacity-60 block text-left mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Amendment Input */}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="اكتب تعديلاً لمساعد Vibe (مثال: اجعل الأزرار باللون الأزرق)..."
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
      </div>
      )}

      {/* Instant Support Chat Panel for Debugging Preview Errors */}
      <SupportChatPanel
        isOpen={supportChatOpen}
        onClose={() => setSupportChatOpen(false)}
        currentError={previewError}
        codeContext={generatedHtml}
        onApplyFixToPrompt={(fixPrompt) => {
          setPromptInput(fixPrompt);
          setSupportChatOpen(false);
          showToast('تم إدراج أمر الإصلاح في مربع الوصف! اضغط "توليد التطبيق" لتطبيقه ⚡', 'info');
        }}
      />

    </div>
  );
};
