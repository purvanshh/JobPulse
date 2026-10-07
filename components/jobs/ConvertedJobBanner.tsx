"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { Activity, Job } from "@prisma/client";

import { ChangeFollowUpButton } from "@/components/jobs/ChangeFollowUpButton";
import { FollowUpWorkflowButton } from "@/components/jobs/FollowUpWorkflowButton";
import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";

type JobWithActivity = Job & { activities?: Activity[] };

export function ConvertedJobBanner({ job }: { job: JobWithActivity }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const converted = searchParams.get("converted") === "1";
  const toasted = useRef(false);

  useEffect(() => {
    if (!converted || toasted.current) return;
    toasted.current = true;
    toast.success("Converted to job. Set status and follow-up next.");
  }, [converted]);

  if (!converted) return null;

  function dismiss() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("converted");
    const next = params.toString();
    router.replace(next ? `/jobs/${job.id}?${next}` : `/jobs/${job.id}`);
  }

  return (
    <section className="space-y-3 rounded-lg border border-nt-amber-border bg-nt-amber-subtle px-4 py-3 sm:px-5">
      <div>
        <p className="font-mono text-[10px] font-semibold tracking-widest text-nt-amber uppercase">
          Just converted
        </p>
        <h2 className="mt-1 font-display text-base font-bold tracking-tight text-white">
          Finish the handoff
        </h2>
        <p className="mt-0.5 text-xs text-nt-secondary">
          Customer and request are on this job. Set status, schedule the next
          follow-up, or record a call — then continue from Today.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <JobStatusSelect jobId={job.id} status={job.status} />
        <ChangeFollowUpButton jobId={job.id} label="Set follow-up" />
        <FollowUpWorkflowButton job={job} />
        <Link
          href="/"
          className="inline-flex h-8 items-center rounded-[4px] border border-[#27272A] px-3 font-mono text-xs text-nt-secondary hover:border-[#3F3F46] hover:text-white"
        >
          Back to Today
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex h-8 items-center px-2 font-mono text-xs text-nt-secondary hover:text-white"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}
