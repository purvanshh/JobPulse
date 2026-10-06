import { Badge } from "@/components/ui/badge";
import { followUpStateLabel, getFollowUpState } from "@/lib/follow-up-rules";
import { cn } from "@/lib/utils";
import type { Job } from "@prisma/client";

const styles = {
  OVERDUE: "border-nt-red-border bg-nt-red-subtle text-nt-red",
  DUE_TODAY: "border-nt-amber-border bg-nt-amber-subtle text-nt-amber",
  UPCOMING: "border-nt-border bg-nt-card text-nt-muted",
  COMPLETED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

export function FollowUpStateBadge({
  job,
}: {
  job: Pick<Job, "status" | "nextFollowUp">;
}) {
  const state = getFollowUpState(job);

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium",
        styles[state],
      )}
    >
      {followUpStateLabel(state)}
    </Badge>
  );
}
