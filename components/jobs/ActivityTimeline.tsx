import type { Activity } from "@prisma/client";

import { formatDate } from "@/lib/dates";
import { ACTIVITY_TYPE_LABELS } from "@/types";

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="font-mono text-[11px] tracking-wide text-nt-secondary uppercase">
        No activity yet. Mark contacted or change status to build history.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-nt-border">
      {activities.map((activity) => (
        <li key={activity.id} className="py-3 first:pt-0 last:pb-0">
          <p className="font-mono text-[10px] font-medium tracking-widest text-nt-secondary uppercase">
            {formatDate(activity.createdAt)}
          </p>
          <p className="mt-0.5 text-xs font-semibold tracking-tight text-white">
            {ACTIVITY_TYPE_LABELS[activity.type]}
          </p>
          {activity.note ? (
            <p className="mt-1 text-xs text-neutral-300">{activity.note}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
