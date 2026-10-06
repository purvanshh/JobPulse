"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { Activity, Job } from "@prisma/client";

import { markJobContacted } from "@/lib/actions";
import { addDaysFromToday, formatDate, toDateInputValue } from "@/lib/dates";
import { getRecommendedAction } from "@/lib/follow-ups";
import { JOB_STATUS_LABELS } from "@/types";
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
  { value: "tomorrow", label: "Tomorrow" },
  { value: "three_days", label: "3 Days" },
  { value: "next_week", label: "Next Week" },
  { value: "custom", label: "Custom" },
] as const;

export function FollowUpWorkflowButton({ job }: { job: JobWithActivity }) {
  const router = useRouter();
  const actionLabel = getRecommendedAction(job.status);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"review" | "next">("review");
  const [preset, setPreset] =
    useState<(typeof nextFollowUpPresets)[number]["value"]>("tomorrow");
  const [pending, startTransition] = useTransition();

  if (job.status === "SCHEDULED" || job.status === "DONE") {
    return (
      <Link
        href={`/jobs/${job.id}`}
        className={cn(buttonVariants({ size: "sm" }))}
      >
        {job.status === "SCHEDULED" ? "View job" : "Open"}
      </Link>
    );
  }

  const latest = job.activities?.[0];
  const callHref = job.phone ? `tel:${job.phone.replace(/\s/g, "")}` : null;

  function reset() {
    setStep("review");
    setPreset("tomorrow");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger className={cn(buttonVariants({ size: "sm" }))}>
        {actionLabel}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {step === "review" ? (
          <>
            <DialogHeader>
              <DialogTitle>{actionLabel}</DialogTitle>
              <DialogDescription>
                Review the details, then mark contacted when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Customer
                </p>
                <p className="font-medium">{job.customerName}</p>
                {job.company ? (
                  <p className="text-muted-foreground">{job.company}</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Phone
                </p>
                {callHref ? (
                  <a href={callHref} className="font-medium text-primary hover:underline">
                    {job.phone}
                  </a>
                ) : (
                  <p className="text-muted-foreground">No phone number</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Status
                </p>
                <p className="font-medium">{JOB_STATUS_LABELS[job.status]}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Last activity
                </p>
                <p className="text-muted-foreground">
                  {latest
                    ? `${formatDate(latest.createdAt)} — ${latest.note ?? latest.type}`
                    : "No activity yet"}
                </p>
              </div>
              {job.notes ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Notes
                  </p>
                  <p className="whitespace-pre-wrap text-muted-foreground">{job.notes}</p>
                </div>
              ) : null}
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              {callHref ? (
                <a href={callHref} className={cn(buttonVariants({ variant: "outline" }))}>
                  Call
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">No phone number</span>
              )}
              <Button type="button" onClick={() => setStep("next")}>
                Mark contacted
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await markJobContacted(job.id, formData);
                if (result.ok) {
                  toast.success("Contact recorded. Next follow-up set.");
                  setOpen(false);
                  reset();
                  router.refresh();
                } else {
                  toast.error(result.message ?? "Couldn't record this contact.");
                }
              });
            }}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Next follow-up?</DialogTitle>
              <DialogDescription>
                Choose when Denise should check in again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor={`workflow-note-${job.id}`}>Note (optional)</Label>
              <Textarea
                id={`workflow-note-${job.id}`}
                name="note"
                rows={3}
                autoFocus
                placeholder="Spoke with manager about the quote…"
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">When</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {nextFollowUpPresets.map((item) => (
                  <label
                    key={item.value}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
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
              <div className="space-y-2">
                <Label htmlFor={`workflow-custom-${job.id}`}>Custom date</Label>
                <Input
                  id={`workflow-custom-${job.id}`}
                  name="customDate"
                  type="date"
                  defaultValue={toDateInputValue(addDaysFromToday(1))}
                />
              </div>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("review")}
                disabled={pending}
              >
                Back
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save follow-up"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
