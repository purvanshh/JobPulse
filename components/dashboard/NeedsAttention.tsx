import type { Activity, Job } from "@prisma/client";

import { JobAttentionCard } from "@/components/jobs/JobAttentionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getFollowUpState } from "@/lib/follow-up-rules";

type JobWithActivity = Job & { activities?: Activity[] };

export function NeedsAttention({ jobs }: { jobs: JobWithActivity[] }) {
  const overdue = jobs.filter((job) => getFollowUpState(job) === "OVERDUE");
  const dueToday = jobs.filter((job) => getFollowUpState(job) === "DUE_TODAY");

  return (
    <section
      className="min-w-0 space-y-6 rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6"
      data-purpose="needs-attention"
    >
      <div className="border-b border-nt-border pb-5">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-[4px] border border-nt-red-border bg-nt-red-subtle px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-nt-red uppercase">
          <span>●</span>
          <span>Urgent</span>
        </div>
        <h3 className="font-display text-lg font-bold tracking-tight text-white">
          Needs attention
        </h3>
        <p className="mt-0.5 text-xs font-normal text-nt-muted">
          Overdue first, then due today — the people waiting on you right now.
        </p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="You're all caught up."
          description="No follow-ups are overdue or due today."
          className="py-8"
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="flex items-center gap-1.5 font-display text-[11px] font-bold tracking-wider text-nt-red uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-nt-red shadow-[0_0_6px_rgba(255,46,46,0.6)]" />
              Overdue ({overdue.length})
            </span>
            {overdue.length > 0 ? (
              overdue.map((job) => <JobAttentionCard key={job.id} job={job} />)
            ) : (
              <p className="font-mono text-[11px] tracking-wide text-nt-secondary uppercase">
                Nothing has slipped past its follow-up date.
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <span className="flex items-center gap-1.5 font-display text-[11px] font-bold tracking-wider text-nt-amber uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-nt-amber shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              Due today ({dueToday.length})
            </span>
            {dueToday.length > 0 ? (
              dueToday.map((job) => <JobAttentionCard key={job.id} job={job} />)
            ) : (
              <p className="font-mono text-[11px] tracking-wide text-nt-secondary uppercase">
                No follow-ups are due today.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
