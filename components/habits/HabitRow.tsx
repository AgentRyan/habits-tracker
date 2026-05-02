"use client";

import { Habit, HabitLog } from "@/types";
import { formatDate, isFuture, isToday } from "@/lib/utils/dateUtils";
import { Check, Trash2 } from "lucide-react";

interface Props {
  habit: Habit;
  weekDates: Date[];
  logs: HabitLog[];
  onToggleBoolean: (habitId: string, date: string, current: boolean) => void;
  onSetNumeric: (habitId: string, date: string, value: number, goal: number) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitRow({ habit, weekDates, logs, onToggleBoolean, onSetNumeric, onDelete }: Props) {
  const logMap = new Map(logs.map((l) => [`${l.date}_${l.habitId}`, l]));

  return (
    <div className="bg-card rounded-2xl border border-border px-4 py-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{habit.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{habit.name}</p>
          {habit.type === "numeric" && (
            <p className="text-xs text-muted">
              {habit.dailyGoal} {habit.unit} / day
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="p-1.5 text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, i) => {
          const dateStr = formatDate(date);
          const future = isFuture(date);
          const log = logMap.get(`${dateStr}_${habit.id}`);

          if (habit.type === "boolean") {
            const done = log?.completed ?? false;
            return (
              <button
                key={i}
                disabled={future}
                onClick={() => !future && onToggleBoolean(habit.id, dateStr, done)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                  future
                    ? "opacity-30 cursor-not-allowed"
                    : done
                    ? "bg-accent/20"
                    : "hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    done
                      ? "bg-accent border-accent"
                      : isToday(date)
                      ? "border-white/40"
                      : "border-border"
                  }`}
                >
                  {done && <Check size={12} strokeWidth={3} className="text-background" />}
                </div>
                <span
                  className={`text-[9px] font-medium ${
                    isToday(date) ? "text-white" : "text-muted"
                  }`}
                >
                  {date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)}
                </span>
              </button>
            );
          }

          // Numeric
          const value = log?.value ?? 0;
          const goal = habit.dailyGoal ?? 1;
          const pct = Math.min((value / goal) * 100, 100);
          const done = value >= goal;

          function cycleValue() {
            if (future) return;
            const step = getStep(habit.unit);
            const next = value + step > goal ? 0 : value + step;
            onSetNumeric(habit.id, dateStr, next, goal);
          }

          return (
            <button
              key={i}
              disabled={future}
              onClick={cycleValue}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                future
                  ? "opacity-30 cursor-not-allowed"
                  : done
                  ? "bg-accent/20"
                  : pct > 0
                  ? "bg-accent-amber/10"
                  : "hover:bg-white/5"
              }`}
            >
              {/* Mini arc */}
              <div className="relative w-6 h-6">
                <svg viewBox="0 0 24 24" className="w-6 h-6 -rotate-90">
                  <circle cx={12} cy={12} r={9} fill="none" stroke="#2a2a2a" strokeWidth={3} />
                  <circle
                    cx={12}
                    cy={12}
                    r={9}
                    fill="none"
                    stroke={done ? "#4ade80" : pct > 0 ? "#f59e0b" : "#2a2a2a"}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * 56.5} 56.5`}
                  />
                </svg>
                {done && (
                  <Check
                    size={9}
                    strokeWidth={3}
                    className="absolute inset-0 m-auto text-accent"
                  />
                )}
              </div>
              <span
                className={`text-[9px] font-medium ${
                  isToday(date) ? "text-white" : "text-muted"
                }`}
              >
                {date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)}
              </span>
            </button>
          );
        })}
      </div>
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
