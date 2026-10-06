import Link from "next/link";

import type { Job } from "@prisma/client";

import { ChangeFollowUpButton } from "@/components/jobs/ChangeFollowUpButton";
import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { MarkContactedButton } from "@/components/jobs/MarkContactedButton";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/dates";
import {
  getFollowUpUrgencyLabel,
  getRecommendedAction,
} from "@/lib/follow-ups";
import { cn } from "@/lib/utils";

export function JobAttentionCard({ job }: { job: Job }) {
  const callHref = job.phone ? `tel:${job.phone.replace(/\s/g, "")}` : null;
  const action = getRecommendedAction(job.status);
  const urgency = getFollowUpUrgencyLabel(job);

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{job.customerName}</h3>
            <JobStatusBadge status={job.status} />
          </div>
          {job.company ? (
            <p className="text-sm text-muted-foreground">{job.company}</p>
          ) : null}
          <p className="text-sm">{job.jobDescription}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <FollowUpStateBadge job={job} />
            <span className="text-muted-foreground">
              Follow-up {formatDate(job.nextFollowUp)}
            </span>
          </div>
          <p
            className={cn(
              "text-sm font-semibold uppercase tracking-wide",
              urgency.toLowerCase().includes("overdue")
                ? "text-destructive"
                : "text-amber-700 dark:text-amber-400",
            )}
          >
            {urgency}
          </p>
          <p className="text-sm font-medium text-primary">{action}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {callHref ? (
            <a
              href={callHref}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Call
            </a>
          ) : null}
          <MarkContactedButton jobId={job.id} />
          <ChangeFollowUpButton jobId={job.id} />
          <Link
            href={`/jobs/${job.id}`}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Open job
          </Link>
        </div>
      </div>
    </article>
  );
}
