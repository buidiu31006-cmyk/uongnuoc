import { ActivityLevel } from '../types';

export function calculateDailyWaterTarget(weightKg: number, activityLevel: ActivityLevel): number {
  const safeWeight = Math.max(20, Math.min(250, weightKg));
  const baseWater = safeWeight * 30; // 30 ml per kg

  let bonus = 0;
  if (activityLevel === 'moderate') {
    bonus = 300;
  } else if (activityLevel === 'active') {
    bonus = 500;
  }

  const total = Math.round(baseWater + bonus);
  // Round to nearest 50ml for cleaner goals
  return Math.round(total / 50) * 50;
}
