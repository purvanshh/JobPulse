"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setJobFollowUp } from "@/lib/actions";
import { addDaysFromToday, toDateInputValue } from "@/lib/dates";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuickFollowUpButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function bump(days: number) {
    startTransition(async () => {
      const result = await setJobFollowUp(jobId, toDateInputValue(addDaysFromToday(days)));
      if (result.ok) {
        toast.success("Follow-up date updated.");
        router.refresh();
      } else {
        toast.error(result.message ?? "Couldn't update follow-up.");
      }
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      onClick={() => bump(1)}
    >
      {pending ? "Updating…" : "Follow up tomorrow"}
    </button>
  );
}
