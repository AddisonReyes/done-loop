import * as Notifications from 'expo-notifications';

import type { UserLanguagePreference } from '@/features/settings/types';
import { translations } from '@/i18n/translations';
import { dateKeyToLocalDate } from '@/shared/utils/date';
import { parseReminderTime } from './reminder-time';

type ScheduleHabitReminderInput = {
  habitId: string;
  habitName: string;
  reminderTime?: string;
  language?: UserLanguagePreference;
};

type ScheduleTodoReminderInput = {
  title: string;
  dueAt?: string;
  language?: UserLanguagePreference;
};

async function ensurePermissionsAsync(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export const NotificationService = {
  async requestPermissionsAsync(): Promise<boolean> {
    return ensurePermissionsAsync();
  },

  async scheduleHabitReminderAsync({
    habitName,
    language = 'en',
    reminderTime,
  }: ScheduleHabitReminderInput): Promise<string | undefined> {
    const time = parseReminderTime(reminderTime);
    if (!time || !(await ensurePermissionsAsync())) {
      return undefined;
    }

    return Notifications.scheduleNotificationAsync({
      content: {
        title: 'Done Loop',
        body: translations[language].notifications.habitBody.replace('{{habitName}}', habitName),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.hour,
        minute: time.minute,
      },
    });
  },

  async scheduleTodoReminderAsync({
    title,
    dueAt,
    language = 'en',
  }: ScheduleTodoReminderInput): Promise<string | undefined> {
    if (!dueAt || !(await ensurePermissionsAsync())) {
      return undefined;
    }

    const dueDate = dateKeyToLocalDate(dueAt);
    if (!dueDate) {
      return undefined;
    }

    dueDate.setHours(9, 0, 0, 0);

    if (dueDate.getTime() <= Date.now()) {
      return undefined;
    }

    return Notifications.scheduleNotificationAsync({
      content: {
        title: translations[language].notifications.todoTitle,
        body: title,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dueDate,
      },
    });
  },

  async cancelAsync(notificationId?: string): Promise<void> {
    if (!notificationId) {
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  async cancelAllAsync(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
