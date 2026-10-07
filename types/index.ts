import type {
  ActivityType,
  InboundSource,
  InboundStatus,
  JobSource,
  JobStatus,
} from "@prisma/client";

export type {
  Activity,
  ActivityType,
  InboundRequest,
  InboundSource,
  InboundStatus,
  Job,
  JobSource,
  JobStatus,
} from "@prisma/client";

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
  EMAIL: "Email",
  TEXT: "Text",
  REFERRAL: "Referral",
  NOTEBOOK: "Notebook",
  REPEAT_CUSTOMER: "Repeat Customer",
  OTHER: "Other",
};

export const INBOUND_SOURCE_LABELS: Record<InboundSource, string> = {
  PHONE: "Phone",
  WEBSITE: "Website",
  EMAIL: "Email",
  TEXT: "Text",
  REFERRAL: "Referral",
  NOTEBOOK: "Notebook",
};

export const INBOUND_STATUS_LABELS: Record<InboundStatus, string> = {
  NEW: "New",
  REVIEWED: "Reviewed",
  CONVERTED: "Converted",
  DISMISSED: "Dismissed",
};

export const JOB_STATUSES = Object.keys(JOB_STATUS_LABELS) as JobStatus[];
export const JOB_SOURCES = Object.keys(JOB_SOURCE_LABELS) as JobSource[];
export const INBOUND_SOURCES = Object.keys(
  INBOUND_SOURCE_LABELS,
) as InboundSource[];
export const INBOUND_STATUSES = Object.keys(
  INBOUND_STATUS_LABELS,
) as InboundStatus[];
