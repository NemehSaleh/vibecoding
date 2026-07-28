import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  X, 
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';

interface SupportMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isErrorExplanation?: boolean;
}

interface SupportChatPanelProps {
  currentError?: string | null;
  codeContext?: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyFixToPrompt?: (fixPrompt: string) => void;
}

export const SupportChatPanel: React.FC<SupportChatPanelProps> = ({
  currentError,
  codeContext,
  isOpen,
  onClose,
  onApplyFixToPrompt
}) => {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'أهلاً بك في بوت الدعم الفوري للمعاينة 🤖! إذا ظهرت أي رسالة خطأ أثناء تجربة التطبيق أو كان لديك أي استفسار، اسألني هنا وسأقدم لك حلاً مبسّطاً بأسلوب الـ Vibe Coding.',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || inputQuery;
    if (!queryText.trim() && !currentError) return;

    const userMsg: SupportMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText || 'كشف خطأ المعاينة وتحليله',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          errorMessage: currentError || '',
          codeContext: codeContext || ''
        })
      });

      const data = await res.json();
      const botReplyText = data.reply || 'تم تحليل المشكلة. يمكنك الطلب من المساعد إتاحة زر إصلاح تلقائي.';

      const botMsg: SupportMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        isErrorExplanation: !!currentError
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Support Chat Error:', err);
      const errorMsg: SupportMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'تأكد من الاتصال بالشبكة، أو جرب طلب إصلاح الخطأ المباشر بطلب: "أصلح خطأ التوليد وحدث العناصر".',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickErrorAnalyze = () => {
    if (!currentError) return;
    handleSendMessage(`حلل سبب هذا الخطأ: ${currentError}`);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-slate-900 border-r border-slate-800 text-slate-100 z-50 flex flex-col shadow-2xl animate-slideInLeft">
      
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm text-white">دردشة الدعم الفوري</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30 font-bold">
                مباشر ⚡
              </span>
            </div>
            <p className="text-[11px] text-slate-400">مساعدك الذكي لإصلاح أخطاء المعاينة الكودية</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          title="إغلاق الدردشة"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Preview Error Banner if present */}
      {currentError && (
        <div className="p-3 bg-rose-950/80 border-b border-rose-800/80 flex items-start justify-between gap-2 text-rose-200 text-xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-rose-300">تم اكتشاف خطأ في المعاينة:</span>
              <p className="font-mono text-[11px] opacity-90 line-clamp-2 mt-0.5">{currentError}</p>
            </div>
          </div>
          <button
            onClick={handleQuickErrorAnalyze}
            className="shrink-0 text-[10px] font-extrabold bg-rose-800 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg transition"
          >
            تشخيص الخطأ
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-900/60">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-purple-950 border border-purple-700 text-amber-300'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tl-none font-medium'
                : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tr-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              
              <div className="flex items-center justify-between text-[9px] opacity-60 mt-1.5 pt-1 border-t border-slate-700/40">
                <span>{msg.timestamp}</span>
                {msg.sender === 'bot' && (
                  <span className="flex items-center gap-1 font-bold text-indigo-300">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    Gemini AI
                  </span>
                )}
              </div>

              {msg.sender === 'bot' && msg.isErrorExplanation && onApplyFixToPrompt && (
                <button
                  onClick={() => onApplyFixToPrompt(`أصلح المشكلة التالية في الكود: ${currentError || 'خطأ المعاينة'}`)}
                  className="mt-2 w-full text-center text-[10px] font-bold bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/80 py-1.2 rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>تطبيق أمر الإصلاح في المحاكي</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-300 bg-slate-800/60 p-3 rounded-2xl w-max">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>جاري تحليل استفسارك بـ Gemini...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="اسأل عن الخطأ أو كيفية إضافة ميزة..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
