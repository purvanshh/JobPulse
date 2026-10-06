import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { PipelineSummary } from "@/components/dashboard/PipelineSummary";
import { SummaryMetrics } from "@/components/dashboard/SummaryMetrics";
import { UpcomingFollowUps } from "@/components/dashboard/UpcomingFollowUps";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDashboardJobs } from "@/lib/follow-ups";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const { attention, upcoming, metrics, pipeline } = await getDashboardJobs();

  return (
    <>
      <PageHeader
        title="Good morning, Denise"
        description="Here's what needs your attention today."
      />
      <div className="flex flex-1 flex-col gap-8 p-6">
        <SummaryMetrics
          followUpsToday={metrics.followUpsToday}
          overdue={metrics.overdue}
          openJobs={metrics.openJobs}
          scheduled={metrics.scheduled}
        />
        <NeedsAttention jobs={attention} />
        <UpcomingFollowUps jobs={upcoming} />
        <PipelineSummary counts={pipeline} />
      </div>
    </>
  );
}
