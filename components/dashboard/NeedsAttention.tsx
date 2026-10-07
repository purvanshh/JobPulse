import type { Activity, InboundRequest, Job } from "@prisma/client";
import Link from "next/link";

import { InboundAttentionCard } from "@/components/inbox/InboundAttentionCard";
import { JobAttentionCard } from "@/components/jobs/JobAttentionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getFollowUpState } from "@/lib/follow-up-rules";

type JobWithActivity = Job & { activities?: Activity[] };

export function NeedsAttention({
  jobs,
  inboundRequests,
}: {
  jobs: JobWithActivity[];
  inboundRequests: InboundRequest[];
}) {
  const overdue = jobs.filter((job) => getFollowUpState(job) === "OVERDUE");
  const dueToday = jobs.filter((job) => getFollowUpState(job) === "DUE_TODAY");
  const hasWork =
    overdue.length > 0 || dueToday.length > 0 || inboundRequests.length > 0;

  return (
    <section
      className="min-w-0 space-y-6 rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6"
      data-purpose="needs-attention"
    >
      <div className="border-b border-nt-border pb-5">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-[4px] border border-nt-red-border bg-nt-red-subtle px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-nt-red uppercase">
          <span>●</span>
          <span>Morning list</span>
        </div>
        <h3 className="font-display text-lg font-bold tracking-tight text-white">
          Needs attention
        </h3>
        <p className="mt-0.5 text-xs font-normal text-nt-muted">
          Overdue follow-ups, due today, then new requests — handle each one
          here.
        </p>
      </div>

      {!hasWork ? (
        <EmptyState
          title="You're caught up."
          description="No overdue follow-ups, due-today work, or new inbound requests."
          className="py-8"
        />
      ) : (
        <div className="space-y-6">
          <AttentionGroup
            title={`Overdue (${overdue.length})`}
            tone="red"
            empty="Nothing has slipped past its follow-up date."
          >
            {overdue.map((job) => (
              <JobAttentionCard key={job.id} job={job} />
            ))}
          </AttentionGroup>

          <AttentionGroup
            title={`Due today (${dueToday.length})`}
            tone="amber"
            empty="No follow-ups are due today."
          >
            {dueToday.map((job) => (
              <JobAttentionCard key={job.id} job={job} />
            ))}
          </AttentionGroup>

          <AttentionGroup
            title={`New requests (${inboundRequests.length})`}
            tone="amber"
            empty="No unreviewed inbound requests."
            action={
              inboundRequests.length > 0 ? (
                <Link
                  href="/inbox"
                  className="font-mono text-[11px] text-nt-secondary hover:text-white hover:underline"
                >
                  Open inbox
                </Link>
              ) : null
            }
          >
            {inboundRequests.map((request) => (
              <InboundAttentionCard key={request.id} request={request} />
            ))}
          </AttentionGroup>
        </div>
      )}
    </section>
  );
}

function AttentionGroup({
  title,
  tone,
  empty,
  action,
  children,
}: {
  title: string;
  tone: "red" | "amber";
  empty: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span
          className={
            tone === "red"
              ? "flex items-center gap-1.5 font-display text-[11px] font-bold tracking-wider text-nt-red uppercase"
              : "flex items-center gap-1.5 font-display text-[11px] font-bold tracking-wider text-nt-amber uppercase"
          }
        >
          <span
            className={
              tone === "red"
                ? "h-1.5 w-1.5 rounded-full bg-nt-red shadow-[0_0_6px_rgba(255,46,46,0.6)]"
                : "h-1.5 w-1.5 rounded-full bg-nt-amber shadow-[0_0_6px_rgba(245,158,11,0.6)]"
            }
          />
          {title}
        </span>
        {action}
      </div>
      {hasChildren ? (
        children
      ) : (
        <p className="font-mono text-[11px] tracking-wide text-nt-secondary uppercase">
          {empty}
        </p>
      )}
    </div>
  );
}
