import { act, renderHook, waitFor } from '@testing-library/react-native';

import { HabitCompletionRepository, HabitRepository } from '@/features/habits/repositories';
import type { Habit, HabitCompletion } from '@/features/habits/types';
import { NotificationService } from '@/features/notifications/services/notification-service';
import { SettingsRepository } from '@/features/settings/repositories/settings-repository';
import { createTestTranslator as mockCreateTestTranslator } from '@/test/test-utils';

import { useHabits } from './use-habits';

jest.mock('@/features/habits/repositories', () => ({
  HabitCompletionRepository: {
    listByDateRange: jest.fn(),
    upsert: jest.fn(),
  },
  HabitRepository: {
    create: jest.fn(),
    deleteById: jest.fn(),
    findById: jest.fn(),
    listActive: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('@/features/notifications/services/notification-service', () => ({
  NotificationService: {
    cancelHabitRemindersAsync: jest.fn(),
    scheduleHabitReminderAsync: jest.fn(),
  },
}));

jest.mock('@/features/settings/repositories/settings-repository', () => ({
  SettingsRepository: {
    get: jest.fn(),
  },
}));

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    language: 'en',
    locale: 'en',
    t: mockCreateTestTranslator('en'),
  }),
}));

jest.mock('@/shared/hooks/use-current-date-key', () => ({
  useCurrentDateKey: () => '2026-06-03',
}));

const dailyHabit: Habit = {
  id: 'habit_1',
  name: 'Read',
  recurrenceType: 'daily',
  reminderTime: '08:15',
  remindersEnabled: true,
  isActive: true,
  startDate: '2026-06-01',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

describe('useHabits', () => {
  let activeHabits: Habit[];
  let completions: HabitCompletion[];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    activeHabits = [];
    completions = [];
    jest.mocked(HabitRepository.listActive).mockImplementation(async () => activeHabits);
    jest.mocked(HabitRepository.findById).mockImplementation(async (id) => activeHabits.find((habit) => habit.id === id) ?? null);
    jest.mocked(HabitRepository.create).mockImplementation(async (input) => {
      const habit: Habit = {
        id: 'habit_created',
        name: input.name,
        description: input.description,
        recurrenceType: input.recurrenceType,
        customIntervalDays: input.customIntervalDays,
        weeklyDays: input.weeklyDays,
        monthlyDays: input.monthlyDays,
        reminderTime: input.reminderTime,
        remindersEnabled: input.remindersEnabled ?? false,
        isActive: input.isActive ?? true,
        startDate: input.startDate ?? '2026-06-03',
        createdAt: '2026-06-03T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
      };
      activeHabits = [habit, ...activeHabits];
      return habit;
    });
    jest.mocked(HabitRepository.update).mockImplementation(async (id, input) => {
      const existing = activeHabits.find((habit) => habit.id === id);
      if (!existing) {
        return null;
      }
      const next = { ...existing, ...input, updatedAt: '2026-06-03T12:00:00.000Z' };
      activeHabits = activeHabits.map((habit) => (habit.id === id ? next : habit));
      return next;
    });
    jest.mocked(HabitCompletionRepository.listByDateRange).mockImplementation(async () => completions);
    jest.mocked(HabitCompletionRepository.upsert).mockImplementation(async (input) => {
      const completion: HabitCompletion = {
        id: 'completion_1',
        habitId: input.habitId,
        date: input.date,
        completed: input.completed,
        createdAt: '2026-06-03T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
      };
      completions = [completion];
      return completion;
    });
    jest.mocked(SettingsRepository.get).mockResolvedValue({
      animationsEnabled: true,
      accentColor: 'purple',
      appBackground: 'none',
      dateFormat: 'dmy',
      language: 'en',
      notificationsEnabled: true,
      privacyPolicyUrl: 'https://done-loop.com/privacy',
      termsUrl: 'https://done-loop.pages.dev/terms',
      theme: 'system',
    });
    jest.mocked(NotificationService.cancelHabitRemindersAsync).mockResolvedValue(undefined);
    jest.mocked(NotificationService.scheduleHabitReminderAsync).mockResolvedValue('habit_notification');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  async function renderUseHabits() {
    const rendered = renderHook(() => useHabits());

    await act(async () => {
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });
    await waitFor(() => expect(rendered.result.current.isLoading).toBe(false));

    return rendered;
  }

  it('loads active habits and computes pending count for today', async () => {
    activeHabits = [dailyHabit];

    const { result } = await renderUseHabits();

    expect(result.current.habits).toEqual([dailyHabit]);
    expect(result.current.pendingCount).toBe(1);
    expect(result.current.totalCompletedToday).toBe(0);
  });

  it('creates a habit and stores the scheduled reminder id', async () => {
    const { result } = await renderUseHabits();

    await act(async () => {
      await expect(
        result.current.createHabitFromDraft({
          name: 'Read',
          recurrenceType: 'daily',
          reminderTime: '08:15',
          remindersEnabled: true,
        })
      ).resolves.toBe(true);
    });

    expect(HabitRepository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Read' }));
    expect(NotificationService.scheduleHabitReminderAsync).toHaveBeenCalledWith({
      habit: expect.objectContaining({ id: 'habit_created' }),
      language: 'en',
    });
    expect(HabitRepository.update).toHaveBeenCalledWith('habit_created', { notificationId: 'habit_notification' });
  });

  it('toggles today completion and skips today when rescheduling reminders', async () => {
    activeHabits = [dailyHabit];
    const { result } = await renderUseHabits();

    await act(async () => {
      await expect(result.current.toggleTodayCompletion('habit_1')).resolves.toBe(true);
    });

    expect(NotificationService.cancelHabitRemindersAsync).toHaveBeenCalledWith('habit_1', undefined);
    expect(HabitCompletionRepository.upsert).toHaveBeenCalledWith({
      habitId: 'habit_1',
      date: '2026-06-03',
      completed: true,
    });
    expect(NotificationService.scheduleHabitReminderAsync).toHaveBeenCalledWith({
      habit: dailyHabit,
      language: 'en',
      skipDateKeys: ['2026-06-03'],
    });
  });
});
