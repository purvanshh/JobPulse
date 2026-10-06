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
    <section className="space-y-4 rounded-lg border border-nt-border bg-nt-surface p-6">
      <div className="border-b border-nt-border pb-4">
        <h3 className="font-display text-base font-bold tracking-tight text-white">
          Pipeline
        </h3>
        <p className="mt-0.5 text-xs text-nt-secondary">
          Where every job currently stands.
        </p>
      </div>
      <div className="space-y-2">
        {pipelineOrder.map((status) => (
          <Link
            key={status}
            href={`/jobs?status=${status}`}
            className="flex items-center justify-between rounded-[4px] border border-nt-border bg-nt-card p-3 transition-colors hover:bg-[#18181A]"
          >
            <span className="text-xs font-medium text-neutral-200">
              {JOB_STATUS_LABELS[status]}
            </span>
            <span className="font-display text-sm font-bold text-white">
              {counts[status]}
            </span>
          </Link>
        ))}
      </div>
      <div className="pt-2">
        <Link
          href="/jobs"
          className="font-mono text-xs font-medium tracking-tight text-white hover:text-nt-muted hover:underline"
        >
          View all jobs
        </Link>
      </div>
    </section>
  );
}
