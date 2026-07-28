import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-slate-900 border-emerald-500 text-white',
    error: 'bg-slate-900 border-rose-500 text-white',
    info: 'bg-slate-900 border-indigo-500 text-white',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-subtle">
      <div className={`flex items-center space-x-3 space-x-reverse px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md max-w-md ${bgStyles[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-sm font-bold leading-snug">{toast.text}</p>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition mr-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
