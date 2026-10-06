import { differenceInCalendarDays, format, isSameDay, startOfDay } from "date-fns";

export function toDateOnly(value: Date | string): Date {
  // Parse calendar dates as local days to avoid UTC midnight shifting the day.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return parseDateInput(value);
  }
  const date = typeof value === "string" ? new Date(value) : value;
  return startOfDay(date);
}

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "MMM d, yyyy");
}

export function formatLongDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "MMMM d, yyyy");
}

export function formatRelativeDay(value: Date | string): string {
  const date = toDateOnly(value);
  const today = startOfDay(new Date());
  const delta = differenceInCalendarDays(date, today);

  if (delta === 0) return "Today";
  if (delta === 1) return "Tomorrow";
  if (delta === -1) return "Yesterday";

  return formatDate(date);
}

export function daysBetween(from: Date | string, to: Date | string = new Date()): number {
  return differenceInCalendarDays(toDateOnly(to), toDateOnly(from));
}

export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return startOfDay(new Date(year, month - 1, day));
}

export function toDateInputValue(value: Date | string): string {
  return format(toDateOnly(value), "yyyy-MM-dd");
}

export function addDaysFromToday(days: number): Date {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() + days);
  return date;
}

export function isSameCalendarDay(a: Date | string, b: Date | string): boolean {
  return isSameDay(toDateOnly(a), toDateOnly(b));
}
