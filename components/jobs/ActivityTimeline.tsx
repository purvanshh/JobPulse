import type { Activity } from "@prisma/client";

import { formatDate } from "@/lib/dates";
import { ACTIVITY_TYPE_LABELS } from "@/types";

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No activity yet. Mark contacted or change status to build history.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {activities.map((activity) => (
        <li key={activity.id} className="relative border-l border-border pl-4">
          <span className="absolute -left-1 top-1 size-2 rounded-full bg-primary" />
          <p className="text-xs text-muted-foreground">
            {formatDate(activity.createdAt)}
          </p>
          <p className="text-sm font-medium">{ACTIVITY_TYPE_LABELS[activity.type]}</p>
          {activity.note ? (
            <p className="text-sm text-muted-foreground">{activity.note}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
