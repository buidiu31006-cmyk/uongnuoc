import React from 'react';
import { Clock, Trash2, Droplets } from 'lucide-react';
import { DrinkLog } from '../types';

interface WaterHistoryProps {
  logs: DrinkLog[];
  onDeleteLog: (id: string, amount: number) => void;
}

export const WaterHistory: React.FC<WaterHistoryProps> = ({
  logs,
  onDeleteLog,
}) => {
  // Only display the 10 most recent logs
  const recentLogs = logs.slice(0, 10);

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100/70 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            📝 Lịch sử hôm nay
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          {logs.length} lần uống
        </span>
      </div>

      {recentLogs.length === 0 ? (
        <div className="py-6 text-center text-slate-400 dark:text-slate-500">
          <Droplets className="w-8 h-8 mx-auto mb-1.5 opacity-40 text-cyan-500" />
          <p className="text-xs">Chưa có lần uống nước nào hôm nay.</p>
          <p className="text-[11px] text-slate-400/80 mt-0.5">
            Hãy bấm một nút phía trên để bắt đầu nhé! 💧
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="py-2.5 flex items-center justify-between text-xs group hover:bg-slate-50/70 dark:hover:bg-slate-750/30 -mx-1 px-1 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                <span className="font-mono text-slate-600 dark:text-slate-300 font-bold text-xs sm:text-sm">
                  {log.timeStr}
                </span>
                <span className="text-slate-300 dark:text-slate-600">—</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono tabular-nums text-sm">
                  +{log.amount} ml
                </span>
              </div>

              <button
                type="button"
                onClick={() => onDeleteLog(log.id, log.amount)}
                title="Xóa lần ghi nhận này"
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                aria-label={`Xóa lần uống ${log.amount} ml lúc ${log.timeStr}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
