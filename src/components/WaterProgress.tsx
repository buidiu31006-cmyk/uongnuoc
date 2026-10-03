import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

interface WaterProgressProps {
  currentWater: number;
  targetWater: number;
  floatingAmounts: { id: string; amount: number; x: number; y: number }[];
  isBottleBumping: boolean;
}

export const WaterProgress: React.FC<WaterProgressProps> = ({
  currentWater,
  targetWater,
  floatingAmounts,
  isBottleBumping,
}) => {
  const percentage = targetWater > 0 ? Math.round((currentWater / targetWater) * 100) : 0;
  const progressCapped = Math.min(100, Math.max(0, percentage));
  const remainingWater = Math.max(0, targetWater - currentWater);
  const isCompleted = currentWater >= targetWater && targetWater > 0;

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Floating +ml animations */}
      <AnimatePresence>
        {floatingAmounts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -100, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none z-30 font-bold text-cyan-500 dark:text-cyan-300 drop-shadow-md text-xl sm:text-2xl flex items-center gap-1"
            style={{ left: `calc(50% + ${item.x}px)`, top: `calc(40% + ${item.y}px)` }}
          >
            <span>+{item.amount} ml</span>
            <span className="text-base">💧</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Greeting Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center justify-center gap-2">
          <span>Chào bạn!</span>
          <span className="inline-block animate-gentle-pulse">💧</span>
        </h2>
        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 mt-1">
          Hôm nay bạn đã uống đủ nước chưa?
        </p>
      </div>

      {/* Centerpiece: 3D Water Bottle with liquid wave animation */}
      <motion.div
        animate={isBottleBumping ? { scale: [1, 1.05, 0.98, 1], rotate: [0, -2, 2, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="relative w-64 h-76 sm:w-72 sm:h-84 flex items-center justify-center mb-4"
      >
        {/* Soft Ambient Glow Behind Bottle */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-35 dark:opacity-25 pointer-events-none transition-all duration-700"
          style={{
            background: isCompleted
              ? 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, rgba(6,182,212,0.4) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(6,182,212,0.55) 0%, rgba(59,130,246,0.35) 60%, transparent 100%)',
          }}
        />

        {/* 3D Bottle Structure */}
        <div className="relative w-52 h-68 sm:w-56 sm:h-74 rounded-[38px] border-[5px] border-white/90 dark:border-slate-700 shadow-[0_20px_50px_rgba(6,182,212,0.22)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden bg-white/50 dark:bg-slate-900/80 backdrop-blur-md flex flex-col justify-end">
          {/* Bottle Cap Rim */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-2 rounded-full bg-cyan-200/60 dark:bg-slate-700 z-20" />
          {/* Glass Highlight Reflections */}
          <div className="absolute top-3 left-3.5 w-2 h-32 rounded-full bg-gradient-to-b from-white/70 to-transparent blur-[1px] z-20 pointer-events-none" />
          <div className="absolute top-3 right-3.5 w-1 h-20 rounded-full bg-gradient-to-b from-white/40 to-transparent blur-[0.5px] z-20 pointer-events-none" />

          {/* Liquid Body */}
          <motion.div
            className="w-full relative overflow-hidden transition-all duration-700 ease-out"
            style={{
              height: `${progressCapped}%`,
              minHeight: progressCapped > 0 ? '12%' : '0%',
            }}
          >
            {/* Wave 1 */}
            <div
              className="absolute -top-3 -left-1/2 w-[200%] h-7 bg-cyan-400/80 dark:bg-cyan-500/80 rounded-[40%] animate-wave-slow pointer-events-none"
              style={{ filter: 'blur(0.5px)' }}
            />
            {/* Wave 2 */}
            <div className="absolute -top-2.5 -left-1/2 w-[200%] h-6 bg-blue-500/70 dark:bg-blue-600/70 rounded-[45%] animate-wave-fast pointer-events-none" />

            {/* Deep Liquid Gradient */}
            <div className="w-full h-full bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 dark:from-cyan-500 dark:via-sky-600 dark:to-blue-700 relative">
              {/* Animated Bubbles */}
              <div
                className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-white/50 animate-ping"
                style={{ animationDuration: '3s' }}
              />
              <div className="absolute bottom-7 right-1/3 w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              <div className="absolute bottom-14 left-1/2 w-2 h-2 rounded-full bg-white/40" />
            </div>
          </motion.div>

          {/* Large Central Metrics inside Bottle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-4">
            <motion.div
              key={currentWater}
              initial={{ scale: 0.93 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="text-center"
            >
              {/* 1200 ml */}
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-sm font-mono tabular-nums">
                {currentWater.toLocaleString()} <span className="text-lg font-sans font-bold">ml</span>
              </div>
              {/* / 1800 ml */}
              <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-200 mt-0.5 drop-shadow-sm font-mono tabular-nums">
                / {targetWater.toLocaleString()} ml
              </div>
              {/* 67% */}
              <div className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-300 mt-1 font-mono tabular-nums drop-shadow-xs">
                {percentage}%
              </div>
            </motion.div>

            {/* Milestone Badge */}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Hoàn thành 100%</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Progress Bar Section (Section 3 requirement: 1200 / 1800 ml) */}
      <div className="w-full max-w-md mb-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
          <span className="font-mono tabular-nums">
            {currentWater.toLocaleString()} / {targetWater.toLocaleString()} ml
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Còn lại <strong className="font-mono text-cyan-600 dark:text-cyan-400">{remainingWater.toLocaleString()} ml</strong>
          </span>
        </div>

        <div className="relative w-full h-4 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner p-0.5">
          <motion.div
            className="relative h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progressCapped}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Completion Banner */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="w-full max-w-md mt-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-950/40 dark:to-cyan-950/40 border border-emerald-500/30 flex items-center justify-center gap-2 text-center shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
              🎉 Bạn đã hoàn thành mục tiêu hôm nay!
            </p>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
