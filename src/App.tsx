import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { WaterProgress } from './components/WaterProgress';
import { WaterButtons } from './components/WaterButtons';
import { ProfileForm } from './components/ProfileForm';
import { ReminderSettings } from './components/ReminderSettings';
import { WaterHistory } from './components/WaterHistory';
import { Statistics } from './components/Statistics';
import { SettingsModal } from './components/SettingsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { CustomWaterModal } from './components/CustomWaterModal';
import { DrinkReminderPopup } from './components/DrinkReminderPopup';
import { AmbientMusicPlayer } from './components/AmbientMusicPlayer';
import { ToastContainer } from './components/Toast';
import {
  UserProfile,
  DrinkLog,
  DayHistoryRecord,
  ReminderConfig,
  AppSettings,
  ToastMessage,
} from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadTodayWater,
  saveTodayWater,
  loadTodayLogs,
  saveTodayLogs,
  loadPastDays,
  savePastDays,
  loadReminderConfig,
  saveReminderConfig,
  loadAppSettings,
  saveAppSettings,
  checkAndHandleDayTransition,
} from './utils/storage';
import { formatTime } from './utils/date';
import {
  playWaterDropSound,
  playSuccessChime,
  playReminderChime,
  chillMusicPlayer,
} from './utils/sound/audio';
import { HEALTH_TIPS } from './data/healthTips';
import { RotateCcw, Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react';

export default function App() {
  // State Initialization from LocalStorage
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [todayWater, setTodayWater] = useState<number>(() => loadTodayWater());
  const [todayLogs, setTodayLogs] = useState<DrinkLog[]>(() => loadTodayLogs());
  const [pastDays, setPastDays] = useState<DayHistoryRecord[]>(() => loadPastDays());
  const [reminder, setReminder] = useState<ReminderConfig>(() => loadReminderConfig());
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());

  // UI state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isReminderPopupOpen, setIsReminderPopupOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isBottleBumping, setIsBottleBumping] = useState(false);

  // Floating +ml animation items
  const [floatingAmounts, setFloatingAmounts] = useState<
    { id: string; amount: number; x: number; y: number }[]
  >([]);

  // Track milestone sound
  const hasCelebratedRef = useRef(false);

  // Helper to add toast
  const showToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      type,
    };
    setToasts((prev) => [...prev.slice(-4), newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Sáng / Tối (Light / Dark mode) with <html> & <body>
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (settings.darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      body.style.backgroundColor = '#0B132B';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      body.style.backgroundColor = '#F8FAFC';
    }
  }, [settings.darkMode]);

  // Check for day rollover on mount and periodically
  useEffect(() => {
    const handleDayCheck = () => {
      const result = checkAndHandleDayTransition(profile.targetWater);
      if (result.isNewDay) {
        setTodayWater(0);
        setTodayLogs([]);
        setPastDays(result.pastDays);
        hasCelebratedRef.current = false;
        showToast('🌅 Chào ngày mới! Dữ liệu nước đã được làm mới.', 'info');
      }
    };

    handleDayCheck();
    const interval = setInterval(handleDayCheck, 20000);
    return () => clearInterval(interval);
  }, [profile.targetWater]);

  // Compute next reminder time string (e.g. "14:30")
  const nextReminderTimeStr = useMemo(() => {
    if (!reminder.enabled) return 'Đang tắt';
    const last = reminder.lastNotifiedTime || Date.now();
    const targetTime = last + reminder.intervalMinutes * 60 * 1000;
    return formatTime(targetTime);
  }, [reminder.enabled, reminder.lastNotifiedTime, reminder.intervalMinutes]);

  // Reminder interval check loop
  useEffect(() => {
    if (!reminder.enabled) return;

    const checkReminder = () => {
      const intervalMs = reminder.intervalMinutes * 60 * 1000;
      const now = Date.now();
      const last = reminder.lastNotifiedTime || now;

      if (now - last >= intervalMs) {
        // Trigger reminder Popup & audio & notification!
        setIsReminderPopupOpen(true);
        playReminderChime(settings.soundEnabled);
        showToast('💧 Đến giờ uống nước rồi! Hãy uống một ly nước nhé!', 'reminder');

        // Optional Web Notification API if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('💧 Water Reminder', {
              body: 'Đến giờ uống nước rồi! Hãy uống một ly nước nhé!',
            });
          } catch {}
        }

        const updated = {
          ...reminder,
          lastNotifiedTime: now,
        };
        setReminder(updated);
        saveReminderConfig(updated);
      }
    };

    const timer = setInterval(checkReminder, 10000);
    return () => clearInterval(timer);
  }, [reminder, settings.soundEnabled]);

  // Water addition handler
  const handleAddWater = (amount: number) => {
    const newTotal = todayWater + amount;
    const now = Date.now();
    const newLog: DrinkLog = {
      id: `${now}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now,
      timeStr: formatTime(now),
      amount,
    };

    const updatedLogs = [newLog, ...todayLogs];

    setTodayWater(newTotal);
    setTodayLogs(updatedLogs);
    saveTodayWater(newTotal);
    saveTodayLogs(updatedLogs);

    // Audio feedback: Water drop "tõm" sound
    playWaterDropSound(settings.soundEnabled);

    // Bottle bump bounce animation
    setIsBottleBumping(true);
    setTimeout(() => setIsBottleBumping(false), 450);

    // Floating +ml text feedback
    const randomX = (Math.random() - 0.5) * 50;
    const randomY = (Math.random() - 0.5) * 30;
    const floatId = `${now}`;
    setFloatingAmounts((prev) => [
      ...prev,
      { id: floatId, amount, x: randomX, y: randomY },
    ]);

    setTimeout(() => {
      setFloatingAmounts((prev) => prev.filter((item) => item.id !== floatId));
    }, 1200);

    showToast(`💧 Đã thêm ${amount} ml nước!`, 'success');

    // Milestone celebration
    if (newTotal >= profile.targetWater && profile.targetWater > 0 && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      setTimeout(() => {
        playSuccessChime(settings.soundEnabled);
        showToast('🎉 Bạn đã hoàn thành mục tiêu hôm nay!', 'success');
      }, 400);
    }
  };

  // Reminder popup "Uống ngay" with amount choice
  const handleReminderDrinkNow = (amount: number) => {
    handleAddWater(amount);
    setIsReminderPopupOpen(false);

    // Reset reminder timer countdown
    const updated: ReminderConfig = {
      ...reminder,
      lastNotifiedTime: Date.now(),
    };
    setReminder(updated);
    saveReminderConfig(updated);
  };

  // Reminder popup "Để sau"
  const handleReminderPostpone = () => {
    setIsReminderPopupOpen(false);
    // Reset timer to count again for selected interval
    const updated: ReminderConfig = {
      ...reminder,
      lastNotifiedTime: Date.now(),
    };
    setReminder(updated);
    saveReminderConfig(updated);
    showToast(`⏰ Sẽ nhắc lại bạn sau ${reminder.intervalMinutes} phút!`, 'info');
  };

  // Delete log handler
  const handleDeleteLog = (id: string, amount: number) => {
    const updatedLogs = todayLogs.filter((log) => log.id !== id);
    const newTotal = Math.max(0, todayWater - amount);

    setTodayLogs(updatedLogs);
    setTodayWater(newTotal);
    saveTodayLogs(updatedLogs);
    saveTodayWater(newTotal);

    if (newTotal < profile.targetWater) {
      hasCelebratedRef.current = false;
    }

    showToast(`Đã xóa lần uống ${amount} ml`, 'info');
  };

  // Reset today's water handler
  const handleResetToday = () => {
    setTodayWater(0);
    setTodayLogs([]);
    saveTodayWater(0);
    saveTodayLogs([]);
    hasCelebratedRef.current = false;
    showToast('💧 Đã đặt lượng nước hôm nay về 0 ml!', 'info');
  };

  // Toggle Sound FX handler
  const handleToggleSound = () => {
    const nextSound = !settings.soundEnabled;
    const updated = { ...settings, soundEnabled: nextSound };
    setSettings(updated);
    saveAppSettings(updated);
    if (nextSound) {
      playWaterDropSound(true);
      showToast('🔊 Đã bật âm thanh!', 'info');
    } else {
      showToast('🔇 Đã tắt âm thanh!', 'info');
    }
  };

  // Toggle Chill Ambient Music handler
  const handleToggleMusic = () => {
    const isPlaying = chillMusicPlayer.isPlaying();
    if (isPlaying) {
      chillMusicPlayer.stop();
      const updated = { ...settings, musicEnabled: false };
      setSettings(updated);
      saveAppSettings(updated);
      showToast('⏸️ Đã tạm dừng nhạc nền chill', 'info');
    } else {
      chillMusicPlayer.start(settings.musicVolume);
      const updated = { ...settings, musicEnabled: true };
      setSettings(updated);
      saveAppSettings(updated);
      showToast('🎵 Đang phát nhạc nền chill thư giãn...', 'info');
    }
  };

  // Change music volume handler
  const handleChangeMusicVolume = (vol: number) => {
    chillMusicPlayer.setVolume(vol);
    const updated = { ...settings, musicVolume: vol };
    setSettings(updated);
    saveAppSettings(updated);
  };

  // Toggle Dark Mode handler
  const handleToggleDarkMode = () => {
    const nextDark = !settings.darkMode;
    const updated = { ...settings, darkMode: nextDark };
    setSettings(updated);
    saveAppSettings(updated);
    showToast(nextDark ? '🌙 Đã chuyển sang chế độ Tối' : '☀️ Đã chuyển sang chế độ Sáng', 'info');
  };

  // Save profile from initial onboarding
  const handleSaveInitialProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
    showToast(`💧 Mục tiêu mới: ${newProfile.targetWater} ml/ngày!`, 'success');
  };

  // Save from settings modal
  const handleSaveSettings = (
    newProfile: UserProfile,
    newReminder: ReminderConfig,
    newSettings: AppSettings
  ) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);

    setReminder(newReminder);
    saveReminderConfig(newReminder);

    setSettings(newSettings);
    saveAppSettings(newSettings);

    // Sync ambient music state
    if (newSettings.musicEnabled && !chillMusicPlayer.isPlaying()) {
      chillMusicPlayer.start(newSettings.musicVolume);
    } else if (!newSettings.musicEnabled && chillMusicPlayer.isPlaying()) {
      chillMusicPlayer.stop();
    } else {
      chillMusicPlayer.setVolume(newSettings.musicVolume);
    }

    showToast('⚙️ Đã lưu thay đổi cài đặt!', 'success');
  };

  // Cycle health tips
  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + HEALTH_TIPS.length) % HEALTH_TIPS.length);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-400">
      {/* Header */}
      <Header
        darkMode={settings.darkMode}
        soundEnabled={settings.soundEnabled}
        musicEnabled={settings.musicEnabled}
        onToggleDarkMode={handleToggleDarkMode}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center">
        {!profile.isConfigured ? (
          /* Initial Profile Setup */
          <div className="w-full my-auto">
            <ProfileForm onSaveProfile={handleSaveInitialProfile} />
          </div>
        ) : (
          /* Active Main Dashboard */
          <div className="w-full flex flex-col items-center">
            {/* Centerpiece 3D Water Bottle with large indicators & Progress bar */}
            <WaterProgress
              currentWater={todayWater}
              targetWater={profile.targetWater}
              floatingAmounts={floatingAmounts}
              isBottleBumping={isBottleBumping}
            />

            {/* Quick Action Buttons placed directly below bottle */}
            <WaterButtons
              onAddWater={handleAddWater}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
            />

            {/* Profile Overview (Height, Weight, Activity) */}
            <ProfileForm
              initialProfile={profile}
              onSaveProfile={handleSaveInitialProfile}
            />

            {/* Reminder Card */}
            <ReminderSettings
              config={reminder}
              onUpdateConfig={(newConfig) => {
                setReminder(newConfig);
                saveReminderConfig(newConfig);
                showToast(
                  newConfig.enabled ? '⏰ Đã bật nhắc uống nước!' : '⏰ Đã tắt nhắc nhở',
                  'info'
                );
              }}
              nextReminderTimeStr={nextReminderTimeStr}
            />

            {/* Chill Ambient Music Card */}
            <AmbientMusicPlayer
              musicEnabled={settings.musicEnabled}
              musicVolume={settings.musicVolume}
              onToggleMusic={handleToggleMusic}
              onChangeVolume={handleChangeMusicVolume}
            />

            {/* Today's Metrics Card: ## 📊 Hôm nay */}
            <Statistics
              currentWater={todayWater}
              targetWater={profile.targetWater}
              drinkCount={todayLogs.length}
              pastDays={pastDays}
            />

            {/* Today's Log History Card: ## 📝 Lịch sử hôm nay */}
            <WaterHistory logs={todayLogs} onDeleteLog={handleDeleteLog} />

            {/* Reset Today's Water Button */}
            <div className="w-full max-w-md pt-2 mb-6 flex justify-center">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 border border-dashed border-slate-300 dark:border-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại dữ liệu hôm nay</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer & Health Tips */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 px-4 bg-white/60 dark:bg-[#0B132B]/80 backdrop-blur-xs mt-auto transition-colors">
        <div className="max-w-xl mx-auto space-y-4 text-center">
          {/* Health Tip Card */}
          <div className="p-4 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40 text-left relative overflow-hidden transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <span>Mẹo nhỏ: {HEALTH_TIPS[currentTipIndex].tag}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevTip}
                  aria-label="Mẹo trước"
                  className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentTipIndex + 1}/{HEALTH_TIPS.length}
                </span>
                <button
                  type="button"
                  onClick={nextTip}
                  aria-label="Mẹo tiếp theo"
                  className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {HEALTH_TIPS[currentTipIndex].tip}
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-1">
            <p className="font-semibold text-cyan-700 dark:text-cyan-400">
              Uống đủ nước – chăm sóc bản thân mỗi ngày 💧
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Water Reminder · Dữ liệu được lưu an toàn trên thiết bị của bạn
            </p>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        reminder={reminder}
        settings={settings}
        onSave={handleSaveSettings}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetToday}
      />

      {/* Custom Water Input Modal */}
      <CustomWaterModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAdd={handleAddWater}
      />

      {/* Drink Reminder Popup (Scheduled Nudge Modal) */}
      <DrinkReminderPopup
        isOpen={isReminderPopupOpen}
        onDrinkNow={handleReminderDrinkNow}
        onPostpone={handleReminderPostpone}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
