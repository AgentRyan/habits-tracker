"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GOAL_CATEGORIES, Goal } from "@/types";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Goal, "id" | "order">) => void;
}

export default function AddGoalSheet({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(GOAL_CATEGORIES[0].name);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const selectedCat = GOAL_CATEGORIES.find((c) => c.name === category)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onAdd({
      title: title.trim(),
      category,
      categoryColor: selectedCat.color,
      progress,
      isCompleted: progress >= 100,
    });
    setSaving(false);
    handleClose();
  }

  function handleClose() {
    setTitle("");
    setCategory(GOAL_CATEGORIES[0].name);
    setProgress(0);
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent
        side="bottom"
        className="bg-card border-t border-border rounded-t-3xl p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-lg font-bold">New Goal</SheetTitle>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-muted hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Goal</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Launch new website"
              className="bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted focus:outline-none focus:border-accent"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {GOAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`py-3 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                    category === cat.name ? "border-2" : "border"
                  }`}
                  style={{
                    borderColor: category === cat.name ? cat.color : "#2a2a2a",
                    backgroundColor: category === cat.name ? `${cat.color}15` : "transparent",
                    color: category === cat.name ? cat.color : "#6b7280",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mb-1"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Starting progress
              </label>
              <span className="text-sm font-bold" style={{ color: selectedCat.color }}>
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: selectedCat.color }}
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || saving}
            className="w-full py-4 bg-accent text-background font-bold rounded-2xl transition-all hover:bg-accent/90 active:scale-95 disabled:opacity-40"
          >
            {saving ? "Adding..." : "Add Goal"}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
