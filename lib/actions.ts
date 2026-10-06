"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseDateInput } from "@/lib/dates";
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
};

function revalidateJobPaths(id?: string) {
  revalidatePath("/today");
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

  try {
    const job = await prisma.job.create({
      data: mapFormToJobData(parsed.data),
    });
    revalidateJobPaths();
    redirect(`/jobs/${job.id}`);
  } catch {
    return {
      ok: false,
      message: "Couldn't save this job. Please try again.",
    };
  }
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
    revalidateJobPaths(id);
    return { ok: true, message: "Job updated." };
  } catch {
    return {
      ok: false,
      message: "Couldn't update this job. Please try again.",
    };
  }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  try {
    await prisma.job.delete({ where: { id } });
    revalidateJobPaths();
    redirect("/jobs");
  } catch {
    return {
      ok: false,
      message: "Couldn't delete this job. Please try again.",
    };
  }
}

export async function updateJobStatus(
  id: string,
  status: JobFormValues["status"],
): Promise<ActionResult> {
  try {
    await prisma.job.update({
      where: { id },
      data: { status },
    });
    revalidateJobPaths(id);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Couldn't update the status. Please try again.",
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
