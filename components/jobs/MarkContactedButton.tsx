"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { markJobContacted } from "@/lib/actions";
import { toDateInputValue } from "@/lib/dates";
import { toast } from "sonner";

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
import { cn } from "@/lib/utils";

const presets = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "three_days", label: "In 3 days" },
  { value: "next_week", label: "Next week" },
  { value: "custom", label: "Custom" },
] as const;

export function MarkContactedButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<(typeof presets)[number]["value"]>("tomorrow");
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ size: "sm" }))}>
        Mark contacted
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark contacted</DialogTitle>
          <DialogDescription>
            Record the conversation and schedule the next follow-up.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await markJobContacted(jobId, formData);
              if (result.ok) {
                toast.success(result.message ?? "Contact recorded.");
                setOpen(false);
                router.refresh();
              } else {
                toast.error(result.message ?? "Couldn't record this contact.");
              }
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor={`note-${jobId}`}>Note (optional)</Label>
            <Textarea
              id={`note-${jobId}`}
              name="note"
              rows={3}
              placeholder="Spoke with manager. Quote requested."
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Next follow-up</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {presets.map((item) => (
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
              <Label htmlFor={`custom-${jobId}`}>Custom date</Label>
              <Input
                id={`custom-${jobId}`}
                name="customDate"
                type="date"
                defaultValue={toDateInputValue(new Date())}
              />
            </div>
          ) : null}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save follow-up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
