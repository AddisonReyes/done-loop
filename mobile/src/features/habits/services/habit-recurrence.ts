import type { Habit } from '@/features/habits/types';
import { dateKeyToUtcDayNumber, isDateKey, toDateKey } from '@/shared/utils/date';

function getHabitStartDateKey(habit: Habit): string | null {
  const createdAt = new Date(habit.createdAt);

  if (Number.isNaN(createdAt.getTime())) {
    return null;
  }

  return toDateKey(createdAt);
}

function getDayOfMonth(dateKey: string): number {
  return Number(dateKey.slice(8, 10));
}

function getLastDayOfMonth(dateKey: string): number {
  const [year, month] = dateKey.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

function getDaysSinceStart(habit: Habit, dateKey: string): number | null {
  const startDateKey = getHabitStartDateKey(habit);
  const startDay = startDateKey ? dateKeyToUtcDayNumber(startDateKey) : null;
  const targetDay = dateKeyToUtcDayNumber(dateKey);

  if (startDay === null || targetDay === null || targetDay < startDay) {
    return null;
  }

  return targetDay - startDay;
}

export function isHabitDueOnDate(habit: Habit, dateKey: string): boolean {
  if (!habit.isActive || habit.deletedAt || !isDateKey(dateKey)) {
    return false;
  }

  const daysSinceStart = getDaysSinceStart(habit, dateKey);
  if (daysSinceStart === null) {
    return false;
  }

  if (habit.recurrenceType === 'daily') {
    return true;
  }

  if (habit.recurrenceType === 'weekly') {
    return daysSinceStart % 7 === 0;
  }

  if (habit.recurrenceType === 'custom') {
    return !!habit.customIntervalDays && daysSinceStart % habit.customIntervalDays === 0;
  }

  const startDateKey = getHabitStartDateKey(habit);
  if (!startDateKey) {
    return false;
  }

  const startDayOfMonth = getDayOfMonth(startDateKey);
  const dueDayOfMonth = Math.min(startDayOfMonth, getLastDayOfMonth(dateKey));
  return getDayOfMonth(dateKey) === dueDayOfMonth;
}

export function getHabitsDueOnDate(habits: Habit[], dateKey: string): Habit[] {
  return habits.filter((habit) => isHabitDueOnDate(habit, dateKey));
}
