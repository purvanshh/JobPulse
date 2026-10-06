import { format, isSameDay, startOfDay } from "date-fns";

export function toDateOnly(value: Date | string): Date {
  const date = typeof value === "string" ? new Date(value) : value;
  return startOfDay(date);
}

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "MMM d, yyyy");
}

export function formatRelativeDay(value: Date | string): string {
  const date = toDateOnly(value);
  const today = startOfDay(new Date());

  if (isSameDay(date, today)) {
    return "Today";
  }

  return formatDate(date);
}

export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return startOfDay(new Date(year, month - 1, day));
}

export function toDateInputValue(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "yyyy-MM-dd");
}

export function addDaysFromToday(days: number): Date {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() + days);
  return date;
}
