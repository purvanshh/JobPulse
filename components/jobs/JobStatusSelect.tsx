"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { JobStatus } from "@prisma/client";

import { updateJobStatus } from "@/lib/actions";
import { JOB_STATUS_LABELS, JOB_STATUSES } from "@/types";
import { toast } from "sonner";

export function JobStatusSelect({
  jobId,
  status,
  variant = "default",
}: {
  jobId: string;
  status: JobStatus;
  variant?: "default" | "telemetry";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="Job status"
      className={
        variant === "telemetry"
          ? "max-w-full min-w-0 rounded-[4px] border border-nt-border bg-[#18181A] px-2 py-0.5 font-mono text-[11px] text-white outline-none focus:border-white focus:ring-0 disabled:opacity-50"
          : "h-9 rounded-[4px] border border-input bg-[#0A0A0A] px-3 text-sm text-foreground outline-none focus:border-white"
      }
      value={status}
      disabled={pending}
      onChange={(event) => {
        const nextStatus = event.target.value as JobStatus;
        startTransition(async () => {
          const result = await updateJobStatus(jobId, nextStatus);
          if (result.ok) {
            toast.success("Status updated.");
            router.refresh();
          } else {
            toast.error(result.message ?? "Couldn't update the status.");
          }
        });
      }}
    >
      {JOB_STATUSES.map((item) => (
        <option key={item} value={item}>
          {JOB_STATUS_LABELS[item]}
        </option>
      ))}
    </select>
  );
}
