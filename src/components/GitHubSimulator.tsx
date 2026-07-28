import React, { useState } from 'react';
import { CodeSyntaxHighlighter } from './CodeSyntaxHighlighter';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  FileCode2, 
  FolderGit2, 
  Terminal, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Info,
  ExternalLink,
  ChevronLeft,
  ChevronDown,
  Layers,
  History,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommitItem {
  id: string;
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  codeSnapshot: {
    'index.html': string;
    'README.md': string;
    'metadata.json': string;
  };
}

interface GitHubSimulatorProps {
  currentAppCode?: string;
  onCommitSuccess?: (xpEarned: number) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const GitHubSimulator: React.FC<GitHubSimulatorProps> = ({
  currentAppCode = '',
  onCommitSuccess,
  showToast
}) => {
  // Initial Mock Commits Timeline
  const [commits, setCommits] = useState<CommitItem[]>([
    {
      id: 'c1',
      hash: '9a2f1e4',
      message: 'feat: الإصدار الأولي للتطبيق مع الهيكل الأساسي HTML/Tailwind',
      author: 'Vibe Coder 🤖',
      timestamp: 'منذ ساعتين',
      branch: 'main',
      filesChanged: 2,
      additions: 45,
      deletions: 0,
      codeSnapshot: {
        'index.html': '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <title>تطبيق Vibe المبدئي</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-slate-50 text-slate-900 p-8 text-center">\n  <h1 class="text-3xl font-black text-indigo-600">مرحباً بك في تطبيقي الأول! 🎉</h1>\n  <p class="mt-2 text-slate-600">تم بناء هذا الهيكل بواسطة Vibe Coding</p>\n</body>\n</html>',
        'README.md': '# مشروع Vibe App الأول 🚀\n\nتطبيق تفاعلي مبني بالكامل عبر التوجيه الذكي بدون كتابة كود يدوياً.',
        'metadata.json': '{\n  "name": "my-first-vibe-app",\n  "version": "1.0.0",\n  "framework": "Tailwind CSS + HTML5"\n}'
      }
    },
    {
      id: 'c2',
      hash: '4b7d8c3',
      message: 'style: تحسين التنسيقات وإضافة زوايا دائرية rounded-2xl ولون إينديجو',
      author: 'Vibe Coder 🤖',
      timestamp: 'منذ 45 دقيقة',
      branch: 'main',
      filesChanged: 1,
      additions: 18,
      deletions: 4,
      codeSnapshot: {
        'index.html': '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <title>تطبيق Vibe الأنيق</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-slate-900 text-white min-h-screen flex items-center justify-center p-6">\n  <div class="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full text-center space-y-4">\n    <h1 class="text-3xl font-black text-indigo-400">تطبيق Vibe العصري ✨</h1>\n    <p class="text-slate-300 text-sm">تم تطوير التنسيق وإضافة الألوان الفخمة</p>\n    <button class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white shadow-lg transition">تفاعل الآن</button>\n  </div>\n</body>\n</html>',
        'README.md': '# مشروع Vibe App الأول 🚀\n\nتطبيق تفاعلي مبني بالكامل عبر التوجيه الذكي.\n\n## التحديثات:\n- إضافة طابع داكن أنيق\n- تحسين خطوط العناوين والبطاقات',
        'metadata.json': '{\n  "name": "my-first-vibe-app",\n  "version": "1.1.0",\n  "framework": "Tailwind CSS + HTML5"\n}'
      }
    }
  ]);

  // Selected Active Commit for Inspection
  const [activeCommitId, setActiveCommitId] = useState<string>('c2');
  const [selectedFile, setSelectedFile] = useState<'index.html' | 'README.md' | 'metadata.json'>('index.html');

  // New Commit Inputs & Pushing Stepper State
  const [commitMessage, setCommitMessage] = useState<string>('feat: إضافة ميزة جديدة وتحديث واجهة المستخدم');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [pushStep, setPushStep] = useState<number>(0); // 0: Idle, 1: Staging, 2: Committing, 3: Pushing, 4: Deployed
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Active Commit Object
  const activeCommit = commits.find(c => c.id === activeCommitId) || commits[0];

  // Preset Commit Messages Shortcuts
  const presetMessages = [
    'feat: إضافة وضع القراءة الداكن (Dark Mode)',
    'fix: إصلاح معادلة حاسبة البيانات وتصحيح القيم',
    'style: تجديد ألوان الهيدر وإضافة حواف rounded-3xl',
    'docs: تحديث ملف README لشرح طريقة استخدام التطبيق'
  ];

  // Execute Simulated Git Push Sequence
  const handleExecutePush = () => {
    if (!commitMessage.trim()) {
      showToast('الرجاء كتابة رسالة Commit توضح التعديل!', 'info');
      return;
    }

    setIsPushing(true);
    setPushStep(1);
    setTerminalLogs([
      '$ git status',
      'On branch ' + selectedBranch,
      'Changes to be committed:',
      '  modified:   index.html',
      '  modified:   metadata.json'
    ]);

    // Step 1: Staging files
    setTimeout(() => {
      setPushStep(2);
      const newHash = Math.random().toString(36).substring(2, 9);
      setTerminalLogs(prev => [
        ...prev,
        '$ git add .',
        `$ git commit -m "${commitMessage}"`,
        `[${selectedBranch} ${newHash}] ${commitMessage}`,
        ' 2 files changed, 24 insertions(+), 6 deletions(-)'
      ]);

      // Step 2: Git Push to Remote Repository
      setTimeout(() => {
        setPushStep(3);
        setTerminalLogs(prev => [
          ...prev,
          `$ git push origin ${selectedBranch}`,
          'Enumerating objects: 5, done.',
          'Counting objects: 100% (5/5), done.',
          `Writing objects: 100% (3/3), ${Math.floor(Math.random() * 800 + 400)} bytes | 1.20 MiB/s, done.`,
          `Total 3 (delta 1), reused 0 (delta 0)`,
          `To https://github.com/vibe-user/my-vibe-app.git`,
          `   ${activeCommit.hash}..${newHash}  ${selectedBranch} -> ${selectedBranch}`
        ]);

        // Step 3: Automated Vercel / Cloud Run Deployment
        setTimeout(() => {
          setPushStep(4);
          const newCommitItem: CommitItem = {
            id: 'c_' + Date.now(),
            hash: newHash,
            message: commitMessage,
            author: 'أنت (Vibe Master 🎯)',
            timestamp: 'الآن',
            branch: selectedBranch,
            filesChanged: 2,
            additions: 24,
            deletions: 6,
            codeSnapshot: {
              'index.html': currentAppCode || activeCommit.codeSnapshot['index.html'],
              'README.md': `# مشروع Vibe App 🚀\n\nتطبيق تفاعلي منشور بنجاح على GitHub!\n\n## التحديث الأخير:\n- ${commitMessage}`,
              'metadata.json': `{\n  "name": "my-first-vibe-app",\n  "version": "1.2.0",\n  "lastCommit": "${newHash}"\n}`
            }
          };

          setCommits(prev => [newCommitItem, ...prev]);
          setActiveCommitId(newCommitItem.id);
          setIsPushing(false);
          setPushStep(0);

          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          showToast(`تم تنفيذ Git Push ونشر مشروعك على GitHub بنجاح! 🚀 (+50 XP)`, 'success');

          if (onCommitSuccess) onCommitSuccess(50);
        }, 1200);

      }, 1000);

    }, 800);
  };

  // Revert/Checkout past commit
  const handleCheckoutCommit = (commit: CommitItem) => {
    setActiveCommitId(commit.id);
    showToast(`تم التبديل لرؤية كود نقطة الحفظ Commit (${commit.hash}) ⏪`, 'info');
  };

  const copyHashToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    showToast(`تم نسخ رمز الـ Commit Hash (${hash}) لحافظتك! 📋`, 'info');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner / Intro Explainer */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 md:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>محاكي GitHub والتحكم بالنسخ Git Push</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">
              آلة الزمن وخزانة الأكواد السحابية ☁️
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              شاهد كيف تعمل أوامر <span className="text-emerald-400 font-mono">Git Commit</span> و <span className="text-indigo-400 font-mono">Git Push</span> خطوة بخطوة، وجرّب حفظ إصدارات تطبيقك والعودة إليها في أي وقت بضغط زر!
            </p>
          </div>

          {/* Repo Info Card */}
          <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700/80 min-w-[260px] space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>المستودع السحابي (Repo)</span>
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>متصل بـ GitHub</span>
              </span>
            </div>
            <div className="text-sm font-black text-white font-mono dir-ltr text-right">
              vibe-user / <span className="text-indigo-400">my-vibe-app</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/60 font-medium">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                <span>الفرع: <strong className="text-white">{selectedBranch}</strong></span>
              </span>
              <span>{commits.length} نقاط حفظ (Commits)</span>
            </div>
          </div>
        </div>

        {/* Simplified Visual Analogies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1">
            <span className="text-indigo-400 font-bold text-xs flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4" />
              <span>المستودع (Repository)</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-snug">
              الخزانة السحابية الذكية التي تجتمع فيها كل أجزاء مشروعك.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1">
            <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <GitCommit className="w-4 h-4" />
              <span>نقطة الحفظ (Commit)</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-snug">
              صورة لمرحلة معينة تقدر ترجع لها لو حصل خطأ.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1">
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>الرفع السحابي (Push)</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-snug">
              إرسال نقاط الحفظ لسحابة GitHub ليصبح مشروعك حياً!
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-1">
            <span className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" />
              <span>الفروع (Branches)</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-snug">
              مسارات تجارب جانبية تتيح لك تطوير ميزات دون خربطة النسخة الأساسية.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Push & Timeline Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN: Interactive Commit & Push Console (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200/90 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-indigo-600" />
                <span>إدراج Commit ورفعه Push</span>
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Git Engine Interactive
              </span>
            </div>

            {/* Branch Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اختر الفرع (Target Branch):
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['main', 'feature/new-ui'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBranch(b)}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-right flex items-center justify-between transition ${
                      selectedBranch === b
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 dir-ltr">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>{b}</span>
                    </span>
                    {selectedBranch === b && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Commit Message Preset Shortcuts */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                اقتراحات رسائل الحفظ (Commit Messages):
              </label>
              <div className="space-y-1.5">
                {presetMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCommitMessage(msg)}
                    className="w-full text-right p-2.5 bg-slate-50 hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-800 rounded-xl text-xs font-medium border border-slate-200/80 transition line-clamp-1 dir-ltr text-left"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Commit Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                نص رسالة الـ Commit:
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="مثال: feat: add new interactive button..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dir-ltr text-left"
              />
            </div>

            {/* Action Push Button */}
            <button
              onClick={handleExecutePush}
              disabled={isPushing}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-600/20 transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPushing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تنفيذ Push ونشر الكود...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-emerald-200" />
                  <span>تنفيذ Git Commit & Push الآن 🚀</span>
                </>
              )}
            </button>

