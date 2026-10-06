import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteJobButton } from "@/components/jobs/DeleteJobButton";
import { JobForm } from "@/components/jobs/JobForm";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/dates";
import { getJobById } from "@/lib/jobs";
import { JOB_SOURCE_LABELS } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={job.customerName}
        description={job.jobDescription}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <JobStatusSelect jobId={job.id} status={job.status} />
            <DeleteJobButton jobId={job.id} />
          </div>
        }
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Company:</span>{" "}
                {job.company ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span>{" "}
                {job.phone ? (
                  <a href={`tel:${job.phone}`} className="text-primary hover:underline">
                    {job.phone}
                  </a>
                ) : (
                  "—"
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Source:</span>{" "}
                {JOB_SOURCE_LABELS[job.source]}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <JobStatusBadge status={job.status} />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Follow-up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Next follow-up:</span>{" "}
                {formatDate(job.nextFollowUp)}
              </p>
              <p>
                <span className="text-muted-foreground">Created:</span>{" "}
                {formatDate(job.createdAt)}
              </p>
            </CardContent>
          </Card>
        </div>

        {job.notes ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
              {job.notes}
            </CardContent>
          </Card>
        ) : null}

        <Separator />

        <Card className="max-w-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Edit job</CardTitle>
            <Link href="/jobs" className="text-sm text-primary hover:underline">
              Back to jobs
            </Link>
          </CardHeader>
          <CardContent>
            <JobForm mode="edit" job={job} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
