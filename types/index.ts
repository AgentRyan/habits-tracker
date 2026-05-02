export interface Habit {
  id: string;
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
  type: "boolean" | "numeric";
  unit: string | null;
  dailyGoal: number | null;
  createdAt: Date;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value: number | null;
  completedAt: Date | null;
}

export interface Goal {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  progress: number; // 0-100
  isCompleted: boolean;
  order: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Date;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export type GoalCategory =
  | "Personal Growth"
  | "Work & Business"
  | "Health & Fitness"
  | "Personal";

export const GOAL_CATEGORIES: { name: GoalCategory; color: string }[] = [
  { name: "Personal Growth", color: "#a855f7" },
  { name: "Work & Business", color: "#4ade80" },
  { name: "Health & Fitness", color: "#22d3ee" },
  { name: "Personal", color: "#f59e0b" },
];

export const HABIT_ICONS = [
  { icon: "💧", label: "Water" },
  { icon: "🥩", label: "Protein" },
  { icon: "🧘", label: "Meditation" },
  { icon: "📖", label: "Reading" },
  { icon: "🏃", label: "Running" },
  { icon: "💊", label: "Supplements" },
  { icon: "😴", label: "Sleep" },
  { icon: "🏋️", label: "Workout" },
  { icon: "🥗", label: "Nutrition" },
  { icon: "🧠", label: "Learning" },
  { icon: "✍️", label: "Journaling" },
  { icon: "🎯", label: "Goals" },
  { icon: "🚶", label: "Walking" },
  { icon: "🍎", label: "Eating" },
  { icon: "☕", label: "Coffee" },
  { icon: "🧹", label: "Cleaning" },
  { icon: "💻", label: "Coding" },
  { icon: "🎵", label: "Music" },
  { icon: "🌿", label: "Nature" },
  { icon: "🤸", label: "Stretching" },
  { icon: "🛁", label: "Self-care" },
  { icon: "📝", label: "Notes" },
  { icon: "🏊", label: "Swimming" },
  { icon: "🚴", label: "Cycling" },
  { icon: "🧴", label: "Skincare" },
  { icon: "🫁", label: "Breathing" },
  { icon: "🌅", label: "Morning" },
  { icon: "🌙", label: "Evening" },
  { icon: "💬", label: "Social" },
  { icon: "🎨", label: "Creative" },
];

export const UNIT_SUGGESTIONS = [
  { label: "oz (ounces)", value: "oz" },
  { label: "g (grams)", value: "g" },
  { label: "ml", value: "ml" },
  { label: "min (minutes)", value: "min" },
  { label: "reps", value: "reps" },
  { label: "pages", value: "pages" },
  { label: "steps", value: "steps" },
  { label: "cal (calories)", value: "cal" },
];
