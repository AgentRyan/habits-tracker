export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function today(): string {
  return formatDate(new Date());
}

export function getWeekDates(weekOffset = 0): Date[] {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function formatWeekLabel(dates: Date[]): string {
  const start = dates[0];
  const end = dates[6];
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function isToday(date: Date): boolean {
  const t = new Date();
  return (
    date.getDate() === t.getDate() &&
    date.getMonth() === t.getMonth() &&
    date.getFullYear() === t.getFullYear()
  );
}

export function isFuture(date: Date): boolean {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return date > t;
}

export const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
}

export function formatGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatTodayLong(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
