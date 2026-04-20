"use client";

import { useEffect, useMemo, useState } from "react";

type Habit = {
  id: string;
  title: string;
  done: boolean;
};

type TodoItem = {
  id: string;
  text: string;
};

type HabitHistory = {
  monthKey: string; // YYYY-MM
  levels: Record<string, number>; // YYYY-MM-DD -> 0..4
};

type AppState = {
  habits: Habit[];
  todos: TodoItem[];
  history: HabitHistory;
  lastSeen: string; // YYYY-MM-DD
};

const LS = {
  habits: "easyToDo.habits",
  todos: "easyToDo.todos",
  history: "easyToDo.habitHistory",
  lastSeen: "easyToDo.lastSeen",
} as const;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map((x) => Number(x));
  return new Date(y, m - 1, d);
}

function addDays(d: Date, days: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function clampLevel(n: number) {
  if (n < 0) return 0;
  if (n > 4) return 4;
  return n;
}

function percentToLevel(p: number) {
  if (p <= 0) return 0;
  if (p < 0.25) return 1;
  if (p < 0.5) return 2;
  if (p < 0.75) return 3;
  return 4;
}

function habitsToLevel(habits: Habit[]) {
  if (habits.length === 0) return 0;
  const done = habits.reduce((acc, h) => acc + (h.done ? 1 : 0), 0);
  return percentToLevel(done / habits.length);
}

function newId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

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
    // ignore
  }
}

function initFromStorage(todayKey: string, currentMonthKey: string): AppState {
  const storedHabits = safeJsonParse<Habit[]>(lsGet(LS.habits)) ?? [];
  const storedTodos = safeJsonParse<TodoItem[]>(lsGet(LS.todos)) ?? [];
  const storedHistory = safeJsonParse<HabitHistory>(lsGet(LS.history));
  const storedLastSeen = safeJsonParse<string>(lsGet(LS.lastSeen)) ?? todayKey;

  const baseHistory: HabitHistory =
    storedHistory && typeof storedHistory.monthKey === "string" && storedHistory.levels
      ? storedHistory
      : { monthKey: currentMonthKey, levels: {} };

  // Reset history at month boundary (habits persist).
  let nextHistory: HabitHistory =
    baseHistory.monthKey === currentMonthKey
      ? baseHistory
      : { monthKey: currentMonthKey, levels: {} };

  let nextHabits = storedHabits;
  let nextLastSeen = storedLastSeen;

  if (storedLastSeen !== todayKey) {
    const firstOfMonth = parseDateKey(`${currentMonthKey}-01`);
    const yesterday = addDays(parseDateKey(todayKey), -1);

    // If lastSeen is within the current month, record its completion level.
    if (monthKey(parseDateKey(storedLastSeen)) === currentMonthKey) {
      nextHistory = {
        ...nextHistory,
        levels: {
          ...nextHistory.levels,
          [storedLastSeen]: habitsToLevel(nextHabits),
        },
      };
    }

    // Fill skipped days in this month as empty (0).
    const start = (() => {
      const dayAfterLastSeen = addDays(parseDateKey(storedLastSeen), 1);
      return dayAfterLastSeen < firstOfMonth ? firstOfMonth : dayAfterLastSeen;
    })();

    if (start <= yesterday) {
      const filled: Record<string, number> = { ...nextHistory.levels };
      for (let d = start; d <= yesterday; d = addDays(d, 1)) {
        const k = dateKey(d);
        if (monthKey(d) !== currentMonthKey) continue;
        if (filled[k] == null) filled[k] = 0;
      }
      nextHistory = { ...nextHistory, levels: filled };
    }

    // Daily reset: habits become undone for today.
    nextHabits = nextHabits.map((h) => ({ ...h, done: false }));
    nextLastSeen = todayKey;
  }

  return {
    habits: nextHabits,
    todos: storedTodos,
    history: nextHistory,
    lastSeen: nextLastSeen,
  };
}

