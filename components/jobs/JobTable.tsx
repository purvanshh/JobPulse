"use client";

import Link from "next/link";

import type { Job } from "@prisma/client";

import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";
import { formatDate } from "@/lib/dates";
import { JOB_SOURCE_LABELS } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function JobTable({ jobs }: { jobs: Job[] }) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden lg:table-cell">Company</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Follow-up</TableHead>
              <TableHead className="hidden xl:table-cell">Source</TableHead>
              <TableHead className="hidden xl:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.customerName}</TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {job.company ?? "—"}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {job.jobDescription}
                </TableCell>
                <TableCell>
                  <JobStatusSelect jobId={job.id} status={job.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{formatDate(job.nextFollowUp)}</span>
                    <FollowUpStateBadge job={job} />
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {JOB_SOURCE_LABELS[job.source]}
                </TableCell>
                <TableCell className="hidden text-muted-foreground xl:table-cell">
                  {formatDate(job.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Open
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="space-y-3 rounded-xl border border-border bg-card p-4"
          >
            <div>
              <h3 className="font-semibold">{job.customerName}</h3>
              {job.company ? (
                <p className="text-sm text-muted-foreground">{job.company}</p>
              ) : null}
              <p className="mt-1 text-sm">{job.jobDescription}</p>
            </div>
            <JobStatusSelect jobId={job.id} status={job.status} />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <FollowUpStateBadge job={job} />
              <span className="text-muted-foreground">
                {formatDate(job.nextFollowUp)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {JOB_SOURCE_LABELS[job.source]}
              </span>
              <Link
                href={`/jobs/${job.id}`}
                className="font-medium text-primary hover:underline"
              >
                Open
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
