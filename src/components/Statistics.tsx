import React from 'react';
import { BarChart3, Target, Droplet, Award, Calendar, Activity } from 'lucide-react';
import { DayHistoryRecord } from '../types';

interface StatisticsProps {
  currentWater: number;
  targetWater: number;
  drinkCount: number;
  pastDays: DayHistoryRecord[];
}

export const Statistics: React.FC<StatisticsProps> = ({
  currentWater,
  targetWater,
  drinkCount,
  pastDays,
}) => {
  const percentage = targetWater > 0 ? Math.round((currentWater / targetWater) * 100) : 0;
  const remainingWater = Math.max(0, targetWater - currentWater);
  const last7Days = pastDays.slice(-6);

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100/70 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            📊 Hôm nay
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Chỉ số trong ngày
        </span>
      </div>

      {/* Primary 5-metrics Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        {/* Đã uống */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Droplet className="w-3.5 h-3.5 text-cyan-500" />
            <span>Đã uống</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono tabular-nums">
            {currentWater.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">ml</span>
          </div>
        </div>

        {/* Mục tiêu */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span>Mục tiêu</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono tabular-nums">
            {targetWater.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">ml</span>
          </div>
        </div>

        {/* Còn lại */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            <span>Còn lại</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono tabular-nums">
            {remainingWater.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">ml</span>
          </div>
        </div>

        {/* Số lần uống */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Số lần uống</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono tabular-nums">
            {drinkCount}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">lần</span>
          </div>
        </div>

        {/* Tiến độ */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between col-span-2 sm:col-span-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tiến độ</span>
            </span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {percentage}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7-Day History Chart Overview */}
      {last7Days.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            <span>Lịch sử các ngày trước</span>
            <span className="text-[11px] font-normal text-slate-400">
              {last7Days.length} ngày gần nhất
            </span>
          </div>

          <div className="space-y-1.5">
            {last7Days.map((day) => {
              const dayPct = day.target > 0 ? Math.min(100, Math.round((day.amount / day.target) * 100)) : 0;
              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-medium">{day.dayLabel}</span>
                    <span className="font-mono tabular-nums font-semibold text-cyan-600 dark:text-cyan-400">
                      {day.amount.toLocaleString()} ml
                      {day.completed && (
                        <span className="ml-1 text-[11px] text-emerald-500 font-bold">✓</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        day.completed
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                          : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                      }`}
                      style={{ width: `${dayPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
