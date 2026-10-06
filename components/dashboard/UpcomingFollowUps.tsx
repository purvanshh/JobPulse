import Link from "next/link";

import type { Job } from "@prisma/client";

import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/dates";

export function UpcomingFollowUps({ jobs }: { jobs: Job[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Coming up</h2>
        <p className="text-sm text-muted-foreground">Upcoming follow-ups on the horizon.</p>
      </div>
      {jobs.length === 0 ? (
        <EmptyState
          title="No upcoming follow-ups"
          description="New follow-ups will appear here as you schedule them."
        />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {jobs.map((job) => (
            <li key={job.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/jobs/${job.id}`} className="font-medium hover:underline">
                  {job.customerName}
                </Link>
                <p className="text-sm text-muted-foreground">{job.jobDescription}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FollowUpStateBadge job={job} />
                <span className="text-muted-foreground">{formatDate(job.nextFollowUp)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
