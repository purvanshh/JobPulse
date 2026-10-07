import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ActivityTimeline } from "@/components/jobs/ActivityTimeline";
import { ChangeFollowUpButton } from "@/components/jobs/ChangeFollowUpButton";
import { ConvertedJobBanner } from "@/components/jobs/ConvertedJobBanner";
import { DeleteJobButton } from "@/components/jobs/DeleteJobButton";
import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { FollowUpWorkflowButton } from "@/components/jobs/FollowUpWorkflowButton";
import { JobForm } from "@/components/jobs/JobForm";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDate, formatLongDate } from "@/lib/dates";
import {
  getFollowUpDescription,
  getJobActivities,
  getRecommendedAction,
} from "@/lib/follow-ups";
import { getInboundRequestForJob } from "@/lib/inbound";
import { formatReceivedExact } from "@/lib/format-received";
import { getJobById } from "@/lib/jobs";
import { INBOUND_SOURCE_LABELS, JOB_SOURCE_LABELS } from "@/types";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  const [activities, inboundRequest] = await Promise.all([
    getJobActivities(id),
    getInboundRequestForJob(id),
  ]);
  const recommended = getRecommendedAction(job.status);
  const callHref = job.phone ? `tel:${job.phone.replace(/\s/g, "")}` : null;

  const jobWithActivity = { ...job, activities: activities.slice(0, 1) };

  return (
    <PageFrame>
      <PageHeader
        title={job.customerName}
        description={job.jobDescription}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {job.status !== "DONE" && job.status !== "SCHEDULED" ? (
              <FollowUpWorkflowButton job={jobWithActivity} />
            ) : (
              <span className="font-mono text-[11px] tracking-wide text-nt-secondary uppercase">
                {recommended}
              </span>
            )}
            {callHref ? (
              <a href={callHref} className={ghostAction}>
                Call
              </a>
            ) : (
              <span className="font-mono text-[11px] text-nt-secondary">No phone number</span>
            )}
            <ChangeFollowUpButton jobId={job.id} label="Change follow-up" className={ghostAction} />
            <JobStatusSelect jobId={job.id} status={job.status} variant="telemetry" />
            <DeleteJobButton jobId={job.id} />
          </div>
        }
      />

      <Suspense fallback={null}>
        <ConvertedJobBanner job={jobWithActivity} />
      </Suspense>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Who">
          <Fact label="Customer" value={job.customerName} />
          <Fact label="Company" value={job.company ?? "—"} />
          <Fact
            label="Phone"
            value={
              callHref ? (
                <a href={callHref} className="text-white hover:underline">
                  {job.phone}
                </a>
              ) : (
                "No phone number"
              )
            }
          />
          <Fact label="Email" value={job.email ?? "—"} />
        </Panel>

        <section className="space-y-3 rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6">
          <h2 className="font-display text-base font-bold tracking-tight text-white">
            What to do next
          </h2>
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
              Next follow-up
            </p>
            <p className="mt-1 font-display text-lg font-bold tracking-tight text-white">
              {formatLongDate(job.nextFollowUp)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FollowUpStateBadge job={job} />
            <JobStatusBadge status={job.status} />
          </div>
          <p className="text-xs font-medium text-white">{getFollowUpDescription(job)}</p>
          {recommended !== "No Action" ? (
            <p className="text-xs text-nt-secondary">
              Recommended{" "}
              <span className="font-mono text-[11px] font-semibold tracking-wide text-white uppercase">
                {recommended}
              </span>
            </p>
          ) : (
            <p className="font-mono text-[11px] tracking-wide text-nt-secondary uppercase">
              No follow-up action needed.
            </p>
          )}
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="What">
          <p className="text-xs leading-relaxed text-neutral-300">{job.jobDescription}</p>
          <Fact label="Source" value={JOB_SOURCE_LABELS[job.source]} />
          {job.notes ? (
            <div className="pt-1">
              <p className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
                Notes
              </p>
              <p className="mt-1 whitespace-pre-wrap text-xs text-neutral-300">{job.notes}</p>
            </div>
          ) : null}
        </Panel>

        <Panel title="Where it stands">
          <p className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
              Status
            </span>
            <JobStatusBadge status={job.status} />
          </p>
          <Fact label="Created" value={formatDate(job.createdAt)} />
          <Fact label="Last updated" value={formatDate(job.updatedAt)} />
        </Panel>
      </div>

      {inboundRequest ? (
        <section className="space-y-3 rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6">
          <h2 className="border-b border-nt-border pb-4 font-display text-base font-bold tracking-tight text-white">
            Original inbound request
          </h2>
          <Fact
            label="Source"
            value={INBOUND_SOURCE_LABELS[inboundRequest.source]}
          />
          <Fact
            label="Received"
            value={formatReceivedExact(inboundRequest.receivedAt)}
          />
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-300">
            {inboundRequest.message}
          </p>
          <Link
            href="/inbox"
            className="inline-block font-mono text-[11px] text-nt-secondary hover:text-white hover:underline"
          >
            Back to inbox
          </Link>
        </section>
      ) : null}

      <section className="rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6">
        <h2 className="mb-4 border-b border-nt-border pb-4 font-display text-base font-bold tracking-tight text-white">
          What happened
        </h2>
        <ActivityTimeline activities={activities} />
      </section>

      <section className="max-w-3xl rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-nt-border pb-4">
          <h2 className="font-display text-base font-bold tracking-tight text-white">
            Edit job
          </h2>
          <Link
            href="/jobs"
            className="font-mono text-xs font-medium text-white hover:text-nt-muted hover:underline"
          >
            Back to jobs
          </Link>
        </div>
        <JobForm mode="edit" job={job} />
      </section>
    </PageFrame>
  );
}

const ghostAction =
  "inline-flex h-8 items-center rounded-[4px] border border-[#27272A] bg-transparent px-3 font-mono text-xs text-nt-secondary transition-colors hover:border-[#3F3F46] hover:bg-[#121212] hover:text-white";

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6">
      <h2 className="border-b border-nt-border pb-4 font-display text-base font-bold tracking-tight text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <p className="text-xs text-neutral-300">
      <span className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
        {label}
      </span>{" "}
      {value}
    </p>
  );
}
