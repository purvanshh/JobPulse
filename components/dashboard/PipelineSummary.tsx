import Link from "next/link";

import { JOB_STATUS_LABELS, type JobStatus } from "@/types";

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
          Where active jobs sit across the workflow.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {pipelineOrder.map((status) => (
          <Link
            key={status}
            href={`/jobs?status=${status}`}
            className="rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {JOB_STATUS_LABELS[status]}
            </p>
            <p className="mt-1 text-2xl font-semibold">{counts[status]}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
