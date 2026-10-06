import type { Job, JobStatus } from "@prisma/client";

import { daysBetween, formatRelativeDay, toDateOnly } from "@/lib/dates";
import { prisma } from "@/lib/db";
import type { FollowUpState } from "@/types";

export function getFollowUpState(
  job: Pick<Job, "status" | "nextFollowUp">,
): FollowUpState {
  if (job.status === "DONE") {
    return "COMPLETED";
  }

  const today = toDateOnly(new Date());
  const followUp = toDateOnly(job.nextFollowUp);

  if (followUp.getTime() < today.getTime()) {
    return "OVERDUE";
  }
  if (followUp.getTime() === today.getTime()) {
    return "DUE_TODAY";
  }
  return "UPCOMING";
}

export function getRecommendedAction(status: JobStatus): string {
  switch (status) {
    case "NEW":
      return "Contact Customer";
    case "WAITING_ON_QUOTE":
      return "Follow Up on Quote";
    case "WAITING_ON_CUSTOMER":
      return "Follow Up";
    case "SCHEDULED":
      return "View Job";
    case "DONE":
      return "No Action";
    default:
      return "Review Job";
  }
}

export function followUpStateLabel(state: FollowUpState): string {
  switch (state) {
    case "OVERDUE":
      return "Overdue";
    case "DUE_TODAY":
      return "Due Today";
    case "UPCOMING":
      return "Upcoming";
    case "COMPLETED":
      return "Completed";
  }
}

/** Short urgency label for attention cards. */
export function getFollowUpUrgencyLabel(
  job: Pick<Job, "status" | "nextFollowUp">,
): string {
  const state = getFollowUpState(job);

  if (state === "COMPLETED") {
    return "Completed";
  }
  if (state === "DUE_TODAY") {
    return "Due today";
  }
  if (state === "OVERDUE") {
    const days = daysBetween(job.nextFollowUp);
    if (days <= 1) return "Overdue by 1 day";
    return `Overdue by ${days} days`;
  }

  return `Coming ${formatRelativeDay(job.nextFollowUp).toLowerCase()}`;
}

/** Sentence for job detail follow-up area. */
export function getFollowUpDescription(
  job: Pick<Job, "status" | "nextFollowUp">,
): string {
  const state = getFollowUpState(job);

  if (state === "COMPLETED") {
    return "This job is done. No follow-up is needed.";
  }
  if (state === "DUE_TODAY") {
    return "Follow-up is due today.";
  }
  if (state === "OVERDUE") {
    const days = daysBetween(job.nextFollowUp);
    if (days <= 1) return "Follow-up is overdue by 1 day.";
    return `Follow-up is overdue by ${days} days.`;
  }

  const relative = formatRelativeDay(job.nextFollowUp);
  if (relative === "Tomorrow") {
    return "Follow-up is due tomorrow.";
  }
  return `Follow-up is due ${relative}.`;
}

export function compareAttentionJobs(a: Job, b: Job): number {
  const stateA = getFollowUpState(a);
  const stateB = getFollowUpState(b);

  if (stateA !== stateB) {
    return stateA === "OVERDUE" ? -1 : 1;
  }

  // Most overdue first (earlier nextFollowUp), then due-today by follow-up time
  const followUpDiff = a.nextFollowUp.getTime() - b.nextFollowUp.getTime();
  if (followUpDiff !== 0) {
    return followUpDiff;
  }

  // Oldest created first among ties
  return a.createdAt.getTime() - b.createdAt.getTime();
}

export function getAttentionJobs<T extends Job>(jobs: T[]): T[] {
  return jobs
    .filter((job) => {
      const state = getFollowUpState(job);
      return state === "OVERDUE" || state === "DUE_TODAY";
    })
    .sort(compareAttentionJobs);
}

export function getUpcomingFollowUps<T extends Job>(jobs: T[], limit = 5): T[] {
  return jobs
    .filter((job) => getFollowUpState(job) === "UPCOMING")
    .sort((a, b) => a.nextFollowUp.getTime() - b.nextFollowUp.getTime())
    .slice(0, limit);
}

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
