import type { JobStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { toDateOnly } from "@/lib/dates";

export type JobListFilters = {
  q?: string;
  status?: JobStatus;
  followUp?: "overdue" | "today" | "upcoming" | "none";
};

export async function listJobs(filters: JobListFilters = {}) {
  const where: Prisma.JobWhereInput = {};
  const today = toDateOnly(new Date());

  if (filters.q?.trim()) {
    const query = filters.q.trim();
    where.OR = [
      { customerName: { contains: query } },
      { company: { contains: query } },
      { jobDescription: { contains: query } },
      { phone: { contains: query } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.followUp === "none") {
    where.status = "DONE";
  } else if (filters.followUp) {
    where.status = filters.status ?? { not: "DONE" };
    if (filters.followUp === "overdue") {
      where.nextFollowUp = { lt: today };
    } else if (filters.followUp === "today") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      where.nextFollowUp = { gte: today, lt: tomorrow };
    } else if (filters.followUp === "upcoming") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      where.nextFollowUp = { gte: tomorrow };
    }
  }

  return prisma.job.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({ where: { id } });
}
