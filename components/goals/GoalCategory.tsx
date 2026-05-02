"use client";

import { useState } from "react";
import { Goal } from "@/types";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

interface Props {
  category: string;
  color: string;
  goals: Goal[];
  onUpdateProgress: (goalId: string, progress: number) => void;
  onDelete: (goalId: string) => void;
}

export default function GoalCategory({ category, color, goals, onUpdateProgress, onDelete }: Props) {
  const [expanded, setExpanded] = useState(true);
  const completedCount = goals.filter((g) => g.isCompleted).length;
  const allComplete = completedCount === goals.length && goals.length > 0;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: `${color}33` }}
    >
      {/* Category header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-4 transition-colors hover:bg-white/5"
        style={{ background: `${color}0d` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-semibold text-white text-sm">{category}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {completedCount}/{goals.length}
          </span>
          {allComplete && (
            <span className="text-xs text-accent font-medium">✓ Complete</span>
          )}
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-muted" />
        ) : (
          <ChevronDown size={16} className="text-muted" />
        )}
      </button>

      {/* Goals list */}
      {expanded && (
        <div className="flex flex-col divide-y divide-border bg-card">
          {goals.length === 0 ? (
            <p className="text-muted text-sm text-center py-6">No goals in this category</p>
          ) : (
            goals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                color={color}
                onUpdateProgress={onUpdateProgress}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function GoalItem({
  goal,
  color,
  onUpdateProgress,
  onDelete,
}: {
  goal: Goal;
  color: string;
  onUpdateProgress: (id: string, progress: number) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${
            goal.isCompleted ? "" : ""
          }`}
          style={{
            backgroundColor: goal.isCompleted ? color : "transparent",
            borderColor: goal.isCompleted ? color : "#2a2a2a",
          }}
          onClick={() => onUpdateProgress(goal.id, goal.isCompleted ? 0 : 100)}
        >
          {goal.isCompleted && <Check size={11} strokeWidth={3} className="text-background" />}
        </div>
        <span
          className={`flex-1 text-sm ${goal.isCompleted ? "text-muted line-through" : "text-white"}`}
        >
          {goal.title}
        </span>
        <span className="text-xs font-bold" style={{ color }}>
          {goal.progress}%
        </span>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-muted hover:text-red-400 transition-colors text-xs px-1"
        >
          ×
        </button>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-border rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${goal.progress}%`, backgroundColor: color }}
        />
      </div>
      {/* Progress slider (touch-friendly) */}
      <input
        type="range"
        min={0}
        max={100}
        value={goal.progress}
        onChange={(e) => onUpdateProgress(goal.id, Number(e.target.value))}
        className="w-full h-1 appearance-none bg-transparent cursor-pointer accent-current"
        style={{ accentColor: color }}
      />
    </div>
  );
}
