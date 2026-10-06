import type { JobStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JOB_STATUS_LABELS } from "@/types";

const statusStyles: Record<JobStatus, string> = {
  NEW: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100",
  WAITING_ON_QUOTE:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  WAITING_ON_CUSTOMER:
    "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100",
  SCHEDULED:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  DONE: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
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
      variant="secondary"
      className={cn("border-0 font-medium", statusStyles[status], className)}
    >
      {JOB_STATUS_LABELS[status]}
    </Badge>
  );
}
