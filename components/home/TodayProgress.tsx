"use client";

import { Habit, HabitLog } from "@/types";
import { today } from "@/lib/utils/dateUtils";

interface Props {
  habits: Habit[];
  logs: HabitLog[];
}

export default function TodayProgress({ habits, logs }: Props) {
  const todayStr = today();
  const logMap = new Map(logs.map((l) => [l.habitId, l]));

  let completed = 0;
  habits.forEach((h) => {
    const log = logMap.get(h.id);
    if (!log) return;
    if (h.type === "boolean" && log.completed) completed++;
    if (h.type === "numeric" && (log.value ?? 0) >= (h.dailyGoal ?? 1)) completed++;
  });

  const total = habits.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const accentColor = pct >= 80 ? "#4ade80" : pct >= 50 ? "#f59e0b" : pct > 0 ? "#ec4899" : "#2a2a2a";

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* Ring chart */}
      <div className="relative flex items-center justify-center">
        <svg width={140} height={140} className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke="#2a2a2a"
            strokeWidth={10}
          />
          {/* Progress */}
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
            style={{ filter: pct > 0 ? `drop-shadow(0 0 8px ${accentColor}88)` : "none" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-white leading-none">{pct}%</span>
          <span className="text-muted text-xs mt-1">today</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 items-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{completed}</p>
          <p className="text-muted text-xs">done</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{total - completed}</p>
          <p className="text-muted text-xs">remaining</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-muted text-xs">total</p>
        </div>
      </div>

      {/* Motivational text */}
      {total > 0 && (
        <p className="text-sm text-center" style={{ color: accentColor }}>
          {pct === 100
            ? "Perfect day! 🎉"
            : pct >= 80
            ? "Almost there — keep going!"
            : pct >= 50
            ? "Good progress, stay on it"
            : completed > 0
            ? "You've started — don't stop now"
            : "Let's get this day started"}
        </p>
      )}
    </div>
  );
}
