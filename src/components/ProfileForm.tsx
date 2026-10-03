import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, ArrowRight, Activity, Scale, User, Ruler, Info, Check, Edit3 } from 'lucide-react';
import { Gender, ActivityLevel, UserProfile } from '../types';
import { ACTIVITY_OPTIONS } from '../data/activityLevels';
import { calculateDailyWaterTarget } from '../utils/waterCalculator';

interface ProfileFormProps {
  initialProfile?: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  isModal?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialProfile,
  onSaveProfile,
  isModal = false,
}) => {
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || 'nam');
  const [height, setHeight] = useState<number>(initialProfile?.height || 165);
  const [weight, setWeight] = useState<number>(initialProfile?.weight || 60);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    initialProfile?.activityLevel || 'moderate'
  );
  const [calculatedTarget, setCalculatedTarget] = useState<number | null>(
    initialProfile?.targetWater || null
  );
  const [isEditing, setIsEditing] = useState<boolean>(!initialProfile?.isConfigured);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || weight < 20 || weight > 250) return;
    const target = calculateDailyWaterTarget(weight, activityLevel);
    setCalculatedTarget(target);
  };

  const handleConfirm = () => {
    const target = calculatedTarget || calculateDailyWaterTarget(weight, activityLevel);
    onSaveProfile({
      gender,
      height,
      weight,
      activityLevel,
      targetWater: target,
      isConfigured: true,
    });
    setIsEditing(false);
  };

  const currentActivityObj = ACTIVITY_OPTIONS.find((a) => a.id === activityLevel);

  // If already configured and not in modal, show the clean "Thông tin của bạn" summary card with edit trigger
  if (!isEditing && initialProfile?.isConfigured && !isModal) {
    return (
      <div className="w-full max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 transition-colors">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Thông tin của bạn</span>
          </h3>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Chỉnh sửa</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 flex items-center gap-1 mb-1">
              <span>👤</span> Giới tính
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {gender === 'nam' ? 'Nam' : 'Nữ'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 flex items-center gap-1 mb-1">
              <span>📏</span> Chiều cao
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm font-mono">
              {height} cm
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 flex items-center gap-1 mb-1">
              <span>⚖️</span> Cân nặng
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm font-mono">
              {weight} kg
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 flex items-center gap-1 mb-1">
              <span>🏃</span> Vận động
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {currentActivityObj?.label}
            </span>
          </div>
        </div>

        <div className="mt-3 p-2.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/40 flex items-center justify-between text-xs">
          <span className="text-cyan-800 dark:text-cyan-300 font-medium">💧 Mục tiêu hàng ngày:</span>
          <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono text-sm">
            {initialProfile.targetWater} ml
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-lg mx-auto ${
        isModal
          ? ''
          : 'p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors'
      }`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-cyan-500/25">
          <Droplets className="w-7 h-7 fill-white/20" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          Thông tin của bạn
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Cá nhân hóa lượng nước phù hợp nhất cho cơ thể bạn mỗi ngày
        </p>
      </div>

      <form onSubmit={handleCalculate} className="space-y-4">
        {/* Gender Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Giới tính</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender('nam')}
              className={`py-2.5 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                gender === 'nam'
                  ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 shadow-xs ring-2 ring-cyan-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>👨 Nam</span>
              {gender === 'nam' && <Check className="w-4 h-4 text-cyan-600 ml-1" />}
            </button>
            <button
              type="button"
              onClick={() => setGender('nu')}
              className={`py-2.5 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                gender === 'nu'
                  ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 shadow-xs ring-2 ring-cyan-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>👩 Nữ</span>
              {gender === 'nu' && <Check className="w-4 h-4 text-cyan-600 ml-1" />}
            </button>
          </div>
        </div>

        {/* Height & Weight Inputs (Side by side) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Height Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Chiều cao</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="50"
                max="250"
                step="1"
                required
                value={height || ''}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                placeholder="165"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-semibold font-mono"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                cm
              </span>
            </div>
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Cân nặng</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="20"
                max="250"
                step="0.5"
                required
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                placeholder="55"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-semibold font-mono"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                kg
              </span>
            </div>
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Mức độ vận động</span>
          </label>
          <div className="space-y-2">
            {ACTIVITY_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setActivityLevel(opt.id)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  activityLevel === opt.id
                    ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 shadow-xs ring-1 ring-cyan-500'
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                    {opt.label}
                  </div>
                  <span className="text-[11px] font-mono font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-100/60 dark:bg-cyan-900/60 px-2 py-0.5 rounded-md">
                    +{opt.bonusMl} ml
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {opt.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
        >
          <Droplets className="w-4 h-4 fill-white" />
          <span>Tính lượng nước</span>
        </button>
      </form>

      {/* Result Display */}
      {calculatedTarget && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800"
        >
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Mục tiêu khuyến nghị
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5 flex items-center justify-center gap-1.5">
              <span>💧 Mục tiêu hôm nay:</span>
              <span className="font-mono tabular-nums">{calculatedTarget.toLocaleString()} ml</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Công thức: {weight}kg × 30ml + {activityLevel === 'moderate' ? '300ml' : activityLevel === 'active' ? '500ml' : '0ml'}
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2.5 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70">
            <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              “Lượng nước trên chỉ mang tính tham khảo. Nhu cầu thực tế có thể thay đổi tùy thời tiết, mức độ hoạt động và tình trạng sức khỏe.”
            </p>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full mt-3.5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <span>Bắt đầu uống nước ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
