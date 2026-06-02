import Constants, { AppOwnership } from 'expo-constants';
import { router } from 'expo-router';

import { HabitCompletionRepository, HabitRepository } from '@/features/habits/repositories';
import { getHabitsDueOnDate } from '@/features/habits/services/habit-recurrence';
import type { Habit } from '@/features/habits/types';
import type { UserLanguagePreference } from '@/features/settings/types';
import { translations } from '@/i18n/translations';
import { emitAppEvent } from '@/shared/events/app-events';
import { dateKeyToLocalDate, toDateKey } from '@/shared/utils/date';
import { parseReminderTime } from './reminder-time';

type NotificationsModule = typeof import('expo-notifications');
type NotificationsModuleLoader = () => Promise<NotificationsModule | null>;

type ScheduleHabitReminderInput = {
  habit: Habit;
  fromDate?: Date;
  language?: UserLanguagePreference;
  skipDateKeys?: string[];
};

type ScheduleTodoReminderInput = {
  title: string;
  dueAt?: string;
  language?: UserLanguagePreference;
};

const habitReminderCategoryId = 'habit_reminder';
const markHabitCompleteActionId = 'mark_habit_complete';
const remindHabitIn30MinutesActionId = 'remind_habit_in_30_minutes';
const habitReminderLookaheadDays = 370;

let notificationsModuleLoader: NotificationsModuleLoader = () => import('expo-notifications');
let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;
let notificationResponseSubscription: { remove: () => void } | null = null;

async function getNotificationsModuleAsync(): Promise<NotificationsModule | null> {
  if (Constants.appOwnership === AppOwnership.Expo) {
    return null;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = notificationsModuleLoader().catch(() => null);
  }

  return notificationsModulePromise;
}

