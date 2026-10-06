import { Badge } from "@/components/ui/badge";
import { followUpStateLabel, getFollowUpState } from "@/lib/follow-ups";
import { cn } from "@/lib/utils";
import type { Job } from "@prisma/client";

const styles = {
  OVERDUE: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100",
  DUE_TODAY: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  UPCOMING: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100",
  COMPLETED: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
};

export function FollowUpStateBadge({ job }: { job: Pick<Job, "status" | "nextFollowUp"> }) {
  const state = getFollowUpState(job);

  return (
    <Badge variant="secondary" className={cn("border-0", styles[state])}>
      {followUpStateLabel(state)}
    </Badge>
  );
}
