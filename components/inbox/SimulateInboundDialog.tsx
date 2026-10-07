"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { simulateInboundRequest } from "@/lib/inbound-actions";
import { toDateTimeLocalValue } from "@/lib/format-received";
import { INBOUND_SOURCE_LABELS, INBOUND_SOURCES, type InboundSource } from "@/types";

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
import { cn } from "@/lib/utils";

const DEMO_BY_SOURCE: Record<
  InboundSource,
  { customerName: string; customerPhone: string; customerEmail?: string; message: string }
> = {
  WEBSITE: {
    customerName: "Mario's Pizza",
    customerPhone: "555-0142",
    customerEmail: "manager@marios.example",
    message: "Walk-in freezer stopped cooling overnight.",
  },
  EMAIL: {
    customerName: "Lakeside Catering",
    customerPhone: "555-0160",
    customerEmail: "ops@lakeside.example",
    message: "Need service on two prep coolers before Saturday event.",
  },
  TEXT: {
    customerName: "Quick Stop Market",
    customerPhone: "555-0177",
    message: "Ice cream case running warm. Can someone call today?",
  },
  PHONE: {
    customerName: "Riverfront Seafood",
    customerPhone: "555-0133",
    message: "Walk-in cooler compressor kicking on and off every few minutes.",
  },
  REFERRAL: {
    customerName: "Oak Street Bakery",
    customerPhone: "555-0188",
    customerEmail: "hello@oakstreet.example",
    message: "Referred by Harbor Bistro — proofing fridge not holding temp.",
  },
  NOTEBOOK: {
    customerName: "Corner Deli",
    customerPhone: "555-0121",
    message: "Front display case icing up. Owner stopped by front desk.",
  },
};

export function SimulateInboundDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<InboundSource>("WEBSITE");
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "font-mono text-xs",
        )}
      >
        Simulate incoming
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Simulate incoming request</DialogTitle>
          <DialogDescription className="text-xs text-nt-secondary">
            Creates a real InboundRequest through the same pipeline as website,
            email, and other channels — no third-party integration.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Source</span>
            <select
              value={source}
              onChange={(event) =>
                setSource(event.target.value as InboundSource)
              }
              className="flex h-9 w-full rounded-[4px] border border-[#27272A] bg-[#0A0A0A] px-3 font-mono text-xs text-white outline-none focus-visible:border-white"
            >
              {INBOUND_SOURCES.map((item) => (
                <option key={item} value={item}>
                  {INBOUND_SOURCE_LABELS[item]}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-[4px] border border-nt-border bg-[#0A0A0A] px-3 py-2">
            <p className="font-mono text-[10px] tracking-widest text-nt-secondary uppercase">
              Preview
            </p>
            <p className="mt-1 text-xs font-medium text-white">
              {DEMO_BY_SOURCE[source].customerName}
            </p>
            <p className="mt-0.5 text-xs text-nt-muted">
              &ldquo;{DEMO_BY_SOURCE[source].message}&rdquo;
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={pending}
            onClick={() => {
              const demo = DEMO_BY_SOURCE[source];
              const formData = new FormData();
              formData.set("source", source);
              formData.set("customerName", demo.customerName);
              formData.set("customerPhone", demo.customerPhone);
              if (demo.customerEmail) {
                formData.set("customerEmail", demo.customerEmail);
              }
              formData.set("message", demo.message);
              formData.set("receivedAt", toDateTimeLocalValue());

              startTransition(async () => {
                const result = await simulateInboundRequest(formData);
                if (result.ok) {
                  toast.success("Simulated request landed in inbox.");
                  setOpen(false);
                  router.refresh();
                } else {
                  toast.error(result.message ?? "Simulation failed.");
                }
              });
            }}
          >
            {pending ? "Sending…" : "Send to inbox"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
