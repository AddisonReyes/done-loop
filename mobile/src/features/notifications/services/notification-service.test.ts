import {
  NotificationService,
  resetNotificationModuleLoaderForTests,
  setNotificationModuleLoaderForTests,
} from './notification-service';
import type { Habit } from '@/features/habits/types';

type NotificationsModule = typeof import('expo-notifications');

jest.mock('@/features/habits/repositories', () => ({
  HabitCompletionRepository: {
    findByHabitAndDate: jest.fn(),
    upsert: jest.fn(),
  },
  HabitRepository: {
    findById: jest.fn(),
    update: jest.fn(),
  },
}));

const habit: Habit = {
  id: 'habit_1',
  name: 'Read',
  recurrenceType: 'daily',
  reminderTime: '08:15',
  remindersEnabled: true,
  isActive: true,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

function createNotificationsModule(): NotificationsModule {
  return {
    SchedulableTriggerInputTypes: {
      DATE: 'date',
      TIME_INTERVAL: 'timeInterval',
    },
    addNotificationResponseReceivedListener: jest.fn(),
    cancelScheduledNotificationAsync: jest.fn(),
    cancelAllScheduledNotificationsAsync: jest.fn(),
    dismissNotificationAsync: jest.fn(),
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    scheduleNotificationAsync: jest.fn(),
    setNotificationCategoryAsync: jest.fn(),
    setNotificationHandler: jest.fn(),
  } as unknown as NotificationsModule;
}

describe('NotificationService', () => {
  let notifications: NotificationsModule;

  beforeEach(() => {
    jest.clearAllMocks();
    const { HabitCompletionRepository } = jest.requireMock('@/features/habits/repositories') as {
      HabitCompletionRepository: { findByHabitAndDate: jest.Mock };
    };
    HabitCompletionRepository.findByHabitAndDate.mockResolvedValue(null);
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-02T07:00:00.000Z'));
    notifications = createNotificationsModule();
    setNotificationModuleLoaderForTests(async () => notifications);
  });

  afterEach(() => {
    jest.useRealTimers();
    resetNotificationModuleLoaderForTests();
  });

  it('does not schedule todo reminders without a due date', async () => {
    await expect(NotificationService.scheduleTodoReminderAsync({ title: 'Pay rent' })).resolves.toBeUndefined();
    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('does not crash or schedule when notifications are unavailable', async () => {
    setNotificationModuleLoaderForTests(async () => null);

    await expect(
      NotificationService.scheduleHabitReminderAsync({
        habit,
      })
    ).resolves.toBeUndefined();
    await expect(NotificationService.requestPermissionsAsync()).resolves.toBe(false);
    await expect(NotificationService.cancelAllAsync()).resolves.toBeUndefined();
  });

  it('does not schedule todo reminders for past dates', async () => {
    jest.mocked(notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as Awaited<
      ReturnType<NotificationsModule['getPermissionsAsync']>
    >);

    await expect(
      NotificationService.scheduleTodoReminderAsync({ title: 'Old', dueAt: '2000-01-01' })
    ).resolves.toBeUndefined();
    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('schedules habit reminders only when permissions and time are valid', async () => {
    jest.mocked(notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as Awaited<
      ReturnType<NotificationsModule['getPermissionsAsync']>
    >);
    jest.mocked(notifications.scheduleNotificationAsync).mockResolvedValue('notification-id');

    await expect(
      NotificationService.scheduleHabitReminderAsync({
        habit,
      })
    ).resolves.toBe('notification-id');

    expect(notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          categoryIdentifier: 'habit_reminder',
          data: expect.objectContaining({ habitId: 'habit_1' }),
        }),
        trigger: expect.objectContaining({ date: expect.any(Date) }),
      })
    );
  });

  it('does not schedule habit reminders for a completed day', async () => {
    const { HabitCompletionRepository } = jest.requireMock('@/features/habits/repositories') as {
      HabitCompletionRepository: { findByHabitAndDate: jest.Mock };
    };
    jest.mocked(notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as Awaited<
      ReturnType<NotificationsModule['getPermissionsAsync']>
    >);
    HabitCompletionRepository.findByHabitAndDate.mockResolvedValue({
      habitId: 'habit_1',
      date: '2026-06-02',
      completed: true,
    });

    await expect(NotificationService.scheduleHabitReminderAsync({ habit })).resolves.toBeUndefined();

    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('schedules habit reminders for the next valid date when today has passed', async () => {
    jest.setSystemTime(new Date(2026, 5, 2, 10, 0, 0, 0));
    jest.mocked(notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as Awaited<
      ReturnType<NotificationsModule['getPermissionsAsync']>
    >);
    jest.mocked(notifications.scheduleNotificationAsync).mockResolvedValue('next-notification-id');

    await expect(NotificationService.scheduleHabitReminderAsync({ habit })).resolves.toBe('next-notification-id');

    expect(notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({
          date: new Date(2026, 5, 3, 8, 15, 0, 0),
        }),
      })
    );
  });

  it('schedules snoozed habit reminders for 30 minutes', async () => {
    jest.mocked(notifications.getPermissionsAsync).mockResolvedValue({ granted: true } as Awaited<
      ReturnType<NotificationsModule['getPermissionsAsync']>
    >);
    jest.mocked(notifications.scheduleNotificationAsync).mockResolvedValue('snooze-id');

    await expect(NotificationService.scheduleHabitSnoozeReminderAsync({ habit })).resolves.toBe('snooze-id');

    expect(notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: {
          type: 'timeInterval',
          seconds: 1800,
        },
      })
    );
  });

  it('requests permissions at the point of need', async () => {
    jest.mocked(notifications.getPermissionsAsync).mockResolvedValue({ granted: false } as Awaited<
      ReturnType<NotificationsModule['getPermissionsAsync']>
    >);
    jest.mocked(notifications.requestPermissionsAsync).mockResolvedValue({ granted: false } as Awaited<
      ReturnType<NotificationsModule['requestPermissionsAsync']>
    >);

    await expect(
      NotificationService.scheduleHabitReminderAsync({
        habit,
      })
    ).resolves.toBeUndefined();

    expect(notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('configures foreground notification presentation when available', async () => {
    await expect(NotificationService.configureForegroundHandlingAsync()).resolves.toBe(true);

    expect(notifications.setNotificationHandler).toHaveBeenCalledWith({
      handleNotification: expect.any(Function),
    });
    expect(notifications.setNotificationCategoryAsync).toHaveBeenCalledWith('habit_reminder', [
      expect.objectContaining({ identifier: 'mark_habit_complete', buttonTitle: 'Mark complete' }),
      expect.objectContaining({ identifier: 'remind_habit_in_30_minutes', buttonTitle: 'Remind in 30 minutes' }),
    ]);
  });
});
