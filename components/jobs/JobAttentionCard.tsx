import type { Activity, Job } from "@prisma/client";

import { ChangeFollowUpButton } from "@/components/jobs/ChangeFollowUpButton";
import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { FollowUpWorkflowButton } from "@/components/jobs/FollowUpWorkflowButton";
import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";
import { formatDate } from "@/lib/dates";
import { getFollowUpUrgencyLabel } from "@/lib/follow-ups";
import { cn } from "@/lib/utils";

type JobWithActivity = Job & { activities?: Activity[] };

export function JobAttentionCard({ job }: { job: JobWithActivity }) {
  const callHref = job.phone ? `tel:${job.phone.replace(/\s/g, "")}` : null;
  const urgency = getFollowUpUrgencyLabel(job);
  const isOverdue = urgency.toLowerCase().includes("overdue");

  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm",
        isOverdue ? "border-destructive/40" : "border-border",
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">
              {job.customerName}
            </h3>
            <JobStatusSelect jobId={job.id} status={job.status} />
          </div>
          {job.company ? (
            <p className="text-sm text-muted-foreground">{job.company}</p>
          ) : null}
          <p className="text-sm leading-relaxed">{job.jobDescription}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <FollowUpStateBadge job={job} />
            <span className="text-muted-foreground">
              Follow-up {formatDate(job.nextFollowUp)}
            </span>
          </div>
          <p
            className={cn(
              "text-sm font-semibold uppercase tracking-wide",
              isOverdue
                ? "text-destructive"
                : "text-amber-700 dark:text-amber-400",
            )}
          >
            {urgency}
          </p>
          <p className="text-sm text-muted-foreground">
            {callHref ? (
              <a href={callHref} className="text-primary hover:underline">
                {job.phone}
              </a>
            ) : (
              "No phone number"
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
          {callHref ? (
            <a
              href={callHref}
              className="inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-sm font-medium hover:bg-muted"
            >
              Call
            </a>
          ) : null}
          <FollowUpWorkflowButton job={job} />
          <ChangeFollowUpButton jobId={job.id} />
        </div>
      </div>
    </article>
  );
}
