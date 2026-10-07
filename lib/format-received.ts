import { format, isSameDay, isYesterday, startOfDay } from "date-fns";

export function formatReceivedAt(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const today = startOfDay(new Date());

  if (isSameDay(date, today)) {
    return format(date, "h:mm a");
  }
  if (isYesterday(date)) {
    return `Yesterday · ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d · h:mm a");
}

export function formatReceivedExact(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "MMM d, yyyy · h:mm a");
}

export function toDateTimeLocalValue(value: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}