async function ensurePermissionsAsync(): Promise<boolean> {
  const notifications = await getNotificationsModuleAsync();
  if (!notifications) {
    return false;
  }

  const existing = await notifications.getPermissionsAsync();
  if (existing.granted) {
    return true;
  }

  const requested = await notifications.requestPermissionsAsync();
  return requested.granted;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

async function isHabitCompletedOnDate(habitId: string, dateKey: string): Promise<boolean> {
  const completion = await HabitCompletionRepository.findByHabitAndDate(habitId, dateKey);
  return completion?.completed ?? false;
}

async function findNextHabitReminderDateAsync(
  habit: Habit,
  reminderTime: NonNullable<ReturnType<typeof parseReminderTime>>,
  fromDate: Date,
  skipDateKeys: Set<string>
): Promise<Date | null> {
  for (let offset = 0; offset <= habitReminderLookaheadDays; offset += 1) {
    const candidate = addDays(fromDate, offset);
    const dateKey = toDateKey(candidate);

    if (skipDateKeys.has(dateKey) || getHabitsDueOnDate([habit], dateKey).length === 0) {
      continue;
    }

    const reminderDate = new Date(candidate);
    reminderDate.setHours(reminderTime.hour, reminderTime.minute, 0, 0);

    if (reminderDate.getTime() <= Date.now() || (await isHabitCompletedOnDate(habit.id, dateKey))) {
      continue;
    }

    return reminderDate;
  }

  return null;
}

async function configureHabitReminderCategoryAsync(
  notifications: NotificationsModule,
  language: UserLanguagePreference
): Promise<void> {
  if (!('setNotificationCategoryAsync' in notifications)) {
    return;
  }

  await notifications.setNotificationCategoryAsync(habitReminderCategoryId, [
    {
      identifier: markHabitCompleteActionId,
      buttonTitle: translations[language].notifications.markHabitComplete,
    },
    {
      identifier: remindHabitIn30MinutesActionId,
      buttonTitle: translations[language].notifications.remindIn30Minutes,
    },
  ]);
}

function getHabitNotificationData(habitId: string, language: UserLanguagePreference) {
  return {
    type: 'habit_reminder',
    habitId,
    language,
  };
}

function getHabitIdFromResponse(response: Parameters<NotificationsModule['addNotificationResponseReceivedListener']>[0] extends (value: infer Response) => unknown ? Response : never): string | null {
  const data = response.notification.request.content.data;
  const habitId = data?.habitId;
  return typeof habitId === 'string' ? habitId : null;
}

function getLanguageFromResponse(
  response: Parameters<NotificationsModule['addNotificationResponseReceivedListener']>[0] extends (value: infer Response) => unknown ? Response : never
): UserLanguagePreference {
  const data = response.notification.request.content.data;
  return data?.language === 'es' ? 'es' : 'en';
}

async function dismissNotificationAsync(
  notifications: NotificationsModule,
  notificationId: string
): Promise<void> {
  if ('dismissNotificationAsync' in notifications) {
    await notifications.dismissNotificationAsync(notificationId);
  }
}

async function handleHabitCompletionActionAsync(
  notifications: NotificationsModule,
  habitId: string,
  notificationId: string,
  language: UserLanguagePreference
): Promise<void> {
  const habit = await HabitRepository.findById(habitId);
  const todayKey = toDateKey(new Date());

  if (!habit || getHabitsDueOnDate([habit], todayKey).length === 0) {
    return;
  }

  await HabitCompletionRepository.upsert({
    habitId,
    date: todayKey,
    completed: true,
  });
  await dismissNotificationAsync(notifications, notificationId);
  const nextNotificationId = await NotificationService.scheduleHabitReminderAsync({
    habit,
    language,
    skipDateKeys: [todayKey],
  });
  await HabitRepository.update(habitId, { notificationId: nextNotificationId });
  emitAppEvent('habitsChanged');
}

async function handleHabitSnoozeActionAsync(
  notifications: NotificationsModule,
  habitId: string,
  notificationId: string,
  language: UserLanguagePreference
): Promise<void> {
  const habit = await HabitRepository.findById(habitId);
  const todayKey = toDateKey(new Date());

  if (
    !habit ||
    getHabitsDueOnDate([habit], todayKey).length === 0 ||
    (await isHabitCompletedOnDate(habitId, todayKey))
  ) {
    return;
  }

  const snoozeNotificationId = await NotificationService.scheduleHabitSnoozeReminderAsync({
    habit,
    language,
  });

  await dismissNotificationAsync(notifications, notificationId);

  if (snoozeNotificationId) {
    await HabitRepository.update(habitId, { notificationId: snoozeNotificationId });
  }
}

export const NotificationService = {
  async configureForegroundHandlingAsync(): Promise<boolean> {
    const notifications = await getNotificationsModuleAsync();
    if (!notifications) {
      return false;
    }

    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    await configureHabitReminderCategoryAsync(notifications, 'en');

    return true;
  },

  async configureResponseHandlingAsync(): Promise<boolean> {
    const notifications = await getNotificationsModuleAsync();
    if (!notifications || notificationResponseSubscription) {
      return !!notifications;
    }

    notificationResponseSubscription = notifications.addNotificationResponseReceivedListener((response) => {
      const habitId = getHabitIdFromResponse(response);
      const notificationId = response.notification.request.identifier;
      const language = getLanguageFromResponse(response);

      if (!habitId) {
        return;
      }

      if (response.actionIdentifier === markHabitCompleteActionId) {
        void handleHabitCompletionActionAsync(notifications, habitId, notificationId, language);
        return;
      }

      if (response.actionIdentifier === remindHabitIn30MinutesActionId) {
        void handleHabitSnoozeActionAsync(notifications, habitId, notificationId, language);
        return;
      }

      router.navigate('/habits');
    });

    return true;
  },

  async requestPermissionsAsync(): Promise<boolean> {
    return ensurePermissionsAsync();
  },

  async scheduleHabitReminderAsync({
    habit,
    language = 'en',
    fromDate = new Date(),
    skipDateKeys = [],
  }: ScheduleHabitReminderInput): Promise<string | undefined> {
    const notifications = await getNotificationsModuleAsync();
    if (!notifications) {
      return undefined;
    }

    const time = parseReminderTime(habit.reminderTime);
    if (!time || !(await ensurePermissionsAsync())) {
      return undefined;
    }

    await configureHabitReminderCategoryAsync(notifications, language);

    const reminderDate = await findNextHabitReminderDateAsync(
      habit,
      time,
      fromDate,
      new Set(skipDateKeys)
    );

    if (!reminderDate) {
      return undefined;
    }

    return notifications.scheduleNotificationAsync({
      content: {
        title: 'Done Loop',
        body: translations[language].notifications.habitBody.replace('{{habitName}}', habit.name),
        categoryIdentifier: habitReminderCategoryId,
        data: getHabitNotificationData(habit.id, language),
      },
      trigger: {
        type: notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });
  },

  async scheduleHabitSnoozeReminderAsync({
    habit,
    language = 'en',
  }: {
    habit: Habit;
    language?: UserLanguagePreference;
  }): Promise<string | undefined> {
    const notifications = await getNotificationsModuleAsync();
    if (!notifications || !(await ensurePermissionsAsync())) {
      return undefined;
    }

    await configureHabitReminderCategoryAsync(notifications, language);

    return notifications.scheduleNotificationAsync({
      content: {
        title: 'Done Loop',
        body: translations[language].notifications.habitBody.replace('{{habitName}}', habit.name),
        categoryIdentifier: habitReminderCategoryId,
        data: getHabitNotificationData(habit.id, language),
      },
      trigger: {
        type: notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 30 * 60,
      },
    });
  },

  async scheduleTodoReminderAsync({
    title,
    dueAt,
    language = 'en',
  }: ScheduleTodoReminderInput): Promise<string | undefined> {
    const notifications = await getNotificationsModuleAsync();
    if (!notifications || !dueAt || !(await ensurePermissionsAsync())) {
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

    return notifications.scheduleNotificationAsync({
      content: {
        title: translations[language].notifications.todoTitle,
        body: title,
      },
      trigger: {
        type: notifications.SchedulableTriggerInputTypes.DATE,
        date: dueDate,
      },
    });
  },

  async cancelAsync(notificationId?: string): Promise<void> {
    const notifications = await getNotificationsModuleAsync();
    if (!notifications || !notificationId) {
      return;
    }

    await notifications.cancelScheduledNotificationAsync(notificationId);
  },

  async cancelAllAsync(): Promise<void> {
    const notifications = await getNotificationsModuleAsync();
    if (!notifications) {
      return;
    }

    await notifications.cancelAllScheduledNotificationsAsync();
  },
};

export function setNotificationModuleLoaderForTests(loader: NotificationsModuleLoader): void {
  notificationsModuleLoader = loader;
  notificationsModulePromise = null;
}

export function resetNotificationModuleLoaderForTests(): void {
  notificationsModuleLoader = () => import('expo-notifications');
  notificationsModulePromise = null;
}
