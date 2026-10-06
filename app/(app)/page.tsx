import Link from "next/link";

import { AttentionSummary } from "@/components/dashboard/AttentionSummary";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { PipelineSummary } from "@/components/dashboard/PipelineSummary";
import { SummaryMetrics } from "@/components/dashboard/SummaryMetrics";
import { UpcomingFollowUps } from "@/components/dashboard/UpcomingFollowUps";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardJobs } from "@/lib/follow-ups";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const { attention, upcoming, metrics, pipeline } = await getDashboardJobs();

  return (
    <>
      <PageHeader
        title="Good morning, Denise"
        description="Here's what needs your attention today."
        actions={
          <Link href="/jobs/new" className={cn(buttonVariants())}>
            Add job
          </Link>
        }
      />
      <div className="flex flex-1 flex-col gap-8 p-6">
        <AttentionSummary
          overdue={metrics.overdue}
          dueToday={metrics.followUpsToday}
        />

        {/* Actionable work first — metrics stay secondary. */}
        <NeedsAttention jobs={attention} />

        <UpcomingFollowUps jobs={upcoming} />

        <div className="grid gap-8 xl:grid-cols-[1fr_0.85fr] xl:items-start">
          <SummaryMetrics
            followUpsToday={metrics.followUpsToday}
            overdue={metrics.overdue}
            openJobs={metrics.openJobs}
            scheduled={metrics.scheduled}
          />
          <PipelineSummary counts={pipeline} />
        </div>
      </div>
    </>
  );
}
