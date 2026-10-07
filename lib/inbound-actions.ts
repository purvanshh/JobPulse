"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addDaysFromToday } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { formatReceivedExact } from "@/lib/format-received";
import {
  createInboundRequestRecord,
  inboundSourceToJobSource,
} from "@/lib/inbound";
import {
  formatZodErrors,
  inboundRequestSchema,
} from "@/lib/validations";
import { INBOUND_SOURCE_LABELS } from "@/types";
import type { InboundStatus } from "@prisma/client";

export type InboundActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  requestId?: string;
  jobId?: string;
};

function revalidateInboundPaths(jobId?: string) {
  try {
    revalidatePath("/");
    revalidatePath("/inbox");
    revalidatePath("/jobs");
    if (jobId) {
      revalidatePath(`/jobs/${jobId}`);
    }
  } catch {
    // No-op outside a Next.js request context (scripts/tests).
  }
}

function parseReceivedAt(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export async function createInboundRequest(
  _prev: InboundActionResult | undefined,
  formData: FormData,
): Promise<InboundActionResult> {
  const parsed = inboundRequestSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, fieldErrors: formatZodErrors(parsed.error) };
  }

  try {
    const request = await createInboundRequestRecord({
      source: parsed.data.source,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerEmail: parsed.data.customerEmail,
      message: parsed.data.message,
      receivedAt: parseReceivedAt(parsed.data.receivedAt),
    });

    revalidateInboundPaths();
    return {
      ok: true,
      requestId: request.id,
      message: "Request added to inbox.",
    };
  } catch {
    return {
      ok: false,
      message: "Couldn't save this request. Please try again.",
    };
  }
}

export async function simulateInboundRequest(
  formData: FormData,
): Promise<InboundActionResult> {
  return createInboundRequest(undefined, formData);
}

export async function updateInboundRequestStatus(
  id: string,
  status: Extract<InboundStatus, "REVIEWED" | "DISMISSED">,
): Promise<InboundActionResult> {
  try {
    const existing = await prisma.inboundRequest.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, message: "Request not found." };
    }
    if (existing.status === "CONVERTED") {
      return {
        ok: false,
        message: "Converted requests can't change status.",
      };
    }

    await prisma.inboundRequest.update({
      where: { id },
      data: { status },
    });
  } catch {
    return {
      ok: false,
      message: "Couldn't update this request. Please try again.",
    };
  }

  revalidateInboundPaths();
  return {
    ok: true,
    message: status === "REVIEWED" ? "Marked reviewed." : "Request dismissed.",
  };
}

export async function convertInboundRequestToJob(
  id: string,
): Promise<InboundActionResult> {
  let jobId: string;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.inboundRequest.findUnique({ where: { id } });
      if (!request) {
        return { error: "Request not found." as const };
      }

      if (request.jobId) {
        return { jobId: request.jobId, alreadyConverted: true as const };
      }

      const job = await tx.job.create({
        data: {
          customerName: request.customerName,
          phone: request.customerPhone,
          email: request.customerEmail,
          jobDescription: request.message,
          source: inboundSourceToJobSource(request.source),
          status: "NEW",
          nextFollowUp: addDaysFromToday(0),
          notes: null,
        },
      });

      const sourceLabel = INBOUND_SOURCE_LABELS[request.source];

      await tx.activity.create({
        data: {
          jobId: job.id,
          type: "NOTE",
          note: `Request received via ${sourceLabel} · ${formatReceivedExact(request.receivedAt)}.`,
          createdAt: request.receivedAt,
        },
      });

      await tx.activity.create({
        data: {
          jobId: job.id,
          type: "NOTE",
          note: "Converted from inbound request to Job.",
        },
      });

      const claimed = await tx.inboundRequest.updateMany({
        where: { id, jobId: null },
        data: {
          status: "CONVERTED",
          jobId: job.id,
        },
      });

      if (claimed.count === 0) {
        const latest = await tx.inboundRequest.findUnique({ where: { id } });
        if (latest?.jobId) {
          await tx.job.delete({ where: { id: job.id } });
          return { jobId: latest.jobId, alreadyConverted: true as const };
        }
        return { error: "Couldn't convert this request." as const };
      }

      return { jobId: job.id, alreadyConverted: false as const };
    });

    if ("error" in result) {
      return { ok: false, message: result.error };
    }

    jobId = result.jobId;
  } catch {
    return {
      ok: false,
      message: "Couldn't convert this request. Please try again.",
    };
  }

  revalidateInboundPaths(jobId);
  redirect(`/jobs/${jobId}?converted=1`);
}
