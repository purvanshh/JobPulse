import Link from "next/link";
import { Suspense } from "react";

import { JobFilters } from "@/components/jobs/JobFilters";
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
  }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const filters: JobListFilters = {
    q: params.q,
    status: params.status as JobStatus | undefined,
    followUp: params.followUp as JobListFilters["followUp"],
  };

  const jobs = await listJobs(filters);
  const hasFilters = Boolean(params.q || params.status || params.followUp);

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
        <Suspense fallback={<div className="h-9 rounded-md bg-muted" />}>
          <JobFilters />
        </Suspense>

        {jobs.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No jobs match your search." : "No jobs yet."}
            description={
              hasFilters
                ? "Try adjusting your search or filters."
                : "Add your first job to start tracking follow-ups."
            }
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
