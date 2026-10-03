import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <aside aria-label="Thông báo hệ thống" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => onDismiss(toast.id)}
            className="pointer-events-auto cursor-pointer p-3.5 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-xl backdrop-blur-md border border-slate-700/50 dark:border-slate-200/50 flex items-center justify-between text-xs sm:text-sm font-semibold"
          >
            <span>{toast.text}</span>
            <span className="text-[10px] opacity-60 ml-2 font-normal">✕</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
};
