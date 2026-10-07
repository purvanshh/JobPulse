"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { Activity, Job } from "@prisma/client";

import { markJobContacted } from "@/lib/actions";
import { addDaysFromToday, toDateInputValue } from "@/lib/dates";
import { getRecommendedAction } from "@/lib/follow-up-rules";
import { JOB_STATUS_LABELS, JOB_STATUSES } from "@/types";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type JobWithActivity = Job & { activities?: Activity[] };

const nextFollowUpPresets = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "three_days", label: "In 3 days" },
  { value: "next_week", label: "Next week" },
  { value: "custom", label: "Custom" },
] as const;

export function FollowUpWorkflowButton({
  job,
  triggerClassName,
  defaultOpen = false,
}: {
  job: JobWithActivity;
  triggerClassName?: string;
  defaultOpen?: boolean;
}) {
  const router = useRouter();
  const actionLabel = getRecommendedAction(job.status);
  const [open, setOpen] = useState(defaultOpen);
  const [preset, setPreset] =
    useState<(typeof nextFollowUpPresets)[number]["value"]>("tomorrow");
  const [statusValue, setStatusValue] = useState(job.status);
  const [pending, startTransition] = useTransition();

  if (job.status === "SCHEDULED" || job.status === "DONE") {
    return (
      <Link
        href={`/jobs/${job.id}`}
        className={cn(buttonVariants({ size: "sm" }), triggerClassName)}
      >
        {job.status === "SCHEDULED" ? "View job" : "Open"}
      </Link>
    );
  }

  const callHref = job.phone ? `tel:${job.phone.replace(/\s/g, "")}` : null;

  function reset() {
    setPreset("tomorrow");
    setStatusValue(job.status);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        className={cn(buttonVariants({ size: "sm" }), triggerClassName)}
      >
        {actionLabel}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await markJobContacted(job.id, formData);
              if (result.ok) {
                toast.success(result.message ?? "Follow-up saved.");
                setOpen(false);
                reset();
                router.refresh();
              } else {
                toast.error(result.message ?? "Couldn't save this follow-up.");
              }
            });
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>{actionLabel}</DialogTitle>
            <DialogDescription className="text-xs text-nt-secondary">
              {job.customerName}
              {job.company ? ` · ${job.company}` : ""} — record the call and set
              the next check-in. Status stays the same unless you change it.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-2 rounded-[4px] border border-nt-border bg-[#0A0A0A] px-3 py-2">
            <span className="font-mono text-[10px] tracking-widest text-nt-secondary uppercase">
              Customer contacted?
            </span>
            <span className="rounded-[4px] border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
              Yes — saving records contact
            </span>
            {callHref ? (
              <a
                href={callHref}
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "ml-auto",
                )}
              >
                Call {job.phone}
              </a>
            ) : (
              <span className="ml-auto font-mono text-[10px] text-nt-secondary">
                No phone on file
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`workflow-note-${job.id}`}>Notes</Label>
            <Textarea
              id={`workflow-note-${job.id}`}
              name="note"
              rows={3}
              autoFocus
              placeholder="Left voicemail. Customer said they will call back tomorrow."
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Next follow-up</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {nextFollowUpPresets.map((item) => (
                <label
                  key={item.value}
                  className="flex cursor-pointer items-center gap-2 rounded-[4px] border border-[#27272A] px-3 py-2 text-xs"
                >
                  <input
                    type="radio"
                    name="preset"
                    value={item.value}
                    checked={preset === item.value}
                    onChange={() => setPreset(item.value)}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>

          {preset === "custom" ? (
            <div className="space-y-1.5">
              <Label htmlFor={`workflow-custom-${job.id}`}>Custom date</Label>
              <Input
                id={`workflow-custom-${job.id}`}
                name="customDate"
                type="date"
                defaultValue={toDateInputValue(addDaysFromToday(1))}
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor={`workflow-status-${job.id}`}>
              Status{" "}
              <span className="font-normal text-nt-secondary">(optional)</span>
            </Label>
            <select
              id={`workflow-status-${job.id}`}
              name="status"
              value={statusValue}
              onChange={(event) =>
                setStatusValue(event.target.value as Job["status"])
              }
              className="flex h-9 w-full rounded-[4px] border border-[#27272A] bg-[#0A0A0A] px-3 font-mono text-xs text-white outline-none focus-visible:border-white"
            >
              {JOB_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {JOB_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Saving…" : "Save follow-up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
