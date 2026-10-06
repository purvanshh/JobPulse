import type { ActivityType, JobSource, JobStatus } from "@prisma/client";

export type { Activity, ActivityType, Job, JobSource, JobStatus } from "@prisma/client";

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  CONTACTED: "Customer contacted",
  NOTE: "Note added",
  STATUS_CHANGED: "Status changed",
};

export type FollowUpState =
  | "OVERDUE"
  | "DUE_TODAY"
  | "UPCOMING"
  | "COMPLETED";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  NEW: "New",
  WAITING_ON_QUOTE: "Waiting on Quote",
  WAITING_ON_CUSTOMER: "Waiting on Customer",
  SCHEDULED: "Scheduled",
  DONE: "Done",
};

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  PHONE: "Phone",
  WEBSITE: "Website",
  TEXT: "Text",
  REFERRAL: "Referral",
  REPEAT_CUSTOMER: "Repeat Customer",
  OTHER: "Other",
};

export const JOB_STATUSES = Object.keys(JOB_STATUS_LABELS) as JobStatus[];
export const JOB_SOURCES = Object.keys(JOB_SOURCE_LABELS) as JobSource[];
