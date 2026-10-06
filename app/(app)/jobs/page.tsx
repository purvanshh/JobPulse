import Link from "next/link";
import { Suspense } from "react";

import { JobFilters } from "@/components/jobs/JobFilters";
import { JobsFlashToast } from "@/components/jobs/JobsFlashToast";
import { JobTable } from "@/components/jobs/JobTable";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { listJobs, type JobListFilters } from "@/lib/jobs";
import type { JobStatus } from "@prisma/client";

type JobsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    followUp?: string;
    created?: string;
    deleted?: string;
  }>;
};

function emptyCopy(filters: {
  q?: string;
  status?: string;
  followUp?: string;
}) {
  if (filters.followUp === "overdue") {
    return {
      title: "No overdue jobs",
      description: "Nothing has slipped past its follow-up date.",
    };
  }
  if (filters.followUp === "today") {
    return {
      title: "You're all caught up.",
      description: "No follow-ups are due today.",
    };
  }
  if (filters.followUp === "upcoming") {
    return {
      title: "No upcoming follow-ups",
      description: "Schedule a next follow-up on a job to see it here.",
    };
  }
  if (filters.followUp === "none") {
    return {
      title: "No completed jobs yet",
      description: "Jobs marked Done show up here when follow-up is finished.",
    };
  }
  if (filters.q || filters.status) {
    return {
      title: "No jobs match your search.",
      description: "Try adjusting your search or filters.",
    };
  }
  return {
    title: "No jobs yet.",
    description: "Add your first job to start tracking follow-ups.",
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const filters: JobListFilters = {
    q: params.q,
    status: params.status as JobStatus | undefined,
    followUp: params.followUp as JobListFilters["followUp"],
  };

  const jobs = await listJobs(filters);
  const hasFilters = Boolean(params.q || params.status || params.followUp);
  const empty = emptyCopy(params);

  return (
    <PageFrame>
      <PageHeader
        title="Jobs"
        description="Every open request in one place."
        actions={
          <Link href="/jobs/new" className={addJobClass}>
            <span className="font-mono text-sm leading-none font-bold">+</span>
            Add job
          </Link>
        }
      />
      <Suspense fallback={null}>
        <JobsFlashToast />
      </Suspense>
      <Suspense fallback={<div className="h-9 rounded-[4px] border border-nt-border bg-nt-surface" aria-hidden />}>
        <JobFilters />
      </Suspense>

      {jobs.length === 0 ? (
        <EmptyState
          title={empty.title}
          description={empty.description}
          action={
            !hasFilters ? (
              <Link href="/jobs/new" className={addJobClass}>
                <span className="font-mono text-sm leading-none font-bold">+</span>
                Add job
              </Link>
            ) : undefined
          }
        />
      ) : (
        <JobTable jobs={jobs} />
      )}
    </PageFrame>
  );
}

const addJobClass =
  "inline-flex items-center gap-1.5 rounded-[4px] bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-200";
