import React from 'react';
import { Volume2, Play, Pause, Music } from 'lucide-react';
import { chillMusicPlayer } from '../utils/sound/audio';

interface AmbientMusicPlayerProps {
  musicEnabled: boolean;
  musicVolume: number;
  onToggleMusic: () => void;
  onChangeVolume: (volume: number) => void;
}

export const AmbientMusicPlayer: React.FC<AmbientMusicPlayerProps> = ({
  musicEnabled,
  musicVolume,
  onToggleMusic,
  onChangeVolume,
}) => {
  const isPlaying = chillMusicPlayer.isPlaying();

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 animate-gentle-pulse'
              : 'bg-cyan-100/70 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400'
          }`}>
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>🎵 Nhạc nền Chill</span>
              {isPlaying && (
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isPlaying ? 'Âm thanh thư giãn sóng êm dịu' : 'Tạm dừng · Chạm để thư giãn'}
            </span>
          </div>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          type="button"
          onClick={onToggleMusic}
          className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
            isPlaying
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/20'
          }`}
          aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc nền chill'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Tạm dừng</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Bật nhạc</span>
            </>
          )}
        </button>
      </div>

      {/* Volume Slider Bar */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicVolume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            aria-label="Âm lượng nhạc nền"
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
          {Math.round(musicVolume * 100)}%
        </span>
      </div>
    </div>
  );
};
