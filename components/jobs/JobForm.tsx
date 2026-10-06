"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import type { Job } from "@prisma/client";

import { createJob, updateJob, type ActionResult } from "@/lib/actions";
import { addDaysFromToday, toDateInputValue } from "@/lib/dates";
import {
  JOB_SOURCE_LABELS,
  JOB_SOURCES,
  JOB_STATUS_LABELS,
  JOB_STATUSES,
} from "@/types";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type JobFormProps = {
  job?: Job;
  mode: "create" | "edit";
};

const initialState: ActionResult = { ok: false };

export function JobForm({ job, mode }: JobFormProps) {
  const action =
    mode === "create" ? createJob.bind(null) : updateJob.bind(null, job!.id);

  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);
  const [formKey, setFormKey] = useState(0);
  const [dismissedCreateId, setDismissedCreateId] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok && mode === "edit") {
      toast.success(state.message ?? "Job updated.");
      router.refresh();
    }
  }, [state, mode, router]);

  useEffect(() => {
    if (state.ok && mode === "create" && state.jobId) {
      toast.success("Job created.");
    }
  }, [state.ok, state.jobId, mode]);

  const createdJobId =
    mode === "create" && state.ok && state.jobId && state.jobId !== dismissedCreateId
      ? state.jobId
      : null;

  const defaultFollowUp =
    job?.nextFollowUp != null
      ? toDateInputValue(job.nextFollowUp)
      : toDateInputValue(addDaysFromToday(0));

  if (createdJobId) {
    return (
      <div className="space-y-4 rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-white">
            Job saved
          </h2>
          <p className="mt-1 text-xs text-nt-secondary">
            The request is in your list and will show on Today if follow-up is due.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/jobs/${createdJobId}`} className={cn(buttonVariants())}>
            View job
          </Link>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDismissedCreateId(createdJobId);
              setFormKey((value) => value + 1);
            }}
          >
            Add another
          </Button>
          <Link
            href="/jobs"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form key={formKey} action={formAction} className="space-y-8">
      {state.message && !state.ok ? (
        <p
          role="alert"
          className="rounded-[4px] border border-nt-red-border bg-nt-red-subtle px-3 py-2 font-mono text-xs text-nt-red"
        >
          {state.message}
        </p>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
          Customer
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="customerName"
            label="Customer name"
            required
            error={state.fieldErrors?.customerName}
          >
            <Input
              id="customerName"
              name="customerName"
              defaultValue={job?.customerName ?? ""}
              required
              autoFocus={mode === "create"}
            />
          </Field>
          <Field id="company" label="Company" error={state.fieldErrors?.company}>
            <Input id="company" name="company" defaultValue={job?.company ?? ""} />
          </Field>
          <Field id="phone" label="Phone" error={state.fieldErrors?.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={job?.phone ?? ""}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
          Job
        </h2>
        <Field
          id="jobDescription"
          label="Job description"
          required
          error={state.fieldErrors?.jobDescription}
        >
          <Textarea
            id="jobDescription"
            name="jobDescription"
            rows={3}
            defaultValue={job?.jobDescription ?? ""}
            required
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="source" label="Source" error={state.fieldErrors?.source}>
            <NativeSelect
              id="source"
              name="source"
              defaultValue={job?.source ?? "OTHER"}
              options={JOB_SOURCES.map((source) => ({
                value: source,
                label: JOB_SOURCE_LABELS[source],
              }))}
            />
          </Field>
          <Field id="status" label="Status" error={state.fieldErrors?.status}>
            <NativeSelect
              id="status"
              name="status"
              defaultValue={job?.status ?? "NEW"}
              options={JOB_STATUSES.map((status) => ({
                value: status,
                label: JOB_STATUS_LABELS[status],
              }))}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
          Follow-up
        </h2>
        <Field
          id="nextFollowUp"
          label="Next follow-up"
          required
          error={state.fieldErrors?.nextFollowUp}
        >
          <Input
            id="nextFollowUp"
            name="nextFollowUp"
            type="date"
            defaultValue={defaultFollowUp}
            required
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
          Notes
        </h2>
        <Field id="notes" label="Notes" error={state.fieldErrors?.notes}>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={job?.notes ?? ""}
          />
        </Field>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create job"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function NativeSelect({
  id,
  name,
  defaultValue,
  options,
}: {
  id: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      className={cn(
        "flex h-9 w-full rounded-[4px] border border-[#27272A] bg-[#0A0A0A] px-3 font-mono text-xs text-white outline-none focus-visible:border-white",
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="font-mono text-[11px] text-nt-red">{error}</p> : null}
    </div>
  );
}
