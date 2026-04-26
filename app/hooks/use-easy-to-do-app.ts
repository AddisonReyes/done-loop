"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createMonthDays,
  dateKey,
  formatLongDate,
  formatMonthLabel,
  monthKey,
  parseDateKey,
} from "../lib/date";
import { habitsToLevel } from "../lib/habits";
import { createId, initFromStorage, persistAppState } from "../lib/storage";
import type { AppState, BootState, Habit, HistoryDay } from "../lib/types";

function createBootState(): BootState {
  const today = new Date();
  return {
    todayKey: dateKey(today),
    monthKey: monthKey(today),
  };
}

function buildHistoryDays(
  monthDays: string[],
  todayKey: string,
  todayLevel: number,
  appState: AppState,
) {
  return monthDays.map((key) => {
    const level = key === todayKey ? todayLevel : appState.history.levels[key] ?? 0;
    const date = parseDateKey(key);

    return {
      key,
      label: formatLongDate(key),
      level,
      dayNumber: date.getDate(),
      weekDay: date.getDay(),
      isToday: key === todayKey,
    } satisfies HistoryDay;
  });
}

function groupHistoryWeeks(historyDays: HistoryDay[]) {
  return historyDays.reduce<HistoryDay[][]>((weeks, day) => {
    const currentWeek = weeks[weeks.length - 1];

    if (!currentWeek || day.weekDay === 0) {
      weeks.push([day]);
      return weeks;
    }

    currentWeek.push(day);
    return weeks;
  }, []);
}

export function useEasyToDoApp() {
  const [mounted, setMounted] = useState(false);
  const [boot] = useState(createBootState);
  const [appState, setAppState] = useState<AppState>(() =>
    initFromStorage(boot.todayKey, boot.monthKey),
  );
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitTitle, setEditingHabitTitle] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [inspectedHistoryKey, setInspectedHistoryKey] = useState<string | null>(null);

  useEffect(() => {
    // We intentionally render a deterministic shell first to avoid hydration
    // mismatches (localStorage + current date influence initial state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    persistAppState(appState);
  }, [appState]);

  const todayKey = boot.todayKey;
  const currentMonthKey = boot.monthKey;

  const monthDays = useMemo(
    () => createMonthDays(currentMonthKey),
    [currentMonthKey],
  );

  const todayLevel = useMemo(
    () => habitsToLevel(appState.habits),
    [appState.habits],
  );

  const completedHabits = appState.habits.filter((habit) => habit.done).length;
  const totalHabits = appState.habits.length;
  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const historyDays = useMemo(
    () => buildHistoryDays(monthDays, todayKey, todayLevel, appState),
    [appState, monthDays, todayKey, todayLevel],
  );

  const historyWeeks = useMemo(
    () => groupHistoryWeeks(historyDays),
    [historyDays],
  );

  const activeDays = historyDays.filter((day) => day.level > 0).length;
  const consistencyRate =
    monthDays.length === 0 ? 0 : Math.round((activeDays / monthDays.length) * 100);

  const displayedHistoryDay =
    historyDays.find((day) => day.key === (inspectedHistoryKey ?? todayKey)) ??
    historyDays[historyDays.length - 1] ??
    null;

  const monthLabel = formatMonthLabel(currentMonthKey);

  function addHabit() {
    const title = newHabitTitle.trim();
    if (!title) return;

    setAppState((current) => ({
      ...current,
      habits: [...current.habits, { id: createId(), title, done: false }],
    }));
    setNewHabitTitle("");
  }

  function toggleHabit(habitId: string) {
    setAppState((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === habitId ? { ...habit, done: !habit.done } : habit,
      ),
    }));
  }

  function startEditHabit(habit: Habit) {
    setEditingHabitId(habit.id);
    setEditingHabitTitle(habit.title);
  }

  function saveEditHabit() {
    if (!editingHabitId) return;

    const title = editingHabitTitle.trim();
    if (!title) return;

    setAppState((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === editingHabitId ? { ...habit, title } : habit,
      ),
    }));

    setEditingHabitId(null);
    setEditingHabitTitle("");
  }

  function cancelEditHabit() {
    setEditingHabitId(null);
    setEditingHabitTitle("");
  }

  function deleteHabit(habitId: string) {
    setAppState((current) => ({
      ...current,
      habits: current.habits.filter((habit) => habit.id !== habitId),
    }));
  }

  function addTodo() {
    const text = newTodoText.trim();
    if (!text) return;

    setAppState((current) => ({
      ...current,
      todos: [...current.todos, { id: createId(), text }],
    }));
    setNewTodoText("");
  }

  function deleteTodo(todoId: string) {
    setAppState((current) => ({
      ...current,
      todos: current.todos.filter((todo) => todo.id !== todoId),
    }));
  }

  return {
    mounted,
    currentMonthKey,
    monthLabel,
    habits: appState.habits,
    todos: appState.todos,
    completionRate,
    activeDays,
    consistencyRate,
    completedHabits,
    totalHabits,
    todayLevel,
    monthDays,
    historyWeeks,
    displayedHistoryDay,
    newHabitTitle,
    setNewHabitTitle,
    editingHabitId,
    editingHabitTitle,
    setEditingHabitTitle,
    newTodoText,
    setNewTodoText,
    setInspectedHistoryKey,
    addHabit,
    toggleHabit,
    startEditHabit,
    saveEditHabit,
    cancelEditHabit,
    deleteHabit,
    addTodo,
    deleteTodo,
  };
}
