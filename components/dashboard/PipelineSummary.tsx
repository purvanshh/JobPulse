import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { JOB_STATUS_LABELS, type JobStatus } from "@/types";
import { cn } from "@/lib/utils";

const pipelineOrder: JobStatus[] = [
  "NEW",
  "WAITING_ON_QUOTE",
  "WAITING_ON_CUSTOMER",
  "SCHEDULED",
  "DONE",
];

export function PipelineSummary({
  counts,
}: {
  counts: Record<JobStatus, number>;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Pipeline</h2>
        <p className="text-sm text-muted-foreground">
          Where every job currently stands.
        </p>
      </div>
      <div className="grid gap-2">
        {pipelineOrder.map((status) => (
          <Link
            key={status}
            href={`/jobs?status=${status}`}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40"
          >
            <span className="text-sm font-medium">
              {JOB_STATUS_LABELS[status]}
            </span>
            <span className="text-xl font-semibold tabular-nums">
              {counts[status]}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/jobs"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-0")}
      >
        View all jobs
      </Link>
    </section>
  );
}
