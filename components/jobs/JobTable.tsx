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
      <div className="hidden overflow-x-auto rounded-lg border border-nt-border bg-nt-surface md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead className="hidden lg:table-cell">Company</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Follow-up</TableHead>
              <TableHead className="hidden xl:table-cell">Source</TableHead>
              <TableHead className="hidden xl:table-cell">Created</TableHead>
              <TableHead className="text-right">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium text-white">
                  {job.customerName}
                </TableCell>
                <TableCell className="hidden text-nt-secondary lg:table-cell">
                  {job.company ?? "—"}
                </TableCell>
                <TableCell className="max-w-xs truncate text-neutral-300">
                  {job.jobDescription}
                </TableCell>
                <TableCell>
                  <JobStatusSelect jobId={job.id} status={job.status} variant="telemetry" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-mono text-[11px] text-nt-secondary">
                      {formatDate(job.nextFollowUp)}
                    </span>
                    <FollowUpStateBadge job={job} />
                  </div>
                </TableCell>
                <TableCell className="hidden font-mono text-[11px] text-nt-secondary xl:table-cell">
                  {JOB_SOURCE_LABELS[job.source]}
                </TableCell>
                <TableCell className="hidden font-mono text-[11px] text-nt-secondary xl:table-cell">
                  {formatDate(job.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-mono text-xs font-medium text-white hover:text-nt-muted hover:underline"
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
            className="min-w-0 space-y-2 rounded-md border border-nt-border bg-nt-card p-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-sm font-semibold tracking-tight text-white">
                {job.customerName}
              </h3>
              <JobStatusSelect jobId={job.id} status={job.status} variant="telemetry" />
            </div>
            {job.company ? (
              <p className="text-xs font-medium text-nt-muted">{job.company}</p>
            ) : null}
            <p className="text-xs text-neutral-300">{job.jobDescription}</p>
            <div className="flex flex-wrap items-center gap-2">
              <FollowUpStateBadge job={job} />
              <span className="font-mono text-[11px] text-nt-secondary">
                {formatDate(job.nextFollowUp)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-nt-secondary">
                {JOB_SOURCE_LABELS[job.source]}
              </span>
              <Link
                href={`/jobs/${job.id}`}
                className="font-mono text-xs font-medium text-white hover:underline"
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
