import Link from "next/link";

import { AttentionSummary } from "@/components/dashboard/AttentionSummary";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { PipelineSummary } from "@/components/dashboard/PipelineSummary";
import { SummaryMetrics } from "@/components/dashboard/SummaryMetrics";
import { UpcomingFollowUps } from "@/components/dashboard/UpcomingFollowUps";
import { getDashboardJobs } from "@/lib/follow-ups";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "JobPulse — Follow-up Workspace",
};

export default async function TodayPage() {
  const { attention, upcoming, metrics, pipeline } = await getDashboardJobs();

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1184px] flex-1 space-y-7 p-4 sm:p-8 lg:p-10">
      <section
        className="flex flex-col justify-between gap-4 pb-1 sm:flex-row sm:items-center"
        data-purpose="top-header"
      >
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Good morning, Denise
          </h2>
          <p className="mt-1 text-xs font-normal tracking-tight text-nt-muted">
            Here&apos;s what needs your attention today.
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex w-fit items-center gap-1.5 rounded-[4px] bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:bg-neutral-200 active:scale-[0.98]"
        >
          <span className="font-mono text-sm leading-none font-bold">+</span>
          <span className="font-medium">Add job</span>
        </Link>
      </section>

      <AttentionSummary
        overdue={metrics.overdue}
        dueToday={metrics.followUpsToday}
      />

      <NeedsAttention jobs={attention} />

      <SummaryMetrics
        followUpsToday={metrics.followUpsToday}
        overdue={metrics.overdue}
        openJobs={metrics.openJobs}
        scheduled={metrics.scheduled}
      />

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
    </div>
  );
}
