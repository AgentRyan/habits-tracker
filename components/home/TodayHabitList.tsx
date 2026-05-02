"use client";

import { Habit, HabitLog } from "@/types";
import { today } from "@/lib/utils/dateUtils";
import { Check, Minus, Plus } from "lucide-react";

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  onToggleBoolean: (habitId: string, date: string, current: boolean) => void;
  onSetNumeric: (habitId: string, date: string, value: number, goal: number) => void;
}

export default function TodayHabitList({ habits, logs, onToggleBoolean, onSetNumeric }: Props) {
  const todayStr = today();
  const logMap = new Map(logs.map((l) => [l.habitId, l]));

  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-muted text-sm">
        No habits yet — add some in the Habits tab
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {habits.map((habit) => {
        const log = logMap.get(habit.id);

        if (habit.type === "boolean") {
          const done = log?.completed ?? false;
          return (
            <button
              key={habit.id}
              onClick={() => onToggleBoolean(habit.id, todayStr, done)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all active:scale-98 text-left ${
                done
                  ? "bg-accent/10 border-accent/30"
                  : "bg-card border-border hover:border-white/20"
              }`}
            >
              <span className="text-xl flex-shrink-0">{habit.icon}</span>
              <span className={`flex-1 font-medium text-sm ${done ? "text-white" : "text-white/80"}`}>
                {habit.name}
              </span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  done ? "bg-accent border-accent" : "border-border"
                }`}
              >
                {done && <Check size={13} strokeWidth={3} className="text-background" />}
              </div>
            </button>
          );
        }

        // Numeric habit
        const value = log?.value ?? 0;
        const goal = habit.dailyGoal ?? 1;
        const pct = Math.min((value / goal) * 100, 100);
        const done = value >= goal;

        function adjust(delta: number) {
          const step = getStep(habit.unit);
          const newVal = Math.max(0, Math.round((value + delta) * 10) / 10);
          onSetNumeric(habit.id, todayStr, newVal, goal);
        }

        return (
          <div
            key={habit.id}
            className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all ${
              done ? "bg-accent/10 border-accent/30" : "bg-card border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{habit.icon}</span>
              <span className="flex-1 font-medium text-sm text-white/80">{habit.name}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => adjust(-getStep(habit.unit))}
                  className="w-7 h-7 rounded-full bg-border flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-bold text-white w-16 text-center">
                  {value}
                  <span className="text-muted text-xs font-normal">/{goal}{habit.unit}</span>
                </span>
                <button
                  onClick={() => adjust(getStep(habit.unit))}
                  className="w-7 h-7 rounded-full bg-border flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>
              {done && (
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Check size={13} strokeWidth={3} className="text-background" />
                </div>
              )}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-border rounded-full h-1">
              <div
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  backgroundColor: done ? "#4ade80" : "#f59e0b",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getStep(unit: string | null): number {
  if (!unit) return 1;
  if (unit === "oz") return 8;
  if (unit === "g") return 5;
  if (unit === "ml") return 100;
  if (unit === "min") return 5;
  return 1;
}
