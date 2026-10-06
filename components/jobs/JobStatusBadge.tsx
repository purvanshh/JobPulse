import type { JobStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JOB_STATUS_LABELS } from "@/types";

const statusStyles: Record<JobStatus, string> = {
  NEW: "border-nt-border bg-nt-card text-nt-muted",
  WAITING_ON_QUOTE: "border-nt-amber-border bg-nt-amber-subtle text-nt-amber",
  WAITING_ON_CUSTOMER: "border-[#27272A] bg-[#18181B] text-white",
  SCHEDULED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  DONE: "border-nt-border bg-[#0A0A0A] text-nt-secondary",
};

export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium",
        statusStyles[status],
        className,
      )}
    >
      {JOB_STATUS_LABELS[status]}
    </Badge>
  );
}
