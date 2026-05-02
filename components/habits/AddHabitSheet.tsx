"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HABIT_ICONS, UNIT_SUGGESTIONS, Habit } from "@/types";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Habit, "id" | "createdAt" | "order">) => void;
}

export default function AddHabitSheet({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✅");
  const [type, setType] = useState<"boolean" | "numeric">("boolean");
  const [unit, setUnit] = useState("oz");
  const [customUnit, setCustomUnit] = useState("");
  const [goal, setGoal] = useState("64");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onAdd({
      name: name.trim(),
      icon,
      type,
      unit: type === "numeric" ? (customUnit || unit) : null,
      dailyGoal: type === "numeric" ? Number(goal) : null,
      isActive: true,
    });
    setSaving(false);
    handleClose();
  }

  function handleClose() {
    setName("");
    setIcon("✅");
    setType("boolean");
    setUnit("oz");
    setCustomUnit("");
    setGoal("64");
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent
        side="bottom"
        className="bg-card border-t border-border rounded-t-3xl p-0 max-h-[90vh] overflow-y-auto"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-lg font-bold">New Habit</SheetTitle>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-muted hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Habit name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink water, Workout..."
              className="bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
          </div>

          {/* Icon picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-2">
              {HABIT_ICONS.map(({ icon: ico }) => (
                <button
                  key={ico}
                  type="button"
                  onClick={() => setIcon(ico)}
                  className={`aspect-square rounded-xl text-xl flex items-center justify-center transition-all ${
                    icon === ico
                      ? "bg-accent/20 border-2 border-accent"
                      : "bg-background border border-border hover:border-white/30"
                  }`}
                >
                  {ico}
                </button>
              ))}
            </div>
          </div>

          {/* Type toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Tracking type
            </label>
            <div className="flex bg-background border border-border rounded-xl p-1 gap-1">
              {(["boolean", "numeric"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    type === t
                      ? "bg-accent text-background"
                      : "text-muted hover:text-white"
                  }`}
                >
                  {t === "boolean" ? "Done / Not done" : "Track amount"}
                </button>
              ))}
            </div>
          </div>

          {/* Numeric options */}
          {type === "numeric" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Unit
                </label>
                <div className="flex flex-wrap gap-2">
                  {UNIT_SUGGESTIONS.map(({ label, value: v }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => { setUnit(v); setCustomUnit(""); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        unit === v && !customUnit
                          ? "bg-accent/20 border-accent text-accent"
                          : "border-border text-muted hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  placeholder="Custom unit..."
                  className="bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Daily goal
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    min="1"
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                  <span className="text-muted text-sm">{customUnit || unit}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="w-full py-4 bg-accent text-background font-bold rounded-2xl transition-all hover:bg-accent/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Adding..." : "Add Habit"}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
