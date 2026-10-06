import type { Job, JobStatus } from "@prisma/client";

import { toDateOnly } from "@/lib/dates";
import { prisma } from "@/lib/db";
import type { FollowUpState } from "@/types";

export function getFollowUpState(job: Pick<Job, "status" | "nextFollowUp">): FollowUpState {
  if (job.status === "DONE") {
    return "COMPLETED";
  }

  const today = toDateOnly(new Date());
  const followUp = toDateOnly(job.nextFollowUp);

  if (followUp < today) {
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
      return "Send Quote";
    case "WAITING_ON_CUSTOMER":
      return "Follow Up";
    case "SCHEDULED":
      return "View Job / Check Schedule";
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

function isActiveJob(job: Job) {
  return job.status !== "DONE";
}

export async function getDashboardJobs() {
  const jobs = await prisma.job.findMany({
    orderBy: [{ nextFollowUp: "asc" }, { createdAt: "desc" }],
  });

  const active = jobs.filter(isActiveJob);

  const attention = active
    .filter((job) => {
      const state = getFollowUpState(job);
      return state === "OVERDUE" || state === "DUE_TODAY";
    })
    .sort((a, b) => {
      const stateA = getFollowUpState(a);
      const stateB = getFollowUpState(b);
      if (stateA === stateB) {
        return a.nextFollowUp.getTime() - b.nextFollowUp.getTime();
      }
      return stateA === "OVERDUE" ? -1 : 1;
    });

  const upcoming = active
    .filter((job) => getFollowUpState(job) === "UPCOMING")
    .slice(0, 8);

  const followUpsToday = active.filter(
    (job) => getFollowUpState(job) === "DUE_TODAY",
  ).length;
  const overdue = active.filter(
    (job) => getFollowUpState(job) === "OVERDUE",
  ).length;
  const openJobs = active.length;
  const scheduled = active.filter((job) => job.status === "SCHEDULED").length;

  const pipeline = await getPipelineCounts();

  return {
    attention,
    upcoming,
    metrics: {
      followUpsToday,
      overdue,
      openJobs,
      scheduled,
    },
    pipeline,
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
