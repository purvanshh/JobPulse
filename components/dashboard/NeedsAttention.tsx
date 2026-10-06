import type { Activity, Job } from "@prisma/client";

import { JobAttentionCard } from "@/components/jobs/JobAttentionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getFollowUpState } from "@/lib/follow-ups";

type JobWithActivity = Job & { activities?: Activity[] };

export function NeedsAttention({ jobs }: { jobs: JobWithActivity[] }) {
  const overdue = jobs.filter((job) => getFollowUpState(job) === "OVERDUE");
  const dueToday = jobs.filter((job) => getFollowUpState(job) === "DUE_TODAY");

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-destructive">
          Urgent
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Needs attention
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Overdue first, then due today — the people waiting on you right now.
        </p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="You're all caught up."
          description="No follow-ups are overdue or due today."
        />
      ) : (
        <div className="space-y-6">
          {overdue.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-destructive">
                Overdue ({overdue.length})
              </h3>
              <div className="space-y-3">
                {overdue.map((job) => (
                  <JobAttentionCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No overdue jobs"
              description="Nothing has slipped past its follow-up date."
              className="py-8"
            />
          )}

          {dueToday.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Due today ({dueToday.length})
              </h3>
              <div className="space-y-3">
                {dueToday.map((job) => (
                  <JobAttentionCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No jobs due today"
              description="No follow-ups are due today."
              className="py-8"
            />
          )}
        </div>
      )}
    </section>
  );
}
