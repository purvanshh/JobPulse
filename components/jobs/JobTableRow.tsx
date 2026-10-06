"use client";

import Link from "next/link";

import type { Job } from "@prisma/client";

import { JobStatusSelect } from "@/components/jobs/JobStatusSelect";
import { FollowUpStateBadge } from "@/components/jobs/FollowUpStateBadge";
import { formatDate } from "@/lib/dates";
import { JOB_SOURCE_LABELS } from "@/types";

import { TableCell, TableRow } from "@/components/ui/table";

export function JobTableRow({ job }: { job: Job }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{job.customerName}</TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground">
        {job.company ?? "—"}
      </TableCell>
      <TableCell className="max-w-xs truncate">{job.jobDescription}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <JobStatusSelect jobId={job.id} status={job.status} />
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-col gap-1">
          <span>{formatDate(job.nextFollowUp)}</span>
          <FollowUpStateBadge job={job} />
        </div>
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        {JOB_SOURCE_LABELS[job.source]}
      </TableCell>
      <TableCell className="hidden xl:table-cell text-muted-foreground">
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
  );
}
