import Link from "next/link";
import { Suspense } from "react";

import { JobFilters } from "@/components/jobs/JobFilters";
import { JobsFlashToast } from "@/components/jobs/JobsFlashToast";
import { JobTable } from "@/components/jobs/JobTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { listJobs, type JobListFilters } from "@/lib/jobs";
import { cn } from "@/lib/utils";
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
    <>
      <PageHeader
        title="Jobs"
        description="Every open request in one place."
        actions={
          <Link href="/jobs/new" className={cn(buttonVariants())}>
            Add job
          </Link>
        }
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Suspense fallback={null}>
          <JobsFlashToast />
        </Suspense>
        <Suspense fallback={<div className="h-9 rounded-md bg-muted" aria-hidden />}>
          <JobFilters />
        </Suspense>

        {jobs.length === 0 ? (
          <EmptyState
            title={empty.title}
            description={empty.description}
            action={
              !hasFilters ? (
                <Link href="/jobs/new" className={cn(buttonVariants())}>
                  Add job
                </Link>
              ) : undefined
            }
          />
        ) : (
          <JobTable jobs={jobs} />
        )}
      </div>
    </>
  );
}
