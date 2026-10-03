import React from 'react';
import { Droplets, Sun, Moon, Volume2, VolumeX, Settings2, Music } from 'lucide-react';
import { chillMusicPlayer } from '../utils/sound/audio';

interface HeaderProps {
  darkMode: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  soundEnabled,
  musicEnabled,
  onToggleDarkMode,
  onToggleSound,
  onToggleMusic,
  onOpenSettings,
}) => {
  const isMusicPlaying = chillMusicPlayer.isPlaying();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/85 dark:bg-[#0B132B]/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
            <Droplets className="w-5 h-5 fill-white/20 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              Water Reminder
            </h1>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium block -mt-0.5">
              Nhắc Uống Nước
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Chill Music Toggle in Header */}
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={isMusicPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền chill'}
            title={isMusicPlaying ? 'Nhạc nền: Đang phát (Chạm để tắt)' : 'Nhạc nền: Tạm dừng (Chạm để nghe)'}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
              isMusicPlaying
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/40 animate-gentle-pulse'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            <Music className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            title={soundEnabled ? 'Âm thanh: Đang Bật' : 'Âm thanh: Đang Tắt'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
            )}
          </button>

          {/* Sáng / Tối Quick Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            className="px-2.5 sm:px-3 h-9 sm:h-10 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="inline font-medium">Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span className="inline font-medium">Tối</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Cài đặt thông tin"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
