import { z } from "zod";

import { INBOUND_SOURCES, JOB_SOURCES, JOB_STATUSES } from "@/types";

const dateInputSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid follow-up date.");

const optionalEmailSchema = z.preprocess(
  (value) => {
    if (value == null) return undefined;
    const trimmed = String(value).trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.email("Enter a valid email.").optional(),
);

export const jobFormSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required."),
  company: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: optionalEmailSchema,
  jobDescription: z.string().trim().min(1, "Job description is required."),
  source: z.enum(JOB_SOURCES),
  status: z.enum(JOB_STATUSES),
  nextFollowUp: dateInputSchema,
  notes: z.string().trim().optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

const datetimeLocalSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || !Number.isNaN(Date.parse(value)),
    "Enter a valid received time.",
  );

export const inboundRequestSchema = z.object({
  source: z.enum(INBOUND_SOURCES),
  customerName: z.string().trim().min(1, "Customer name is required."),
  customerPhone: z.string().trim().min(1, "Phone is required."),
  customerEmail: optionalEmailSchema,
  message: z.string().trim().min(1, "Request description is required."),
  receivedAt: datetimeLocalSchema,
});

export type InboundRequestValues = z.infer<typeof inboundRequestSchema>;

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
