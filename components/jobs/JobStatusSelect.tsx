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
}: {
  jobId: string;
  status: JobStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="Job status"
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
