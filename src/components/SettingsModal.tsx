import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Scale,
  Ruler,
  Activity,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Sun,
  Moon,
  Check,
  Music,
} from 'lucide-react';
import { Gender, ActivityLevel, UserProfile, ReminderConfig, AppSettings } from '../types';
import { ACTIVITY_OPTIONS } from '../data/activityLevels';
import { calculateDailyWaterTarget } from '../utils/waterCalculator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  reminder: ReminderConfig;
  settings: AppSettings;
  onSave: (
    updatedProfile: UserProfile,
    updatedReminder: ReminderConfig,
    updatedSettings: AppSettings
  ) => void;
}

const INTERVAL_OPTIONS = [30, 60, 90, 120];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  reminder,
  settings,
  onSave,
}) => {
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [height, setHeight] = useState<number>(profile.height || 165);
  const [weight, setWeight] = useState<number>(profile.weight);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [customTarget, setCustomTarget] = useState<number>(profile.targetWater);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.soundEnabled);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(settings.musicEnabled);
  const [musicVolume, setMusicVolume] = useState<number>(settings.musicVolume);
  const [darkMode, setDarkMode] = useState<boolean>(settings.darkMode);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(reminder.enabled);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(reminder.intervalMinutes);

  if (!isOpen) return null;

  const handleRecalculateTarget = () => {
    const calculated = calculateDailyWaterTarget(weight, activityLevel);
    setCustomTarget(calculated);
  };

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      gender,
      height,
      weight,
      activityLevel,
      targetWater: customTarget,
      isConfigured: true,
    };
    const updatedReminder: ReminderConfig = {
      ...reminder,
      enabled: reminderEnabled,
      intervalMinutes,
      lastNotifiedTime: Date.now(),
    };
    const updatedSettings: AppSettings = {
      soundEnabled,
      darkMode,
      musicEnabled,
      musicVolume,
    };

    onSave(updatedProfile, updatedReminder, updatedSettings);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 text-slate-800 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>⚙️ Cài đặt</span>
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 py-4">
            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Giới tính</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('nam')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    gender === 'nam'
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/40'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  👨 Nam
                </button>
                <button
                  type="button"
                  onClick={() => setGender('nu')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    gender === 'nu'
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/40'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  👩 Nữ
                </button>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-3">
              {/* Height */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Chiều cao (cm)</span>
                </label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={height || ''}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold font-mono"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Cân nặng (kg)</span>
                </label>
                <input
                  type="number"
                  min="20"
                  max="250"
                  value={weight || ''}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold font-mono"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Mức độ vận động</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {ACTIVITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setActivityLevel(opt.id)}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                      activityLevel === opt.id
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/40'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">+{opt.bonusMl}ml</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Water */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Mục tiêu nước mỗi ngày (ml)
                </label>
                <button
                  type="button"
                  onClick={handleRecalculateTarget}
                  className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
                >
                  Tính lại mục tiêu 🔄
                </button>
              </div>
              <input
                type="number"
                step="50"
                min="500"
                max="6000"
                value={customTarget}
                onChange={(e) => setCustomTarget(parseInt(e.target.value, 10) || 0)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold font-mono tabular-nums"
              />
            </div>

            {/* Reminder Settings */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {reminderEnabled ? (
                    <Bell className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  ) : (
                    <BellOff className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Nhắc uống nước
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    reminderEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {reminderEnabled && (
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Khoảng thời gian nhắc:</span>
                  <div className="flex gap-1">
                    {INTERVAL_OPTIONS.map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setIntervalMinutes(mins)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                          intervalMinutes === mins
                            ? 'bg-cyan-500 text-white border-cyan-500'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {mins}p
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio & Music Preferences */}
            <div className="space-y-2.5">
              {/* Sound FX Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Âm thanh hiệu ứng (Tõm, chuông)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    soundEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Chill Ambient Music & Volume */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      Nhạc nền Chill
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      musicEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                        musicEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500">Âm lượng:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-cyan-500 cursor-pointer"
                  />
                  <span className="font-mono text-slate-400 w-8 text-right">
                    {Math.round(musicVolume * 100)}%
                  </span>
                </div>
              </div>

              {/* Theme Sáng / Tối */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  {darkMode ? (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Chế độ: <strong>{darkMode ? 'Tối' : 'Sáng'}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
