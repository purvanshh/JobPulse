import { z } from "zod";

import { JOB_SOURCES, JOB_STATUSES } from "@/types";

export const jobFormSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required."),
  company: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  jobDescription: z.string().trim().min(1, "Job description is required."),
  source: z.enum(JOB_SOURCES),
  status: z.enum(JOB_STATUSES),
  nextFollowUp: z.string().min(1, "Follow-up date is required."),
  notes: z.string().trim().optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
