import Link from "next/link";

import type { Job } from "@prisma/client";

import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { MarkContactedButton } from "@/components/jobs/MarkContactedButton";
import { QuickFollowUpButton } from "@/components/jobs/QuickFollowUpButton";
import { getFollowUpState, getRecommendedAction } from "@/lib/follow-ups";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function JobAttentionCard({ job }: { job: Job }) {
  const state = getFollowUpState(job);
  const callHref = job.phone ? `tel:${job.phone.replace(/\s/g, "")}` : null;

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{job.customerName}</h3>
            <FollowUpStateBadge job={job} />
            <JobStatusBadge status={job.status} />
          </div>
          {job.company ? (
            <p className="text-sm text-muted-foreground">{job.company}</p>
          ) : null}
          <p className="text-sm">{job.jobDescription}</p>
          <p className="text-sm font-medium text-primary">
            {getRecommendedAction(job.status)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {callHref ? (
            <a href={callHref} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Call
            </a>
          ) : null}
          <MarkContactedButton jobId={job.id} />
          <QuickFollowUpButton jobId={job.id} />
          <Link
            href={`/jobs/${job.id}`}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Open
          </Link>
        </div>
      </div>
      {state === "OVERDUE" ? (
        <p className="mt-3 text-xs font-medium text-destructive">
          Overdue — customer is waiting on a response.
        </p>
      ) : null}
    </article>
  );
}
