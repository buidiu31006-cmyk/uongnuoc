import {
  UserProfile,
  DrinkLog,
  DayHistoryRecord,
  ReminderConfig,
  AppSettings,
} from '../types';
import { getTodayDateString, getShortDayName } from './date';

const STORAGE_KEYS = {
  USER_PROFILE: 'water_reminder_profile_v1',
  CURRENT_DATE: 'water_reminder_last_date_v1',
  TODAY_WATER: 'water_reminder_today_water_v1',
  TODAY_LOGS: 'water_reminder_today_logs_v1',
  PAST_DAYS: 'water_reminder_past_days_v1',
  REMINDER_CONFIG: 'water_reminder_config_v1',
  APP_SETTINGS: 'water_reminder_settings_v1',
};

export const DEFAULT_PROFILE: UserProfile = {
  gender: 'nam',
  height: 165,
  weight: 60,
  activityLevel: 'moderate',
  targetWater: 2100,
  isConfigured: false,
};

export const DEFAULT_REMINDER: ReminderConfig = {
  enabled: true,
  intervalMinutes: 60,
  lastNotifiedTime: null,
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  darkMode: false,
  musicEnabled: false,
  musicVolume: 0.35,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      height: parsed.height || 165,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile', err);
  }
}

export function loadTodayWater(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODAY_WATER);
    return raw !== null ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function saveTodayWater(amount: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TODAY_WATER, String(Math.max(0, amount)));
  } catch (err) {
    console.error('Error saving water amount', err);
  }
}

export function loadTodayLogs(): DrinkLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODAY_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTodayLogs(logs: DrinkLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TODAY_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving logs', err);
  }
}

export function loadPastDays(): DayHistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAST_DAYS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePastDays(days: DayHistoryRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAST_DAYS, JSON.stringify(days));
  } catch (err) {
    console.error('Error saving past days', err);
  }
}

export function loadReminderConfig(): ReminderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDER_CONFIG);
    if (!raw) return DEFAULT_REMINDER;
    return { ...DEFAULT_REMINDER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_REMINDER;
  }
}

export function saveReminderConfig(config: ReminderConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDER_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving reminder config', err);
  }
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (!raw) {
      // Check system preference for dark mode
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return { ...DEFAULT_SETTINGS, darkMode: prefersDark };
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving app settings', err);
  }
}

/**
 * Checks if the day has changed since the user last used the app.
 * If a new day is detected:
 * - Archives previous day's water into pastDays list (keeping up to last 14 days)
 * - Resets today's water to 0 ml
 * - Resets today's logs to empty []
 * - Updates last recorded date to today
 */
export function checkAndHandleDayTransition(profileTarget: number): {
  isNewDay: boolean;
  todayWater: number;
  todayLogs: DrinkLog[];
  pastDays: DayHistoryRecord[];
} {
  const todayStr = getTodayDateString();
  const lastRecordedDate = localStorage.getItem(STORAGE_KEYS.CURRENT_DATE);

  if (!lastRecordedDate) {
    // First run or fresh session
    localStorage.setItem(STORAGE_KEYS.CURRENT_DATE, todayStr);
    return {
      isNewDay: false,
      todayWater: loadTodayWater(),
      todayLogs: loadTodayLogs(),
      pastDays: loadPastDays(),
    };
  }

  if (lastRecordedDate !== todayStr) {
    // Day rollover detected!
    const previousWater = loadTodayWater();
    const existingPast = loadPastDays();

    // Archive previous day
    const updatedPast: DayHistoryRecord[] = [
      ...existingPast.filter((item) => item.date !== lastRecordedDate),
      {
        date: lastRecordedDate,
        dayLabel: getShortDayName(lastRecordedDate),
        amount: previousWater,
        target: profileTarget,
        completed: previousWater >= profileTarget && profileTarget > 0,
      },
    ].slice(-14); // Keep last 14 days

    savePastDays(updatedPast);

    // Reset today's values
    saveTodayWater(0);
    saveTodayLogs([]);
    localStorage.setItem(STORAGE_KEYS.CURRENT_DATE, todayStr);

    return {
      isNewDay: true,
      todayWater: 0,
      todayLogs: [],
      pastDays: updatedPast,
    };
  }

  return {
    isNewDay: false,
    todayWater: loadTodayWater(),
    todayLogs: loadTodayLogs(),
    pastDays: loadPastDays(),
  };
}
