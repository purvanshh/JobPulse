"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { setJobFollowUp } from "@/lib/actions";
import { addDaysFromToday, toDateInputValue } from "@/lib/dates";

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
import { cn } from "@/lib/utils";

const presets = [
  { days: 0, label: "Today" },
  { days: 1, label: "Tomorrow" },
  { days: 3, label: "In 3 days" },
  { days: 7, label: "Next week" },
] as const;

type ChangeFollowUpButtonProps = {
  jobId: string;
  size?: "sm" | "default";
  label?: string;
  className?: string;
};

export function ChangeFollowUpButton({
  jobId,
  size = "sm",
  label = "Set follow-up",
  className,
}: ChangeFollowUpButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [customDate, setCustomDate] = useState(toDateInputValue(addDaysFromToday(1)));
  const [pending, startTransition] = useTransition();

  function applyDate(value: string) {
    startTransition(async () => {
      const result = await setJobFollowUp(jobId, value);
      if (result.ok) {
        toast.success("Follow-up date updated.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message ?? "Couldn't update follow-up.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "outline", size }), className)}
      >
        {label}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change follow-up</DialogTitle>
          <DialogDescription>
            Pick when Denise should check in with this customer next.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() =>
                applyDate(toDateInputValue(addDaysFromToday(preset.days)))
              }
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`follow-up-custom-${jobId}`}>Custom date</Label>
          <div className="flex gap-2">
            <Input
              id={`follow-up-custom-${jobId}`}
              type="date"
              value={customDate}
              onChange={(event) => setCustomDate(event.target.value)}
            />
            <Button
              type="button"
              disabled={pending || !customDate}
              onClick={() => applyDate(customDate)}
            >
              Save
            </Button>
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
