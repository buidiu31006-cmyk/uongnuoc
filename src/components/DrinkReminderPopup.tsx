import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Clock, X, Check } from 'lucide-react';

interface DrinkReminderPopupProps {
  isOpen: boolean;
  onDrinkNow: (amount: number) => void;
  onPostpone: () => void;
}

export const DrinkReminderPopup: React.FC<DrinkReminderPopupProps> = ({
  isOpen,
  onDrinkNow,
  onPostpone,
}) => {
  const [showAmountChoices, setShowAmountChoices] = useState(false);

  if (!isOpen) return null;

  const handleSelectAmount = (amount: number) => {
    onDrinkNow(amount);
    setShowAmountChoices(false);
  };

  const handleClose = () => {
    setShowAmountChoices(false);
    onPostpone();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-800 shadow-2xl p-6 text-center text-slate-800 dark:text-slate-100"
        >
          {/* Close / Dismiss */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Water Droplet Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white mx-auto mb-3.5 shadow-lg shadow-cyan-500/30 animate-gentle-pulse">
            <Droplets className="w-7 h-7 fill-white/20" />
          </div>

          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
            <span>💧 Đến giờ uống nước rồi!</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
            Hãy uống một ly nước nhé!
          </p>

          {!showAmountChoices ? (
            /* Phase 1: 2 Main Buttons: Uống ngay / Để sau */
            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={() => setShowAmountChoices(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Uống ngay</span>
              </button>
            </div>
          ) : (
            /* Phase 2: Select Amount: +200 ml, +300 ml, +500 ml */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 space-y-2.5"
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Chọn lượng nước bạn vừa uống:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[200, 300, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectAmount(amt)}
                    className="py-2.5 px-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 border border-cyan-200 dark:border-cyan-900/60 text-cyan-700 dark:text-cyan-300 font-bold text-xs transition-all shadow-xs flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-sm font-mono">+{amt}</span>
                    <span className="text-[10px] font-normal">ml</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowAmountChoices(false)}
                className="text-[11px] text-slate-400 hover:underline pt-1"
              >
                ← Quay lại
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
