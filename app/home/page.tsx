"use client";

export const dynamic = "force-dynamic";

import AppShell from "@/components/layout/AppShell";
import TodayProgress from "@/components/home/TodayProgress";
import TodayHabitList from "@/components/home/TodayHabitList";
import { useHabits, useHabitLogs } from "@/lib/hooks/useHabits";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatGreeting, formatTodayLong, getWeekDates, today } from "@/lib/utils/dateUtils";
import Image from "next/image";

export default function HomePage() {
  const { user } = useAuth();
  const { habits, loading: habitsLoading } = useHabits();
  const weekDates = getWeekDates(0);
  const { logs, toggleBoolean, setNumericValue } = useHabitLogs(weekDates);

  const todayLogs = logs.filter((l) => l.date === today());

  return (
    <AppShell>
      <div className="px-4 pt-14 pb-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm">{formatGreeting()}</p>
            <h1 className="text-xl font-bold text-white">
              {user?.name?.split(" ")[0] ?? "There"}
            </h1>
            <p className="text-muted text-xs mt-0.5">{formatTodayLong()}</p>
          </div>
          {user?.image && (
            <Image
              src={user.image}
              alt="Profile"
              width={44}
              height={44}
              className="rounded-full border-2 border-border"
            />
          )}
        </div>

        {/* Progress ring */}
        <div className="bg-card rounded-3xl border border-border p-2">
          {habitsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
            </div>
          ) : (
            <TodayProgress habits={habits} logs={todayLogs} />
          )}
        </div>

        {/* Today's habits */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
            Today&apos;s Habits
          </h2>
          {habitsLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-card rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <TodayHabitList
              habits={habits}
              logs={todayLogs}
              onToggleBoolean={toggleBoolean}
              onSetNumeric={setNumericValue}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
