import { addDays, dateKey, monthKey, parseDateKey } from "./date";
import { habitsToLevel } from "./habits";
import type { AppState, Habit, HabitHistory, TodoItem } from "./types";

const STORAGE_KEYS = {
  habits: "easyToDo.habits",
  todos: "easyToDo.todos",
  history: "easyToDo.habitHistory",
  lastSeen: "easyToDo.lastSeen",
} as const;

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function lsGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore write errors in private/incognito modes
  }
}

function resolveStoredHistory(currentMonthKey: string, storedHistory: HabitHistory | null) {
  const baseHistory: HabitHistory =
    storedHistory &&
    typeof storedHistory.monthKey === "string" &&
    typeof storedHistory.levels === "object"
      ? storedHistory
      : { monthKey: currentMonthKey, levels: {} };

  return baseHistory.monthKey === currentMonthKey
    ? baseHistory
    : { monthKey: currentMonthKey, levels: {} };
}

function fillSkippedHistoryDays(
  currentMonthKey: string,
  todayKey: string,
  lastSeenKey: string,
  history: HabitHistory,
) {
  const firstOfMonth = parseDateKey(`${currentMonthKey}-01`);
  const yesterday = addDays(parseDateKey(todayKey), -1);
  const dayAfterLastSeen = addDays(parseDateKey(lastSeenKey), 1);
  const start = dayAfterLastSeen < firstOfMonth ? firstOfMonth : dayAfterLastSeen;

  if (start > yesterday) {
    return history;
  }

  const filledLevels: Record<string, number> = { ...history.levels };

  for (let date = start; date <= yesterday; date = addDays(date, 1)) {
    if (monthKey(date) !== currentMonthKey) continue;

    const key = dateKey(date);
    if (filledLevels[key] == null) {
      filledLevels[key] = 0;
    }
  }

  return { ...history, levels: filledLevels };
}

export function createId() {
  try {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }
  } catch {
    // ignore
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function initFromStorage(todayKey: string, currentMonthKey: string): AppState {
  const storedHabits = safeJsonParse<Habit[]>(lsGet(STORAGE_KEYS.habits)) ?? [];
  const storedTodos = safeJsonParse<TodoItem[]>(lsGet(STORAGE_KEYS.todos)) ?? [];
  const storedHistory = safeJsonParse<HabitHistory>(lsGet(STORAGE_KEYS.history));
  const storedLastSeen =
    safeJsonParse<string>(lsGet(STORAGE_KEYS.lastSeen)) ?? todayKey;

  let nextHabits = storedHabits;
  let nextLastSeen = storedLastSeen;
  let nextHistory = resolveStoredHistory(currentMonthKey, storedHistory);

  if (storedLastSeen !== todayKey) {
    if (monthKey(parseDateKey(storedLastSeen)) === currentMonthKey) {
      nextHistory = {
        ...nextHistory,
        levels: {
          ...nextHistory.levels,
          [storedLastSeen]: habitsToLevel(nextHabits),
        },
      };
    }

    nextHistory = fillSkippedHistoryDays(
      currentMonthKey,
      todayKey,
      storedLastSeen,
      nextHistory,
    );

    nextHabits = nextHabits.map((habit) => ({ ...habit, done: false }));
    nextLastSeen = todayKey;
  }

  return {
    habits: nextHabits,
    todos: storedTodos,
    history: nextHistory,
    lastSeen: nextLastSeen,
  };
}

export function persistAppState(appState: AppState) {
  lsSet(STORAGE_KEYS.habits, JSON.stringify(appState.habits));
  lsSet(STORAGE_KEYS.todos, JSON.stringify(appState.todos));
  lsSet(STORAGE_KEYS.history, JSON.stringify(appState.history));
  lsSet(STORAGE_KEYS.lastSeen, JSON.stringify(appState.lastSeen));
}