function levelClass(level: number) {
  const l = clampLevel(level);
  switch (l) {
    case 0:
      return "bg-zinc-200 border-zinc-300 dark:bg-zinc-800/80 dark:border-zinc-700/60";
    case 1:
      return "bg-purple-100 border-purple-200 dark:bg-purple-950/70 dark:border-purple-900/50";
    case 2:
      return "bg-purple-200 border-purple-300 dark:bg-purple-900/70 dark:border-purple-800/50";
    case 3:
      return "bg-purple-300 border-purple-400 dark:bg-purple-700/80 dark:border-purple-600/60";
    case 4:
      return "bg-purple-400 border-purple-500 dark:bg-purple-500 dark:border-purple-400/70";
    default:
      return "bg-zinc-200 border-zinc-300 dark:bg-zinc-800/80 dark:border-zinc-700/60";
  }
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // We intentionally render a deterministic shell first to avoid hydration
    // mismatches (localStorage + current date influence initial state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [boot] = useState(() => {
    const d = new Date();
    return { todayKey: dateKey(d), monthKey: monthKey(d) };
  });

  const todayKey = boot.todayKey;
  const currentMonthKey = boot.monthKey;

  const [app, setApp] = useState<AppState>(() =>
    initFromStorage(boot.todayKey, boot.monthKey),
  );

  const { habits, todos, history, lastSeen } = app;

  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitTitle, setEditingHabitTitle] = useState("");

  const [newTodoText, setNewTodoText] = useState("");

  useEffect(() => {
    lsSet(LS.habits, JSON.stringify(habits));
    lsSet(LS.todos, JSON.stringify(todos));
    lsSet(LS.history, JSON.stringify(history));
    lsSet(LS.lastSeen, JSON.stringify(lastSeen));
  }, [habits, todos, history, lastSeen]);

  const monthDays = useMemo(() => {
    const [y, m] = currentMonthKey.split("-").map((x) => Number(x));
    const count = new Date(y, m, 0).getDate();
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(y, m - 1, i + 1);
      return dateKey(d);
    });
  }, [currentMonthKey]);

  const todayLevel = habitsToLevel(habits);

  function addHabit() {
    const title = newHabitTitle.trim();
    if (!title) return;
    setApp((prev) => ({
      ...prev,
      habits: [...prev.habits, { id: newId(), title, done: false }],
    }));
    setNewHabitTitle("");
  }

  function startEditHabit(h: Habit) {
    setEditingHabitId(h.id);
    setEditingHabitTitle(h.title);
  }

  function saveEditHabit() {
    if (!editingHabitId) return;
    const title = editingHabitTitle.trim();
    if (!title) return;
    setApp((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === editingHabitId ? { ...h, title } : h,
      ),
    }));
    setEditingHabitId(null);
    setEditingHabitTitle("");
  }

  function cancelEditHabit() {
    setEditingHabitId(null);
    setEditingHabitTitle("");
  }

  function addTodo() {
    const text = newTodoText.trim();
    if (!text) return;
    setApp((prev) => ({
      ...prev,
      todos: [...prev.todos, { id: newId(), text }],
    }));
    setNewTodoText("");
  }

  // Avoid hydration mismatches: the app state is derived from local-only inputs
  // (localStorage + current date), so we only render the real UI after mount.
  if (!mounted) {
    return (
      <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="w-full border-b border-zinc-200/70 dark:border-zinc-800/70">
          <div className="mx-auto w-full max-w-5xl px-4 py-4 flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold tracking-tight">EasyToDo</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Local habit tracker + todo list
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            Loading...
          </div>
        </main>

        <footer className="w-full border-t border-zinc-200/70 text-xs text-zinc-500 dark:border-zinc-800/70 dark:text-zinc-400">
          <div className="mx-auto w-full max-w-5xl px-4 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                Copyright (c) {new Date().getFullYear()} EasyToDo. All rights
                reserved.
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <div>Stored locally in your browser.</div>
                <a
                  href="https://addisonreyes.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-purple-700 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Made by Addison Reyes
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="w-full border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">EasyToDo</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Habits reset daily. Todos disappear when completed.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Habit History</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Current month only.
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {currentMonthKey}
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="max-w-full overflow-x-auto">
              <div className="mx-auto w-fit flex gap-1 pb-1">
                {monthDays.map((k) => {
                  const level =
                    k === todayKey ? todayLevel : history.levels[k] ?? 0;
                  return (
                    <div
                      key={k}
                      title={k}
                      className={`h-4 w-4 shrink-0 rounded-[4px] border ${levelClass(
                        level,
                      )}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Habit Tracker</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Check habits for today. They reset when you come back tomorrow.
                </p>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {currentMonthKey}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addHabit();
                }}
                placeholder="Add a habit (e.g. Read 10 min)"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/70 dark:border-zinc-800 dark:bg-zinc-950"
              />
              <button
                type="button"
                onClick={addHabit}
                className="h-10 shrink-0 rounded-lg bg-purple-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/70"
              >
                Add
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {habits.length === 0 ? (
                <li className="rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                  No habits yet.
                </li>
              ) : null}

              {habits.map((h) => {
                const isEditing = editingHabitId === h.id;
                return (
                  <li
                    key={h.id}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    {isEditing ? (
                      <div className="min-w-0 flex-1">
                        <input
                          value={editingHabitTitle}
                          onChange={(e) => setEditingHabitTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditHabit();
                            if (e.key === "Escape") cancelEditHabit();
                          }}
                          className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/70 dark:border-zinc-800 dark:bg-zinc-900"
                          aria-label="Edit habit title"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setApp((prev) => ({
                            ...prev,
                            habits: prev.habits.map((x) =>
                              x.id === h.id ? { ...x, done: !x.done } : x,
                            ),
                          }));
                        }}
                        aria-pressed={h.done}
                        aria-label={`Toggle ${h.title}`}
                        className="group -mx-1 -my-1 flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-1 text-left focus:outline-none focus:ring-2 focus:ring-purple-500/70"
                      >
                        <span
                          aria-hidden
                          className={`h-5 w-5 shrink-0 rounded-md border transition-colors ${
                            h.done
                              ? "border-purple-500 bg-purple-600"
                              : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                          }`}
                        />
                        <span
                          className={`min-w-0 truncate text-sm ${
                            h.done
                              ? "text-zinc-500 line-through dark:text-zinc-400"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {h.title}
                        </span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEditHabit}
                            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditHabit}
                            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditHabit(h)}
                          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setApp((prev) => ({
                            ...prev,
                            habits: prev.habits.filter((x) => x.id !== h.id),
                          }))
                        }
                        className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <h2 className="text-base font-semibold">Todo</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Completing an item deletes it.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTodo();
                }}
                placeholder="Add a todo"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/70 dark:border-zinc-800 dark:bg-zinc-950"
              />
              <button
                type="button"
                onClick={addTodo}
                className="h-10 shrink-0 rounded-lg bg-purple-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/70"
              >
                Add
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {todos.length === 0 ? (
                <li className="rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                  No todos.
                </li>
              ) : null}

              {todos.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="min-w-0 flex-1 truncate text-sm">{t.text}</div>
                  <button
                    type="button"
                    onClick={() =>
                      setApp((prev) => ({
                        ...prev,
                        todos: prev.todos.filter((x) => x.id !== t.id),
                      }))
                    }
                    className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/70"
                  >
                    Done
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="w-full border-t border-zinc-200/70 text-xs text-zinc-500 dark:border-zinc-800/70 dark:text-zinc-400">
        <div className="mx-auto w-full max-w-5xl px-4 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              Copyright (c) {new Date().getFullYear()} EasyToDo. All rights
              reserved.
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <div>Stored locally in your browser.</div>
              <a
                href="https://addisonreyes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple-700 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Made by Addison Reyes
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
