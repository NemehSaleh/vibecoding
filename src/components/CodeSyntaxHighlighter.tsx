import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Hash, 
  WrapText, 
  FileCode, 
  Palette, 
  Type, 
  Sliders, 
  Sun, 
  Moon, 
  RotateCcw,
  Eye,
  EyeOff,
  Terminal,
  Zap
} from 'lucide-react';

export type CodeTheme = 'vscode-dark' | 'github-dark' | 'monokai' | 'one-light';
export type CodeFontSize = 'xs' | 'sm' | 'base' | 'lg';
export type CodeFontFamily = 'fira' | 'jetbrains' | 'monaco';

interface CodeSyntaxHighlighterProps {
  code: string;
  language?: 'html' | 'json' | 'markdown' | 'javascript' | 'auto';
  fileName?: string;
  maxHeight?: string;
  showLineNumbersDefault?: boolean;
}

export const CodeSyntaxHighlighter: React.FC<CodeSyntaxHighlighterProps> = ({
  code = '',
  language = 'auto',
  fileName,
  maxHeight = '550px',
  showLineNumbersDefault = true
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(showLineNumbersDefault);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);

  // Typewriter Live Coding Effect State
  const [isTypewriterActive, setIsTypewriterActive] = useState<boolean>(true);
  const [displayedText, setDisplayedText] = useState<string>(code);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (!isTypewriterActive || !code) {
      setDisplayedText(code);
      setIsTyping(false);
      return;
    }

    // Trigger typewriter typing effect when code changes
    setIsTyping(true);
    let currentIdx = 0;
    const totalLen = code.length;
    // Calculate chunk size so typewriter completes within ~1.2s to 2s
    const chunkSize = Math.max(12, Math.ceil(totalLen / 50));

    const timer = setInterval(() => {
      currentIdx += chunkSize;
      if (currentIdx >= totalLen) {
        setDisplayedText(code);
        setIsTyping(false);
        clearInterval(timer);
      } else {
        setDisplayedText(code.slice(0, currentIdx));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [code, isTypewriterActive]);

  // Customization settings with LocalStorage persistence
  const [theme, setTheme] = useState<CodeTheme>(() => {
    return (safeGetItem('vibe_code_theme') as CodeTheme) || 'vscode-dark';
  });

  const [fontSize, setFontSize] = useState<CodeFontSize>(() => {
    return (safeGetItem('vibe_code_fontsize') as CodeFontSize) || 'sm';
  });

  const [fontFamily, setFontFamily] = useState<CodeFontFamily>(() => {
    return (safeGetItem('vibe_code_fontfamily') as CodeFontFamily) || 'fira';
  });

  // Save changes to localStorage
  useEffect(() => {
    safeSetItem('vibe_code_theme', theme);
  }, [theme]);

  useEffect(() => {
    safeSetItem('vibe_code_fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    safeSetItem('vibe_code_fontfamily', fontFamily);
  }, [fontFamily]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper function to detect language if auto
  const detectLanguage = (): 'html' | 'json' | 'markdown' | 'javascript' => {
    if (language !== 'auto') return language as 'html' | 'json' | 'markdown' | 'javascript';
    const trimmed = code.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
    if (trimmed.startsWith('#') || trimmed.includes('## ')) return 'markdown';
    if (trimmed.includes('<html') || trimmed.includes('<!DOCTYPE') || trimmed.includes('<div') || trimmed.includes('<script')) return 'html';
    return 'javascript';
  };

  const activeLang = detectLanguage();

  // Color mappings based on theme
  const getThemeStyles = () => {
    switch (theme) {
      case 'github-dark':
        return {
          container: 'bg-[#0d1117] text-[#c9d1d9] border-[#30363d]',
          header: 'bg-[#161b22] border-[#30363d] text-[#c9d1d9]',
          footer: 'bg-[#161b22]/90 border-[#30363d] text-[#8b949e]',
          lineNum: 'text-[#484f58] group-hover:text-[#8b949e]',
          rowHover: 'hover:bg-[#161b22]/60',
          comment: 'text-[#8b949e] italic',
          string: 'text-[#a5d6ff]',
          tag: 'text-[#7ee787] font-bold',
          bracket: 'text-[#8b949e]',
          attr: 'text-[#79c0ff]',
          keyword: 'text-[#ff7b72] font-bold',
          punc: 'text-[#d2a8ff]',
          defaultText: 'text-[#c9d1d9]',
          jsonKey: 'text-[#79c0ff] font-bold',
          jsonVal: 'text-[#a5d6ff]',
          badgeBg: 'bg-[#1f242c] text-[#79c0ff] border-[#30363d]'
        };
      case 'monokai':
        return {
          container: 'bg-[#1e1e1e] text-[#f8f8f2] border-[#333333]',
          header: 'bg-[#252526] border-[#333333] text-[#f8f8f2]',
          footer: 'bg-[#252526]/90 border-[#333333] text-[#888888]',
          lineNum: 'text-[#5c5c5c] group-hover:text-[#a6e22e]',
          rowHover: 'hover:bg-[#2d2d2d]',
          comment: 'text-[#75715e] italic',
          string: 'text-[#e6db74]',
          tag: 'text-[#f92672] font-bold',
          bracket: 'text-[#888888]',
          attr: 'text-[#a6e22e]',
          keyword: 'text-[#66d9ef] font-bold',
          punc: 'text-[#fd971f]',
          defaultText: 'text-[#f8f8f2]',
          jsonKey: 'text-[#66d9ef] font-bold',
          jsonVal: 'text-[#e6db74]',
          badgeBg: 'bg-[#2d2d2d] text-[#a6e22e] border-[#444444]'
        };
      case 'one-light':
        return {
          container: 'bg-slate-50 text-slate-800 border-slate-300',
          header: 'bg-slate-200/90 border-slate-300 text-slate-800',
          footer: 'bg-slate-200/80 border-slate-300 text-slate-600',
          lineNum: 'text-slate-400 group-hover:text-slate-700',
          rowHover: 'hover:bg-slate-200/50',
          comment: 'text-slate-400 italic',
          string: 'text-emerald-600',
          tag: 'text-blue-600 font-bold',
          bracket: 'text-slate-400',
          attr: 'text-amber-600',
          keyword: 'text-purple-600 font-bold',
          punc: 'text-slate-500',
          defaultText: 'text-slate-800',
          jsonKey: 'text-blue-600 font-bold',
          jsonVal: 'text-emerald-600',
          badgeBg: 'bg-white text-blue-700 border-slate-300'
        };
      case 'vscode-dark':
      default:
        return {
          container: 'bg-slate-950 text-slate-200 border-slate-800',
          header: 'bg-slate-900/90 border-slate-800 text-slate-300',
          footer: 'bg-slate-900/70 border-slate-800/80 text-slate-500',
          lineNum: 'text-slate-600 group-hover:text-slate-400',
          rowHover: 'hover:bg-slate-900/60',
          comment: 'text-slate-500 italic',
          string: 'text-emerald-300',
          tag: 'text-sky-400 font-bold',
          bracket: 'text-slate-500 font-bold',
          attr: 'text-amber-300',
          keyword: 'text-purple-400 font-bold',
          punc: 'text-slate-400 font-bold',
          defaultText: 'text-slate-200',
          jsonKey: 'text-cyan-300 font-bold',
          jsonVal: 'text-emerald-300',
          badgeBg: 'bg-indigo-950 text-indigo-300 border-indigo-800/80'
        };
    }
  };

  const style = getThemeStyles();

  // Font Size Class
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'xs': return 'text-[11px] leading-normal';
      case 'base': return 'text-sm leading-relaxed';
      case 'lg': return 'text-base leading-relaxed';
      case 'sm':
      default: return 'text-xs leading-relaxed';
    }
  };

  // Font Family Style
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case 'jetbrains':
        return { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };
      case 'monaco':
        return { fontFamily: "Monaco, Consolas, 'Courier New', monospace" };
      case 'fira':
      default:
        return { fontFamily: "'Fira Code', monospace" };
    }
  };

  // Highlight a single line of code
  const renderHighlightedLine = (line: string, lang: string): React.ReactNode => {
    if (!line) return <span>&nbsp;</span>;

    const trimmed = line.trim();
    if (trimmed.startsWith('<!--') || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
      return <span className={style.comment}>{line}</span>;
    }

    if (lang === 'json') {
      const parts = line.split(/("[\w-]+"\s*:)/g);
      return (
        <span>
          {parts.map((part, i) => {
            if (/^"[\w-]+"\s*:$/.test(part)) {
              return <span key={i} className={style.jsonKey}>{part}</span>;
            }
            if (part.includes('"')) {
              return <span key={i} className={style.jsonVal}>{part}</span>;
            }
            if (/\b(true|false|null|\d+)\b/.test(part)) {
              return <span key={i} className="text-rose-400 font-bold">{part}</span>;
            }
            return <span key={i} className={style.defaultText}>{part}</span>;
          })}
        </span>
      );
    }

    if (lang === 'markdown') {
      if (line.startsWith('#')) {
        return <span className="text-amber-400 font-bold">{line}</span>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <span className="text-indigo-400 font-medium">{line}</span>;
      }
      return <span className={style.defaultText}>{line}</span>;
    }

    // Tokenizer regex for HTML & JavaScript
    const regex = /(<!--[\s\S]*?-->|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[a-zA-Z0-9-]+|>|\b(?:class|id|href|src|type|style|lang|dir|value|placeholder|onClick|onChange|rel|target|name|content|charset|rows|cols|alt)\b(?=\=)|\b(?:function|const|let|var|return|if|else|import|export|from|async|await|true|false|null)\b|[{}()\[\]=;,])/g;

    const tokens: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      const matchText = match[0];
      const matchIdx = match.index;

      if (matchIdx > lastIdx) {
        tokens.push(
          <span key={`text-${lastIdx}`} className={style.defaultText}>
            {line.substring(lastIdx, matchIdx)}
          </span>
        );
      }

      if (matchText.startsWith('<!--')) {
        tokens.push(<span key={`comment-${matchIdx}`} className={style.comment}>{matchText}</span>);
      } else if (matchText.startsWith('"') || matchText.startsWith("'")) {
        tokens.push(<span key={`str-${matchIdx}`} className={style.string}>{matchText}</span>);
      } else if (matchText.startsWith('<') || matchText === '>') {
        if (matchText === '<' || matchText === '>' || matchText === '</') {
          tokens.push(<span key={`bracket-${matchIdx}`} className={style.bracket}>{matchText}</span>);
        } else {
          tokens.push(<span key={`tag-${matchIdx}`} className={style.tag}>{matchText}</span>);
        }
      } else if (['class', 'id', 'href', 'src', 'type', 'style', 'lang', 'dir', 'value', 'placeholder', 'onClick', 'onChange', 'rel', 'target', 'name', 'content', 'charset', 'rows', 'cols', 'alt'].includes(matchText)) {
        tokens.push(<span key={`attr-${matchIdx}`} className={style.attr}>{matchText}</span>);
      } else if (['function', 'const', 'let', 'var', 'return', 'if', 'else', 'import', 'export', 'from', 'async', 'await', 'true', 'false', 'null'].includes(matchText)) {
        tokens.push(<span key={`kw-${matchIdx}`} className={style.keyword}>{matchText}</span>);
      } else if (['{', '}', '(', ')', '[', ']', '=', ';', ','].includes(matchText)) {
        tokens.push(<span key={`punc-${matchIdx}`} className={style.punc}>{matchText}</span>);
      } else {
        tokens.push(<span key={`default-${matchIdx}`} className={style.defaultText}>{matchText}</span>);
      }

      lastIdx = regex.lastIndex;
    }

    if (lastIdx < line.length) {
      tokens.push(
        <span key={`text-${lastIdx}`} className={style.defaultText}>
          {line.substring(lastIdx)}
        </span>
      );
    }

    return tokens.length > 0 ? tokens : <span className={style.defaultText}>{line}</span>;
  };

  const lines = displayedText.split('\n');

  return (
    <div className={`rounded-2xl border shadow-inner overflow-hidden font-mono transition-colors duration-200 ${style.container}`}>
      
      {/* Code Header Control Bar */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between gap-2 font-sans transition-colors duration-200 ${style.header}`}>
        <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-y-1">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-xs">
            {fileName || (activeLang === 'html' ? 'index.html' : activeLang === 'json' ? 'metadata.json' : 'script.js')}
          </span>
          <span className={`text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-full border ${style.badgeBg}`}>
            {activeLang}
          </span>

          {/* Typing Indicator Badge */}
          {isTyping && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold animate-pulse flex items-center gap-1 shadow-xs">
              <Terminal className="w-3 h-3 text-amber-300" />
              <span>جاري كتابة الكود لحظياً... ⚡</span>
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-1.5 space-x-reverse text-xs">
          
          {/* Typewriter Mode Button */}
          <button
            onClick={() => {
              if (isTyping) {
                setDisplayedText(code);
                setIsTyping(false);
              } else {
                setIsTypewriterActive(prev => !prev);
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              isTyping
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                : isTypewriterActive
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
            title={isTyping ? "إكمال الكتابة فوراً (Fast Forward)" : "تفعيل/إلغاء تأثير الكتابة اللحظية (Typewriter)"}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold text-xs hidden sm:inline">
              {isTyping ? 'إكمال فوراً ⚡' : 'تأثير الكتابة ⌨️'}
            </span>
          </button>

          {/* Customization Settings Toggle */}
          <button
            onClick={() => setShowSettingsPanel(prev => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              showSettingsPanel
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="تخصيص مظهر المحاكي (الألوان والخطوط)"
          >
            <Palette className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="font-bold text-xs hidden sm:inline">تخصيص المظهر</span>
            <Sliders className="w-3 h-3 opacity-80" />
          </button>

          {/* Line Numbers Toggle */}
          <button
            onClick={() => setShowLineNumbers(prev => !prev)}
            className={`p-1.5 rounded-lg border transition ${
              showLineNumbers
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
            title="إظهار/إخفاء أرقام الأسطر"
          >
            <Hash className="w-3.5 h-3.5" />
          </button>

          {/* Word Wrap Toggle */}
          <button
            onClick={() => setWordWrap(prev => !prev)}
            className={`p-1.5 rounded-lg border transition ${
              wordWrap
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
            title="التفاف السطور Word Wrap"
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
          </button>
        </div>
      </div>

      {/* CUSTOMIZATION SETTINGS PANEL */}
      {showSettingsPanel && (
        <div className="bg-slate-900 border-b border-slate-800 p-4 space-y-4 text-xs font-sans animate-fadeIn text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span className="font-extrabold text-sm text-white">خيارات تخصيص واجهة الكود</span>
            </div>
            <button
              onClick={() => {
                setTheme('vscode-dark');
                setFontSize('sm');
                setFontFamily('fira');
                setShowLineNumbers(true);
                setWordWrap(true);
              }}
              className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة للوضع الافتراضي</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Theme Selector */}
            <div className="space-y-2">
              <label className="font-bold flex items-center gap-1.5 text-slate-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>سِمَة ألوان الكود (Theme):</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'vscode-dark', label: 'VS Code Dark 🌙', bg: 'bg-slate-950 text-white' },
                  { id: 'github-dark', label: 'GitHub Dark 🐙', bg: 'bg-[#0d1117] text-[#c9d1d9]' },
                  { id: 'monokai', label: 'Monokai Cyber ⚡', bg: 'bg-[#1e1e1e] text-[#f8f8f2]' },
                  { id: 'one-light', label: 'One Light ☀️', bg: 'bg-slate-100 text-slate-900' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as CodeTheme)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border text-right transition flex items-center justify-between ${item.bg} ${
                      theme === item.id
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {theme === item.id && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Font Size Selector */}
            <div className="space-y-2">
              <label className="font-bold flex items-center gap-1.5 text-slate-300">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                <span>حجم خط واجهة البرمجة:</span>
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'xs', label: 'صغير جداً', size: '11px' },
                  { id: 'sm', label: 'مناسب', size: '13px' },
                  { id: 'base', label: 'كبير', size: '15px' },
                  { id: 'lg', label: 'ضخم', size: '17px' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFontSize(item.id as CodeFontSize)}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition text-center ${
                      fontSize === item.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[9px] opacity-70">{item.size}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Font Family Selector */}
            <div className="space-y-2">
              <label className="font-bold flex items-center gap-1.5 text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>نوع الخط البرمجي:</span>
              </label>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'fira', name: 'Fira Code (مع اللمسات الحديثة)' },
                  { id: 'jetbrains', name: 'JetBrains Mono (المحاسبي الأنيق)' },
                  { id: 'monaco', name: 'Monaco / Console (الكلاسيكي)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFontFamily(item.id as CodeFontFamily)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border text-right transition flex items-center justify-between ${
                      fontFamily === item.id
                        ? 'bg-indigo-950 text-indigo-200 border-indigo-500/80'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.name}</span>
                    {fontFamily === item.id && <Check className="w-3 h-3 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Toggle Checkboxes Row */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-800/80 text-[11px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="font-semibold">إظهار أرقام الأسطر</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="font-semibold">التفاف الأسطر تلقائياً (Word Wrap)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLegend}
                onChange={(e) => setShowLegend(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="font-semibold">دليل ألوان التنسيق في الأسفل</span>
            </label>
          </div>
        </div>
      )}

      {/* Code Body Area */}
      <div 
        className={`p-4 overflow-auto dir-ltr text-left ${getFontSizeClass()}`}
        style={{ maxHeight }}
      >
        <table className="w-full border-collapse" style={getFontFamilyStyle()}>
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className={`transition group ${style.rowHover}`}>
                {showLineNumbers && (
                  <td className={`w-10 select-none text-right pr-4 font-mono text-[11px] align-top ${style.lineNum}`}>
                    {idx + 1}
                  </td>
                )}
                <td className={`align-top ${wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}`}>
                  {renderHighlightedLine(line, activeLang)}
                  {isTyping && idx === lines.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-0.5 align-middle shadow-md shadow-amber-500/50"></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info Legend */}
      {showLegend && (
        <div className={`px-4 py-1.5 border-t flex items-center justify-between text-[10px] font-sans transition-colors duration-200 ${style.footer}`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${theme === 'one-light' ? 'bg-blue-600' : 'bg-sky-400'}`}></span>
              <span>الوسوم Tags</span>
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${theme === 'one-light' ? 'bg-amber-600' : 'bg-amber-300'}`}></span>
              <span>الخصائص Attributes</span>
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${theme === 'one-light' ? 'bg-emerald-600' : 'bg-emerald-300'}`}></span>
              <span>النصوص Strings</span>
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${theme === 'one-light' ? 'bg-purple-600' : 'bg-purple-400'}`}></span>
              <span>الكلمات المفتاحية Keywords</span>
            </span>
          </div>
          <span className="font-mono">{lines.length} سطر برمجي</span>
        </div>
      )}

    </div>
  );
};

