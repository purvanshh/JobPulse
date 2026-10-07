import type { InboundSource, InboundStatus, JobSource, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export function inboundSourceToJobSource(source: InboundSource): JobSource {
  return source;
}

export async function listInboundRequests() {
  return prisma.inboundRequest.findMany({
    orderBy: [{ receivedAt: "desc" }],
  });
}

export async function getInboundRequestById(id: string) {
  return prisma.inboundRequest.findUnique({
    where: { id },
    include: { job: true },
  });
}

export async function getInboundRequestForJob(jobId: string) {
  return prisma.inboundRequest.findUnique({
    where: { jobId },
  });
}

export async function countNewInboundRequests() {
  return prisma.inboundRequest.count({
    where: { status: "NEW" },
  });
}

export async function listNewInboundRequests() {
  return prisma.inboundRequest.findMany({
    where: { status: "NEW" },
    orderBy: [{ receivedAt: "desc" }],
  });
}

export function sortInboxRequests<
  T extends { status: InboundStatus; receivedAt: Date },
>(requests: T[]): T[] {
  const statusRank: Record<InboundStatus, number> = {
    NEW: 0,
    REVIEWED: 1,
    CONVERTED: 2,
    DISMISSED: 3,
  };

  return [...requests].sort((a, b) => {
    const byStatus = statusRank[a.status] - statusRank[b.status];
    if (byStatus !== 0) return byStatus;
    return b.receivedAt.getTime() - a.receivedAt.getTime();
  });
}

export type CreateInboundInput = {
  source: InboundSource;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  receivedAt?: Date;
};

export async function createInboundRequestRecord(
  input: CreateInboundInput,
  tx: Prisma.TransactionClient | typeof prisma = prisma,
) {
  return tx.inboundRequest.create({
    data: {
      source: input.source,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail ?? null,
      message: input.message,
      receivedAt: input.receivedAt ?? new Date(),
      status: "NEW",
    },
  });
}
