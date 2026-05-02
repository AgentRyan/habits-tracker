"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import GoalCategory from "@/components/goals/GoalCategory";
import AddGoalSheet from "@/components/goals/AddGoalSheet";
import { useGoals } from "@/lib/hooks/useGoals";
import { GOAL_CATEGORIES } from "@/types";
import { Plus } from "lucide-react";

export default function GoalsPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { byCategory, loading, addGoal, updateGoalProgress, deleteGoal } = useGoals();

  const completedTotal = Object.values(byCategory)
    .flat()
    .filter((g) => g.isCompleted).length;
  const totalGoals = Object.values(byCategory).flat().length;

  return (
    <AppShell>
      <div className="pt-12 pb-6 flex flex-col gap-4">
        {/* Header */}
        <div className="px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Goals</h1>
            {totalGoals > 0 && (
              <p className="text-muted text-xs mt-0.5">
                {completedTotal}/{totalGoals} completed
              </p>
            )}
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-background shadow-lg shadow-accent/20"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Categories */}
        <div className="px-4 flex flex-col gap-3">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-card rounded-2xl animate-pulse border border-border" />
            ))
          ) : totalGoals === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <div className="text-5xl">🎯</div>
              <p className="text-white font-semibold">No goals yet</p>
              <p className="text-muted text-sm">Tap + to set your first goal</p>
              <button
                onClick={() => setSheetOpen(true)}
                className="mt-2 px-6 py-3 bg-accent text-background font-bold rounded-2xl text-sm"
              >
                Add Goal
              </button>
            </div>
          ) : (
            GOAL_CATEGORIES.map(({ name, color }) => {
              const goals = byCategory[name] ?? [];
              if (goals.length === 0) return null;
              return (
                <GoalCategory
                  key={name}
                  category={name}
                  color={color}
                  goals={goals}
                  onUpdateProgress={updateGoalProgress}
                  onDelete={deleteGoal}
                />
              );
            })
          )}
        </div>
      </div>

      <AddGoalSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={addGoal}
      />
    </AppShell>
  );
}
