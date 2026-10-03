import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { ReminderConfig } from '../types';

interface ReminderSettingsProps {
  config: ReminderConfig;
  onUpdateConfig: (newConfig: ReminderConfig) => void;
  nextReminderTimeStr: string;
}

const INTERVAL_OPTIONS = [
  { minutes: 30, label: '30 phút' },
  { minutes: 60, label: '60 phút' },
  { minutes: 90, label: '90 phút' },
  { minutes: 120, label: '120 phút' },
];

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  config,
  onUpdateConfig,
  nextReminderTimeStr,
}) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
    } catch (e) {
      console.warn('Could not request notification permission', e);
    }
  };

  const handleToggle = () => {
    const nextEnabled = !config.enabled;
    onUpdateConfig({
      ...config,
      enabled: nextEnabled,
      lastNotifiedTime: nextEnabled ? Date.now() : config.lastNotifiedTime,
    });
  };

  const handleSelectInterval = (minutes: number) => {
    onUpdateConfig({
      ...config,
      intervalMinutes: minutes,
      lastNotifiedTime: Date.now(),
    });
  };

  const isNotificationGranted = notificationPermission === 'granted';

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 transition-colors">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-100/70 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              ⏰ Nhắc uống nước
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Nhắc lại sau: <strong>{config.intervalMinutes} phút</strong>
            </span>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={handleToggle}
          role="switch"
          aria-checked={config.enabled}
          aria-label={config.enabled ? 'Tắt nhắc nhở' : 'Bật nhắc nhở'}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            config.enabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              config.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Status Details */}
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs mb-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Trạng thái:</span>
          <span className="font-semibold flex items-center gap-1.5">
            {config.enabled ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">🟢 Đang bật</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-slate-400">⚪ Đang tắt</span>
              </>
            )}
          </span>
        </div>

        {config.enabled && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Lần nhắc tiếp theo:</span>
            <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">
              {nextReminderTimeStr}
            </span>
          </div>
        )}
      </div>

      {/* Interval Selector */}
      {config.enabled && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Chọn chu kỳ nhắc:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {config.intervalMinutes} phút
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {INTERVAL_OPTIONS.map((item) => (
              <button
                key={item.minutes}
                type="button"
                onClick={() => handleSelectInterval(item.minutes)}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all ${
                  config.intervalMinutes === item.minutes
                    ? 'border-cyan-500 bg-cyan-500 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Browser Notification Section */}
          <div className="p-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Thông báo trình duyệt:</span>
              </span>
              <span className="text-[11px] font-medium">
                {isNotificationGranted ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">🟢 Thông báo đã bật</span>
                ) : (
                  <span className="text-slate-400">⚪ Thông báo chưa bật</span>
                )}
              </span>
            </div>

            {!isNotificationGranted && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="w-full py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>🔔 Cho phép thông báo</span>
              </button>
            )}

            <div className="flex items-start gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
              <span>
                Lưu ý: Nếu không có backend/service worker nền, nhắc tự động hoạt động đầy đủ nhất khi trang/ứng dụng đang mở.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
