"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useHabits, fetchLogsRange } from "@/lib/hooks/useHabits";
import { useGoals } from "@/lib/hooks/useGoals";
import { useAuth } from "@/lib/hooks/useAuth";
import { calculateStreak, getChartData } from "@/lib/utils/streakUtils";
import { formatDate } from "@/lib/utils/dateUtils";
import { HabitLog } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const WINDOWS = [
  { label: "1W", days: 7 },
  { label: "2W", days: 14 },
  { label: "3W", days: 21 },
  { label: "4W", days: 28 },
];

export default function ProgressPage() {
  const { uid } = useAuth();
  const { habits } = useHabits();
  const { goals } = useGoals();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [window, setWindow] = useState(7);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    setLogsLoading(true);
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 30);
    fetchLogsRange(uid, formatDate(start), formatDate(today))
      .then(setLogs)
      .finally(() => setLogsLoading(false));
  }, [uid]);

  const { currentStreak, longestStreak, successRate } = calculateStreak(habits, logs);
  const chartData = getChartData(habits, logs, window);

  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const totalGoals = goals.length;
  const goalsPct = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  return (
    <AppShell>
      <div className="pt-12 pb-6 px-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white">Progress</h1>

        {/* Goals completed card */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white/60">Goals completed</p>
            <span className="text-2xl font-bold text-white">
              {completedGoals}
              <span className="text-muted text-base font-normal">/{totalGoals}</span>
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="h-2 rounded-full bg-accent transition-all duration-700"
              style={{ width: `${goalsPct}%` }}
            />
          </div>
          {totalGoals > 0 && (
            <p className="text-xs text-muted mt-2">
              {goalsPct === 100 ? "All goals complete! 🎉" : `${goalsPct}% of goals complete`}
            </p>
          )}
        </div>

        {/* Streak card */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="text-sm font-semibold text-white/60 mb-4">Habit Streak</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{currentStreak}</p>
              <p className="text-xs text-muted mt-1">Current streak</p>
              <p className="text-xs text-muted">days</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-3xl font-bold text-white">{longestStreak}</p>
              <p className="text-xs text-muted mt-1">Longest streak</p>
              <p className="text-xs text-muted">days</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-cyan">{successRate}%</p>
              <p className="text-xs text-muted mt-1">Success rate</p>
              <p className="text-xs text-muted">30 days</p>
            </div>
          </div>
        </div>

        {/* Chart card */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white/60">Daily completion</p>
            <div className="flex gap-1">
              {WINDOWS.map(({ label, days }) => (
                <button
                  key={label}
                  onClick={() => setWindow(days)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    window === days
                      ? "bg-accent text-background"
                      : "text-muted hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {logsLoading || habits.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              {logsLoading ? (
                <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
              ) : (
                <p className="text-muted text-sm">Add habits to see progress</p>
              )}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={Math.floor(chartData.length / 4)}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, "Completion"]}
                  cursor={{ stroke: "#2a2a2a" }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={{ fill: "#4ade80", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#4ade80", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Encouragement */}
        {currentStreak >= 3 && (
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 text-center">
            <p className="text-accent font-semibold text-sm">
              {currentStreak >= 7
                ? `🔥 ${currentStreak}-day streak — you're unstoppable!`
                : `⚡ ${currentStreak}-day streak — keep it going!`}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
