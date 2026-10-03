export type Gender = 'nam' | 'nu';

export type ActivityLevel = 'sedentary' | 'moderate' | 'active';

export interface ActivityOption {
  id: ActivityLevel;
  label: string;
  bonusMl: number;
  description: string;
}

export interface UserProfile {
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  targetWater: number; // in ml
  isConfigured: boolean;
}

export interface DrinkLog {
  id: string;
  timestamp: number; // Date.now()
  timeStr: string; // e.g. "10:30"
  amount: number; // in ml
}

export interface DayHistoryRecord {
  date: string; // "YYYY-MM-DD"
  dayLabel: string; // e.g. "Thứ 2", "Hôm qua"
  amount: number;
  target: number;
  completed: boolean;
}

export interface ReminderConfig {
  enabled: boolean;
  intervalMinutes: number; // 30, 60, 90, 120
  lastNotifiedTime: number | null;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'reminder' | 'warning';
}

export interface AppSettings {
  soundEnabled: boolean;
  darkMode: boolean;
  musicEnabled: boolean;
  musicVolume: number; // 0 to 1 (e.g. 0.35)
}
