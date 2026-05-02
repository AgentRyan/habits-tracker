"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekLabel } from "@/lib/utils/dateUtils";

interface Props {
  weekDates: Date[];
  offset: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function WeekSelector({ weekDates, offset, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        onClick={onPrev}
        className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-white transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">{formatWeekLabel(weekDates)}</p>
        {offset === 0 && (
          <p className="text-xs text-accent mt-0.5">This week</p>
        )}
        {offset === -1 && (
          <p className="text-xs text-muted mt-0.5">Last week</p>
        )}
        {offset < -1 && (
          <p className="text-xs text-muted mt-0.5">{Math.abs(offset)} weeks ago</p>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={offset >= 0}
        className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
