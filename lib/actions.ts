"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addDaysFromToday, parseDateInput } from "@/lib/dates";
import { prisma } from "@/lib/db";
import {
  formatZodErrors,
  jobFormSchema,
  type JobFormValues,
} from "@/lib/validations";

export type ActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  jobId?: string;
};

function revalidateJobPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/jobs");
  if (id) {
    revalidatePath(`/jobs/${id}`);
  }
}

export async function createJob(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = jobFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, fieldErrors: formatZodErrors(parsed.error) };
  }

  let jobId: string;

  try {
    const job = await prisma.job.create({
      data: mapFormToJobData(parsed.data),
    });
    jobId = job.id;

    await prisma.activity.create({
      data: {
        jobId: job.id,
        type: "NOTE",
        note: "Job created.",
      },
    });
  } catch {
    return {
      ok: false,
      message: "Couldn't save this job. Please try again.",
    };
  }

  revalidateJobPaths(jobId);
  return {
    ok: true,
    jobId,
    message: "Job created.",
  };
}

export async function updateJob(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = jobFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, fieldErrors: formatZodErrors(parsed.error) };
  }

  try {
    await prisma.job.update({
      where: { id },
      data: mapFormToJobData(parsed.data),
    });
  } catch {
    return {
      ok: false,
      message: "Couldn't update this job. Please try again.",
    };
  }

  revalidateJobPaths(id);
  return { ok: true, message: "Job updated." };
}

export async function deleteJob(id: string): Promise<ActionResult> {
  try {
    await prisma.job.delete({ where: { id } });
  } catch {
    return {
      ok: false,
      message: "Couldn't delete this job. Please try again.",
    };
  }

  revalidateJobPaths();
  redirect("/jobs?deleted=1");
}

export async function updateJobStatus(
  id: string,
  status: JobFormValues["status"],
): Promise<ActionResult> {
  try {
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, message: "Job not found." };
    }

    await prisma.$transaction([
      prisma.job.update({
        where: { id },
        data: { status },
      }),
      ...(existing.status !== status
        ? [
            prisma.activity.create({
              data: {
                jobId: id,
                type: "STATUS_CHANGED",
                note: `Status changed to ${status.replaceAll("_", " ").toLowerCase()}.`,
              },
            }),
          ]
        : []),
    ]);

    revalidateJobPaths(id);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Couldn't update the status. Please try again.",
    };
  }
}

export async function markJobContacted(
  jobId: string,
  formData: FormData,
): Promise<ActionResult> {
  const note = String(formData.get("note") ?? "").trim();
  const preset = String(formData.get("preset") ?? "tomorrow");
  const customDate = String(formData.get("customDate") ?? "");

  let nextFollowUp = addDaysFromToday(1);
  if (preset === "today") {
    nextFollowUp = addDaysFromToday(0);
  } else if (preset === "three_days") {
    nextFollowUp = addDaysFromToday(3);
  } else if (preset === "next_week") {
    nextFollowUp = addDaysFromToday(7);
  } else if (preset === "custom" && customDate) {
    nextFollowUp = parseDateInput(customDate);
  }

  try {
    await prisma.$transaction([
      prisma.job.update({
        where: { id: jobId },
        data: { nextFollowUp },
      }),
      prisma.activity.create({
        data: {
          jobId,
          type: "CONTACTED",
          note: note || "Customer contacted.",
        },
      }),
    ]);
    revalidateJobPaths(jobId);
    return { ok: true, message: "Follow-up updated." };
  } catch {
    return {
      ok: false,
      message: "Couldn't record this contact. Please try again.",
    };
  }
}

export async function setJobFollowUp(
  jobId: string,
  dateValue: string,
): Promise<ActionResult> {
  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { nextFollowUp: parseDateInput(dateValue) },
    });
    revalidateJobPaths(jobId);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Couldn't update the follow-up date. Please try again.",
    };
  }
}

export async function addJobNoteActivity(
  jobId: string,
  note: string,
): Promise<ActionResult> {
  if (!note.trim()) {
    return { ok: false, message: "Note cannot be empty." };
  }

  try {
    await prisma.activity.create({
      data: {
        jobId,
        type: "NOTE",
        note: note.trim(),
      },
    });
    revalidateJobPaths(jobId);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Couldn't save this note. Please try again.",
    };
  }
}

function mapFormToJobData(values: JobFormValues) {
  return {
    customerName: values.customerName,
    company: values.company || null,
    phone: values.phone || null,
    jobDescription: values.jobDescription,
    source: values.source,
    status: values.status,
    nextFollowUp: parseDateInput(values.nextFollowUp),
    notes: values.notes || null,
  };
}
