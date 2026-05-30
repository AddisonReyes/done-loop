export type Habit = {
  id: string;
  title: string;
  done: boolean;
};

export type TodoItem = {
  id: string;
  text: string;
};

export type HabitHistory = {
  monthKey: string; // YYYY-MM
  levels: Record<string, number>; // YYYY-MM-DD -> 0..4
};

export type AppState = {
  habits: Habit[];
  todos: TodoItem[];
  history: HabitHistory;
  lastSeen: string; // YYYY-MM-DD
};

export type BootState = {
  todayKey: string;
  monthKey: string;
};

export type HistoryDay = {
  key: string;
  label: string;
  level: number;
  dayNumber: number;
  weekDay: number;
  isToday: boolean;
};
