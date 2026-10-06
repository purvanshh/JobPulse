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
    "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
  DONE: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
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
