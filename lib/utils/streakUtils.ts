import { HabitLog, Habit } from "@/types";
import { formatDate } from "./dateUtils";

export function calculateStreak(
  habits: Habit[],
  logs: HabitLog[]
): { currentStreak: number; longestStreak: number; successRate: number } {
  if (!habits.length) return { currentStreak: 0, longestStreak: 0, successRate: 0 };

  const logMap = new Map<string, HabitLog>();
  logs.forEach((l) => logMap.set(`${l.date}_${l.habitId}`, l));

  function isDayComplete(dateStr: string): boolean {
    return habits.every((h) => {
      const log = logMap.get(`${dateStr}_${h.id}`);
      if (!log) return false;
      if (h.type === "boolean") return log.completed;
      return (log.value ?? 0) >= (h.dailyGoal ?? 1);
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let completeDays = 0;
  const totalDays = 30;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    const complete = isDayComplete(dateStr);

    if (complete) {
      completeDays++;
      if (i === 0 || currentStreak > 0) currentStreak++;
    } else {
      if (i === 0) currentStreak = 0;
      else currentStreak = 0;
    }
  }

  // Recalculate streak properly (consecutive from today backwards)
  currentStreak = 0;
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    if (isDayComplete(dateStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Longest streak in 30 days
  tempStreak = 0;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    if (isDayComplete(dateStr)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  const successRate = Math.round((completeDays / totalDays) * 100);

  return { currentStreak, longestStreak, successRate };
}

export function getChartData(
  habits: Habit[],
  logs: HabitLog[],
  days: number
): { date: string; rate: number }[] {
  if (!habits.length) return [];

  const logMap = new Map<string, HabitLog>();
  logs.forEach((l) => logMap.set(`${l.date}_${l.habitId}`, l));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const data: { date: string; rate: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);

    const completed = habits.filter((h) => {
      const log = logMap.get(`${dateStr}_${h.id}`);
      if (!log) return false;
      if (h.type === "boolean") return log.completed;
      return (log.value ?? 0) >= (h.dailyGoal ?? 1);
    }).length;

    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rate: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
    });
  }

  return data;
}
