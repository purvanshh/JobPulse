import Link from "next/link";

import { AttentionSummary } from "@/components/dashboard/AttentionSummary";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { PipelineSummary } from "@/components/dashboard/PipelineSummary";
import { UpcomingFollowUps } from "@/components/dashboard/UpcomingFollowUps";
import { PageFrame } from "@/components/layout/PageFrame";
import { getDashboardJobs } from "@/lib/follow-ups";
import { listNewInboundRequests } from "@/lib/inbound";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "JobPulse — Follow-up Workspace",
};

export default async function TodayPage() {
  const [{ attention, upcoming, metrics, pipeline }, newRequests] =
    await Promise.all([getDashboardJobs(), listNewInboundRequests()]);

  const totalAttention =
    metrics.overdue + metrics.followUpsToday + newRequests.length;

  return (
    <PageFrame>
      <section
        className="flex flex-col justify-between gap-4 pb-1 sm:flex-row sm:items-center"
        data-purpose="top-header"
      >
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Good morning, Denise
          </h2>
          <p className="mt-1 text-xs font-normal tracking-tight text-nt-muted">
            {totalAttention > 0
              ? "Who to call, why they need you, and what to do next."
              : "Nothing urgent — check Coming up or open Jobs for the full pipeline."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {newRequests.length > 0 ? (
            <Link
              href="/inbox"
              className="inline-flex w-fit items-center gap-1.5 rounded-[4px] bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:bg-neutral-200 active:scale-[0.98]"
            >
              Review inbox
            </Link>
          ) : (
            <Link
              href="/jobs/new"
              className="inline-flex w-fit items-center gap-1.5 rounded-[4px] bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:bg-neutral-200 active:scale-[0.98]"
            >
              <span className="font-mono text-sm leading-none font-bold">+</span>
              <span className="font-medium">Add job</span>
            </Link>
          )}
        </div>
      </section>

      <AttentionSummary
        overdue={metrics.overdue}
        dueToday={metrics.followUpsToday}
        newRequests={newRequests.length}
      />

      <NeedsAttention jobs={attention} inboundRequests={newRequests} />

      <section
        className="grid grid-cols-1 items-start gap-6 pb-12 lg:grid-cols-12"
        data-purpose="dual-pipeline-schedule"
      >
        <div className="lg:col-span-7">
          <UpcomingFollowUps jobs={upcoming} />
        </div>
        <div className="lg:col-span-5">
          <PipelineSummary counts={pipeline} />
        </div>
      </section>
    </PageFrame>
  );
}
