import Link from "next/link";

import type { Job } from "@prisma/client";

import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
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
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden lg:table-cell">Company</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Follow-up</TableHead>
            <TableHead className="hidden xl:table-cell">Source</TableHead>
            <TableHead className="hidden xl:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.customerName}</TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {job.company ?? "—"}
              </TableCell>
              <TableCell className="max-w-xs truncate">{job.jobDescription}</TableCell>
              <TableCell>
                <JobStatusBadge status={job.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(job.nextFollowUp)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
