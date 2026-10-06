import Link from "next/link";

import type { Job } from "@prisma/client";

import { EmptyState } from "@/components/shared/EmptyState";
import { formatRelativeDay } from "@/lib/dates";

export function UpcomingFollowUps({ jobs }: { jobs: Job[] }) {
  return (
    <section className="space-y-4 rounded-lg border border-nt-border bg-nt-surface p-6">
      <div className="flex items-baseline justify-between border-b border-nt-border pb-4">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight text-white">
            Coming up
          </h3>
          <p className="mt-0.5 text-xs text-nt-secondary">
            Next follow-ups after today.
          </p>
        </div>
        <Link
          href="/jobs?followUp=upcoming"
          className="font-mono text-xs font-medium tracking-tight text-white hover:text-nt-muted hover:underline"
        >
          View all
        </Link>
      </div>
      {jobs.length === 0 ? (
        <EmptyState
          title="No upcoming follow-ups"
          description="New follow-ups will appear here as you schedule them."
          className="py-8"
        />
      ) : (
        <div className="divide-y divide-nt-border">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-1"
            >
              <div className="min-w-0">
                <span className="block font-mono text-[10px] font-medium tracking-widest text-nt-secondary uppercase">
                  {formatRelativeDay(job.nextFollowUp)}
                </span>
                <Link
                  href={`/jobs/${job.id}`}
                  className="mt-0.5 block text-xs font-semibold tracking-tight text-white hover:underline"
                >
                  {job.customerName}
                </Link>
                {job.company ? (
                  <p className="text-xs text-nt-secondary">{job.company}</p>
                ) : null}
              </div>
              <p className="max-w-[14rem] text-right text-xs font-normal text-neutral-300">
                {job.jobDescription}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
