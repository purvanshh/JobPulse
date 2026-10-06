import Link from "next/link";

import type { Job } from "@prisma/client";

import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { formatRelativeDay } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function UpcomingFollowUps({ jobs }: { jobs: Job[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Coming up</h2>
          <p className="text-sm text-muted-foreground">
            Next follow-ups after today.
          </p>
        </div>
        <Link
          href="/jobs?followUp=upcoming"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          View all
        </Link>
      </div>
      {jobs.length === 0 ? (
        <EmptyState
          title="No upcoming follow-ups"
          description="New follow-ups will appear here as you schedule them."
        />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {formatRelativeDay(job.nextFollowUp)}
                </p>
                <Link
                  href={`/jobs/${job.id}`}
                  className="font-medium hover:underline"
                >
                  {job.customerName}
                </Link>
                {job.company ? (
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                ) : null}
              </div>
              <p className="max-w-xs truncate text-sm text-muted-foreground">
                {job.jobDescription}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
