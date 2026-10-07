import type { Activity } from "@prisma/client";
import { format, isSameDay, startOfDay } from "date-fns";

import { ACTIVITY_TYPE_LABELS } from "@/types";

function formatActivityWhen(value: Date): string {
  const date = value instanceof Date ? value : new Date(value);
  const today = startOfDay(new Date());

  if (isSameDay(date, today)) {
    return format(date, "h:mm a");
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return `Yesterday · ${format(date, "h:mm a")}`;
  }

  return format(date, "EEE · MMM d · h:mm a");
}

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="font-mono text-[11px] tracking-wide text-nt-secondary uppercase">
        No activity yet. Follow up, change status, or convert from Inbox to
        build history.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-nt-border">
      {activities.map((activity) => (
        <li key={activity.id} className="py-3 first:pt-0 last:pb-0">
          <p className="font-mono text-[10px] font-medium tracking-widest text-nt-secondary uppercase">
            {formatActivityWhen(activity.createdAt)}
          </p>
          <p className="mt-0.5 text-xs font-semibold tracking-tight text-white">
            {ACTIVITY_TYPE_LABELS[activity.type]}
          </p>
          {activity.note ? (
            <p className="mt-1 whitespace-pre-wrap text-xs text-neutral-300">
              {activity.note}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
