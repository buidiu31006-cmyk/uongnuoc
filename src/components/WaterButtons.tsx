import React from 'react';
import { motion } from 'motion/react';
import { Droplet, Plus } from 'lucide-react';

interface WaterButtonsProps {
  onAddWater: (amount: number) => void;
  onOpenCustomModal: () => void;
}

const QUICK_AMOUNTS = [
  { amount: 100, label: '+100 ml' },
  { amount: 200, label: '+200 ml' },
  { amount: 300, label: '+300 ml' },
  { amount: 500, label: '+500 ml' },
];

export const WaterButtons: React.FC<WaterButtonsProps> = ({
  onAddWater,
  onOpenCustomModal,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mt-2 mb-6">
      {/* 4 Quick Action Buttons */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {QUICK_AMOUNTS.map((item) => (
          <motion.button
            key={item.amount}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onAddWater(item.amount)}
            className="flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl bg-white dark:bg-slate-800 border border-cyan-100 dark:border-slate-700/80 shadow-xs hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-md hover:shadow-cyan-500/15 transition-all text-slate-800 dark:text-slate-100 group min-h-[66px] cursor-pointer"
            aria-label={`Thêm ${item.amount} ml nước`}
          >
            <div className="w-7 h-7 rounded-full bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all mb-1">
              <Droplet className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-tight font-mono">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Button: + Nhập lượng nước khác */}
      <div className="mt-2.5">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenCustomModal}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200/80 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>+ Nhập lượng nước khác</span>
        </motion.button>
      </div>
    </div>
  );
};
