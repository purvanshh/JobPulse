import type { Activity, Job } from "@prisma/client";

import { ChangeFollowUpButton } from "@/components/jobs/ChangeFollowUpButton";
import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { FollowUpWorkflowButton } from "@/components/jobs/FollowUpWorkflowButton";
import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";
import { formatDate } from "@/lib/dates";
import { getFollowUpState, getFollowUpUrgencyLabel } from "@/lib/follow-ups";
import { cn } from "@/lib/utils";

type JobWithActivity = Job & { activities?: Activity[] };

const ghostAction =
  "h-auto rounded-[4px] border-[#222222] bg-transparent px-3 py-1.5 font-mono text-xs font-normal text-nt-secondary shadow-none hover:bg-[#1E1E22] hover:text-white dark:border-[#222222] dark:bg-transparent dark:text-nt-secondary dark:hover:bg-[#1E1E22] dark:hover:text-white";

const primaryAction =
  "h-auto rounded-[4px] border-transparent bg-white px-3 py-1.5 font-mono text-xs font-medium text-black shadow-none hover:bg-neutral-200";

export function JobAttentionCard({ job }: { job: JobWithActivity }) {
  const callHref = job.phone ? `tel:${job.phone.replace(/\s/g, "")}` : null;
  const state = getFollowUpState(job);
  const isOverdue = state === "OVERDUE";
  const urgency = getFollowUpUrgencyLabel(job);

  return (
    <article
      className={cn(
        "flex flex-col justify-between gap-4 rounded-md border border-nt-border bg-nt-card p-4 transition-colors md:flex-row md:items-center",
        isOverdue ? "hover:border-nt-red-border" : "hover:border-nt-amber-border",
      )}
    >
      <div className="min-w-[280px] space-y-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-white">
            {job.customerName}
          </span>
          <JobStatusSelect jobId={job.id} status={job.status} variant="telemetry" />
        </div>
        {job.company ? (
          <p className="text-xs font-medium text-nt-muted">{job.company}</p>
        ) : null}
        <p className="text-xs font-normal text-neutral-300">{job.jobDescription}</p>
        <div className="flex items-center gap-2 pt-0.5">
          <FollowUpStateBadge job={job} />
          <span className="font-mono text-[11px] text-nt-secondary">
            Follow-up {formatDate(job.nextFollowUp)}
          </span>
        </div>
        <div className="flex items-center gap-3 pt-0.5">
          <span
            className={cn(
              "font-mono text-xs font-bold tracking-wide uppercase",
              isOverdue ? "text-nt-red" : "text-nt-amber",
            )}
          >
            {urgency}
          </span>
          {job.phone ? (
            <span className="font-mono text-xs text-nt-secondary">{job.phone}</span>
          ) : (
            <span className="font-mono text-xs text-nt-secondary">No phone</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-start md:self-center">
        {callHref ? (
          <a href={callHref} className={cn(ghostAction, "inline-flex items-center")}>
            Call
          </a>
        ) : null}
        <FollowUpWorkflowButton job={job} triggerClassName={primaryAction} />
        <ChangeFollowUpButton jobId={job.id} className={ghostAction} />
      </div>
    </article>
  );
}
