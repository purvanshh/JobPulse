import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/jobs/ActivityTimeline";
import { ChangeFollowUpButton } from "@/components/jobs/ChangeFollowUpButton";
import { DeleteJobButton } from "@/components/jobs/DeleteJobButton";
import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { FollowUpWorkflowButton } from "@/components/jobs/FollowUpWorkflowButton";
import { JobForm } from "@/components/jobs/JobForm";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDate, formatLongDate } from "@/lib/dates";
import {
  getFollowUpDescription,
  getJobActivities,
  getRecommendedAction,
} from "@/lib/follow-ups";
import { getJobById } from "@/lib/jobs";
import { buttonVariants } from "@/components/ui/button";
import { JOB_SOURCE_LABELS } from "@/types";
import { cn } from "@/lib/utils";

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
  const recommended = getRecommendedAction(job.status);
  const callHref = job.phone ? `tel:${job.phone.replace(/\s/g, "")}` : null;

  return (
    <>
      <PageHeader
        title={job.customerName}
        description={job.jobDescription}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {job.status !== "DONE" && job.status !== "SCHEDULED" ? (
              <FollowUpWorkflowButton job={{ ...job, activities: activities.slice(0, 1) }} />
            ) : (
              <span className="text-sm text-muted-foreground">{recommended}</span>
            )}
            {callHref ? (
              <a
                href={callHref}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Call
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">No phone number</span>
            )}
            <ChangeFollowUpButton jobId={job.id} label="Change follow-up" />
            <JobStatusSelect jobId={job.id} status={job.status} />
            <DeleteJobButton jobId={job.id} />
          </div>
        }
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Who</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Customer:</span>{" "}
                {job.customerName}
              </p>
              <p>
                <span className="text-muted-foreground">Company:</span>{" "}
                {job.company ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span>{" "}
                {callHref ? (
                  <a href={callHref} className="text-primary hover:underline">
                    {job.phone}
                  </a>
                ) : (
                  "No phone number"
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-muted/20">
            <CardHeader>
              <CardTitle className="text-base">What to do next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Next follow-up
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {formatLongDate(job.nextFollowUp)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <FollowUpStateBadge job={job} />
                <JobStatusBadge status={job.status} />
              </div>
              <p className="font-medium">{getFollowUpDescription(job)}</p>
              {recommended !== "No Action" ? (
                <p>
                  <span className="text-muted-foreground">Recommended:</span>{" "}
                  <span className="font-medium text-primary">{recommended}</span>
                </p>
              ) : (
                <p className="text-muted-foreground">No follow-up action needed.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="leading-relaxed">{job.jobDescription}</p>
              <p>
                <span className="text-muted-foreground">Source:</span>{" "}
                {JOB_SOURCE_LABELS[job.source]}
              </p>
              {job.notes ? (
                <div className="pt-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Notes
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                    {job.notes}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Where it stands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <JobStatusBadge status={job.status} />
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">What happened</CardTitle>
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