            {/* Push Live Terminal Output Simulator */}
            {(isPushing || terminalLogs.length > 0) && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-800 text-[10px] font-sans">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-emerald-500" />
                    <span>محرر Git Bash التفاعلي</span>
                  </span>
                  <span>{pushStep === 4 ? 'تم النشر بنجاح ✅' : 'جاري التنفيذ...'}</span>
                </div>
                
                <div className="space-y-1">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className={log.startsWith('$') ? 'text-white font-bold' : log.includes('To https') ? 'text-indigo-300' : 'text-slate-400'}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* LEFT COLUMN: Commit Timeline History & File Explorer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Commit History Timeline Section */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900">سجل التغييرات ونقاط الحفظ (Commits History)</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {commits.length} نقاط حفظ مسجلة
              </span>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-3 relative before:absolute before:right-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {commits.map((commit, idx) => {
                const isActive = activeCommitId === commit.id;

                return (
                  <div 
                    key={commit.id} 
                    className={`relative pr-10 p-4 rounded-3xl border transition ${
                      isActive 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' 
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                    }`}
                  >
                    {/* Circle Node Icon on Timeline */}
                    <div className={`absolute right-4 top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transform translate-x-1/2 ${
                      isActive ? 'bg-indigo-500 border-white' : 'bg-white border-slate-400'
                    }`}>
                      {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                            isActive ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {commit.hash}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 border border-slate-200'
                          }`}>
                            {commit.branch}
                          </span>
                          <span className="text-[10px] opacity-70 font-medium">{commit.timestamp}</span>
                        </div>

                        <h4 className="font-bold text-xs leading-relaxed line-clamp-2 dir-ltr text-right">
                          {commit.message}
                        </h4>

                        <div className="flex items-center gap-3 text-[11px] opacity-80 pt-0.5">
                          <span>بواسطة: <strong>{commit.author}</strong></span>
                          <span className="text-emerald-400 font-mono font-bold">+{commit.additions}</span>
                          <span className="text-rose-400 font-mono font-bold">-{commit.deletions}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => copyHashToClipboard(commit.hash)}
                          className={`p-2 rounded-xl text-xs font-bold transition ${
                            isActive ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                          title="نسخ Hash"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleCheckoutCommit(commit)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isActive ? 'النسخة المعروضة' : 'استرجاع هذه النسخة'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Commit File Viewer */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                <h4 className="font-extrabold text-sm">محتويات الملفات لنقطة الحفظ ({activeCommit.hash})</h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Snapshot Preview</span>
            </div>

            {/* File Switcher Tabs */}
            <div className="flex space-x-2 space-x-reverse border-b border-slate-800 pb-2">
              {(['index.html', 'README.md', 'metadata.json'] as const).map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                    selectedFile === file
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            {/* File Content Output Box with Syntax Highlighting */}
            <CodeSyntaxHighlighter
              code={activeCommit.codeSnapshot[selectedFile]}
              fileName={selectedFile}
              maxHeight="320px"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
