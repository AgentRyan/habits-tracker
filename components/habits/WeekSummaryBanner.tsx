"use client";

import { Habit, HabitLog } from "@/types";
import { formatDate, isFuture } from "@/lib/utils/dateUtils";

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  weekDates: Date[];
}

export default function WeekSummaryBanner({ habits, logs, weekDates }: Props) {
  if (!habits.length) return null;

  const logMap = new Map(logs.map((l) => [`${l.date}_${l.habitId}`, l]));

  const pastDays = weekDates.filter((d) => !isFuture(d));
  const perfectDays = pastDays.filter((d) => {
    const dateStr = formatDate(d);
    return habits.every((h) => {
      const log = logMap.get(`${dateStr}_${h.id}`);
      if (!log) return false;
      if (h.type === "boolean") return log.completed;
      return (log.value ?? 0) >= (h.dailyGoal ?? 1);
    });
  });

  const allPerfect = perfectDays.length === 7;
  const allPastPerfect = pastDays.length > 0 && perfectDays.length === pastDays.length;

  let message = "";
  let color = "";

  if (allPerfect) {
    message = "Perfect week! 🔥";
    color = "text-accent";
  } else if (allPastPerfect && pastDays.length >= 4) {
    message = `${perfectDays.length}/7 days perfect — stay strong! 💪`;
    color = "text-accent";
  } else if (perfectDays.length >= 3) {
    message = `${perfectDays.length}/${pastDays.length} perfect days — build on it`;
    color = "text-accent-amber";
  } else if (perfectDays.length > 0) {
    message = `${perfectDays.length}/${pastDays.length} perfect day${perfectDays.length > 1 ? "s" : ""} — keep going`;
    color = "text-muted";
  } else if (pastDays.length > 0) {
    message = "Start strong — check off your first day";
    color = "text-muted";
  } else {
    return null;
  }

  return (
    <div className="mx-4 mb-2 px-4 py-3 bg-card rounded-2xl border border-border">
      <p className={`text-sm font-semibold text-center ${color}`}>{message}</p>

      {/* Day dots */}
      <div className="flex justify-center gap-1.5 mt-2">
        {weekDates.map((d, i) => {
          const dateStr = formatDate(d);
          const future = isFuture(d);
          const perfect =
            !future &&
            habits.every((h) => {
              const log = logMap.get(`${dateStr}_${h.id}`);
              if (!log) return false;
              if (h.type === "boolean") return log.completed;
              return (log.value ?? 0) >= (h.dailyGoal ?? 1);
            });
          const partial =
            !future &&
            !perfect &&
            habits.some((h) => {
              const log = logMap.get(`${dateStr}_${h.id}`);
              if (!log) return false;
              if (h.type === "boolean") return log.completed;
              return (log.value ?? 0) > 0;
            });

          return (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                future
                  ? "bg-border"
                  : perfect
                  ? "bg-accent"
                  : partial
                  ? "bg-accent-amber"
                  : "bg-border/60"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
