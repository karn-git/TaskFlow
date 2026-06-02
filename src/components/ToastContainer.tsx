import React from 'react';
import { useTaskFlow } from '../context/TaskFlowContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useTaskFlow();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
  };

  const bgClasses = {
    success: 'border-emerald-100 bg-emerald-50/90 dark:bg-emerald-950/30 dark:border-emerald-900/50',
    info: 'border-sky-100 bg-sky-50/90 dark:bg-sky-950/30 dark:border-sky-900/50',
    error: 'border-rose-100 bg-rose-50/90 dark:bg-rose-950/30 dark:border-rose-900/50',
  };

  return (
    <div id="toast-wrapper" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full font-sans">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={`toast-${toast.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className={`flex items-center justify-between p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all ${bgClasses[toast.type]}`}
          >
            <div className="flex gap-3">
              <span className="shrink-0">{icons[toast.type]}</span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{toast.message}</p>
            </div>
            <button
              id={`dismiss-toast-${toast.id}`}
              onClick={() => dismissToast(toast.id)}
              className="ml-4 p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
