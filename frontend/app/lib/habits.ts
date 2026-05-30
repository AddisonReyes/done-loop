import type { Habit } from "./types";

export function clampLevel(value: number) {
  if (value < 0) return 0;
  if (value > 4) return 4;
  return value;
}

export function percentToLevel(progress: number) {
  if (progress <= 0) return 0;
  if (progress < 0.25) return 1;
  if (progress < 0.5) return 2;
  if (progress < 0.75) return 3;
  return 4;
}

export function habitsToLevel(habits: Habit[]) {
  if (habits.length === 0) return 0;

  const completedCount = habits.reduce(
    (total, habit) => total + (habit.done ? 1 : 0),
    0,
  );

  return percentToLevel(completedCount / habits.length);
}

export function levelClass(level: number) {
  switch (clampLevel(level)) {
    case 0:
      return "bg-zinc-800/90 border-zinc-700/70";
    case 1:
      return "bg-purple-950/80 border-purple-900/55";
    case 2:
      return "bg-purple-900/75 border-purple-800/60";
    case 3:
      return "bg-purple-700/85 border-purple-600/70";
    case 4:
      return "bg-purple-500 border-purple-400/75";
    default:
      return "bg-zinc-800/90 border-zinc-700/70";
  }
}

export function levelLabel(level: number) {
  switch (clampLevel(level)) {
    case 0:
      return "Missed";
    case 1:
      return "Started";
    case 2:
      return "Partial";
    case 3:
      return "Strong";
    case 4:
      return "Complete";
    default:
      return "Missed";
  }
}
