import { prisma } from "@/lib/db";
import {
  getAttentionJobs,
  getFollowUpState,
  getUpcomingFollowUps,
} from "@/lib/follow-up-rules";

export {
  compareAttentionJobs,
  followUpStateLabel,
  getAttentionJobs,
  getFollowUpDescription,
  getFollowUpState,
  getFollowUpUrgencyLabel,
  getRecommendedAction,
  getUpcomingFollowUps,
} from "@/lib/follow-up-rules";

export async function getDashboardJobs() {
  const jobs = await prisma.job.findMany({
    include: {
      activities: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: [{ nextFollowUp: "asc" }, { createdAt: "asc" }],
  });

  const active = jobs.filter((job) => job.status !== "DONE");
  const attention = getAttentionJobs(active);
  const upcoming = getUpcomingFollowUps(active, 5);

  return {
    attention,
    upcoming,
    metrics: {
      followUpsToday: active.filter(
        (job) => getFollowUpState(job) === "DUE_TODAY",
      ).length,
      overdue: active.filter((job) => getFollowUpState(job) === "OVERDUE").length,
      openJobs: active.length,
      scheduled: active.filter((job) => job.status === "SCHEDULED").length,
    },
    pipeline: await getPipelineCounts(),
  };
}

export async function getPipelineCounts() {
  const groups = await prisma.job.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts = {
    NEW: 0,
    WAITING_ON_QUOTE: 0,
    WAITING_ON_CUSTOMER: 0,
    SCHEDULED: 0,
    DONE: 0,
  };

  for (const group of groups) {
    counts[group.status] = group._count._all;
  }

  return counts;
}

export async function getJobActivities(jobId: string) {
  return prisma.activity.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
  });
}
