import type { Job } from "@prisma/client";

import { JobAttentionCard } from "@/components/jobs/JobAttentionCard";
import { EmptyState } from "@/components/shared/EmptyState";

export function NeedsAttention({ jobs }: { jobs: Job[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Needs attention</h2>
        <p className="text-sm text-muted-foreground">
          Overdue and due-today follow-ups, sorted by urgency.
        </p>
      </div>
      {jobs.length === 0 ? (
        <EmptyState
          title="You're all caught up."
          description="No overdue or due-today follow-ups right now."
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobAttentionCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
