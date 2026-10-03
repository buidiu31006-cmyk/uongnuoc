import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Droplet, Plus } from 'lucide-react';

interface CustomWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amount: number) => void;
}

const PRESET_AMOUNTS = [150, 250, 350, 750];

export const CustomWaterModal: React.FC<CustomWaterModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [customMl, setCustomMl] = useState<string>('250');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customMl, 10);
    if (parsed > 0 && parsed <= 3000) {
      onAdd(parsed);
      onClose();
    }
  };

  const handleSelectPreset = (amount: number) => {
    setCustomMl(String(amount));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-800 dark:text-slate-100"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Nhập lượng nước khác</span>
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Lượng nước bạn vừa uống:
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="3000"
                  step="10"
                  required
                  autoFocus
                  value={customMl}
                  onChange={(e) => setCustomMl(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-lg font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="250"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ml
                </span>
              </div>
            </div>

            {/* Quick preset chips */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">Gợi ý nhanh:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectPreset(amt)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      customMl === String(amt)
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    +{amt} ml
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm nước</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
