"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import WeekSelector from "@/components/habits/WeekSelector";
import WeekSummaryBanner from "@/components/habits/WeekSummaryBanner";
import HabitRow from "@/components/habits/HabitRow";
import AddHabitSheet from "@/components/habits/AddHabitSheet";
import { useHabits, useHabitLogs } from "@/lib/hooks/useHabits";
import { getWeekDates } from "@/lib/utils/dateUtils";
import { Plus } from "lucide-react";
import { Habit } from "@/types";

export default function HabitsPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const weekDates = getWeekDates(weekOffset);

  const { habits, loading, addHabit, deleteHabit } = useHabits();
  const { logs, toggleBoolean, setNumericValue } = useHabitLogs(weekDates);

  return (
    <AppShell>
      <div className="pt-12 pb-6 flex flex-col gap-4">
        {/* Header */}
        <div className="px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Habits</h1>
          <button
            onClick={() => setSheetOpen(true)}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-background shadow-lg shadow-accent/20"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Week selector */}
        <WeekSelector
          weekDates={weekDates}
          offset={weekOffset}
          onPrev={() => setWeekOffset((o) => o - 1)}
          onNext={() => setWeekOffset((o) => Math.min(0, o + 1))}
        />

        {/* Week summary */}
        {!loading && habits.length > 0 && (
          <WeekSummaryBanner habits={habits} logs={logs} weekDates={weekDates} />
        )}

        {/* Habit rows */}
        <div className="px-4 flex flex-col gap-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-card rounded-2xl animate-pulse border border-border" />
            ))
          ) : habits.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <div className="text-5xl">🎯</div>
              <p className="text-white font-semibold">No habits yet</p>
              <p className="text-muted text-sm">Tap + to add your first habit</p>
              <button
                onClick={() => setSheetOpen(true)}
                className="mt-2 px-6 py-3 bg-accent text-background font-bold rounded-2xl text-sm"
              >
                Add Habit
              </button>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                weekDates={weekDates}
                logs={logs}
                onToggleBoolean={toggleBoolean}
                onSetNumeric={setNumericValue}
                onDelete={deleteHabit}
              />
            ))
          )}
        </div>
      </div>

      <AddHabitSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={addHabit}
      />
    </AppShell>
  );
}
