import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/jobs/ActivityTimeline";
import { DeleteJobButton } from "@/components/jobs/DeleteJobButton";
import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { JobForm } from "@/components/jobs/JobForm";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";
import { MarkContactedButton } from "@/components/jobs/MarkContactedButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/dates";
import { getJobActivities, getRecommendedAction } from "@/lib/follow-ups";
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

  const activities = await getJobActivities(id);

  return (
    <>
      <PageHeader
        title={job.customerName}
        description={job.jobDescription}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {job.phone ? (
              <a
                href={`tel:${job.phone.replace(/\s/g, "")}`}
                className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm font-medium hover:bg-muted"
              >
                Call
              </a>
            ) : null}
            <MarkContactedButton jobId={job.id} />
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
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">Next follow-up:</span>
                {formatDate(job.nextFollowUp)}
                <FollowUpStateBadge job={job} />
              </p>
              <p>
                <span className="text-muted-foreground">Recommended:</span>{" "}
                {getRecommendedAction(job.status)}
              </p>
              <p>
                <span className="text-muted-foreground">Created:</span>{" "}
                {formatDate(job.createdAt)}
              </p>
              <p>
                <span className="text-muted-foreground">Last updated:</span>{" "}
                {formatDate(job.updatedAt)}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>

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
