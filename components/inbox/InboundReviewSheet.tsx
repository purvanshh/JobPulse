"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import type { InboundRequest } from "@prisma/client";

import {
  convertInboundRequestToJob,
  updateInboundRequestStatus,
} from "@/lib/inbound-actions";
import { formatReceivedExact } from "@/lib/format-received";
import {
  INBOUND_SOURCE_LABELS,
  INBOUND_STATUS_LABELS,
} from "@/types";

import { InboundStatusBadge } from "@/components/inbox/InboundStatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type InboundReviewSheetProps = {
  request: InboundRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InboundReviewSheet({
  request,
  open,
  onOpenChange,
}: InboundReviewSheetProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!request) return null;

  const canAct =
    request.status === "NEW" || request.status === "REVIEWED";
  const callHref = request.customerPhone
    ? `tel:${request.customerPhone.replace(/\s/g, "")}`
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-nt-border px-5 py-5 text-left">
          <div className="flex items-center gap-2 pr-8">
            <SheetTitle className="font-display text-base font-bold tracking-tight">
              {request.customerName}
            </SheetTitle>
            <InboundStatusBadge status={request.status} />
          </div>
          <SheetDescription className="text-xs text-nt-secondary">
            {INBOUND_SOURCE_LABELS[request.source]} ·{" "}
            {formatReceivedExact(request.receivedAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <Fact label="Source" value={INBOUND_SOURCE_LABELS[request.source]} />
          <Fact label="Status" value={INBOUND_STATUS_LABELS[request.status]} />
          <Fact
            label="Phone"
            value={
              callHref ? (
                <a href={callHref} className="text-white hover:underline">
                  {request.customerPhone}
                </a>
              ) : (
                "—"
              )
            }
          />
          <Fact label="Email" value={request.customerEmail ?? "—"} />
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
              Original request
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed text-neutral-300">
              {request.message}
            </p>
          </div>
          <Fact
            label="Received"
            value={formatReceivedExact(request.receivedAt)}
          />
          {request.jobId ? (
            <div>
              <p className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
                Linked job
              </p>
              <Link
                href={`/jobs/${request.jobId}`}
                className="mt-1 inline-block text-xs text-white underline-offset-2 hover:underline"
              >
                Open job
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-auto space-y-2 border-t border-nt-border p-4">
          {canAct ? (
            <>
              <Button
                className="w-full"
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    try {
                      const result = await convertInboundRequestToJob(
                        request.id,
                      );
                      if (!result.ok) {
                        toast.error(result.message ?? "Couldn't convert.");
                      }
                    } catch {
                      // redirect() from the server action throws; navigation handles it.
                    }
                  });
                }}
              >
                {pending ? "Converting…" : "Convert to Job"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  disabled={pending || request.status === "REVIEWED"}
                  onClick={() => {
                    startTransition(async () => {
                      const result = await updateInboundRequestStatus(
                        request.id,
                        "REVIEWED",
                      );
                      if (result.ok) {
                        toast.success(result.message);
                        onOpenChange(false);
                        router.refresh();
                      } else {
                        toast.error(result.message ?? "Update failed.");
                      }
                    });
                  }}
                >
                  Mark reviewed
                </Button>
                <Button
                  variant="outline"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      const result = await updateInboundRequestStatus(
                        request.id,
                        "DISMISSED",
                      );
                      if (result.ok) {
                        toast.success(result.message);
                        onOpenChange(false);
                        router.refresh();
                      } else {
                        toast.error(result.message ?? "Update failed.");
                      }
                    });
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </>
          ) : request.jobId ? (
            <Link
              href={`/jobs/${request.jobId}`}
              className={cn(buttonVariants(), "w-full")}
            >
              Open linked job
            </Link>
          ) : (
            <p className="font-mono text-[11px] text-nt-secondary">
              No further actions for this request.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
        {label}
      </p>
      <p className="mt-1 text-xs text-neutral-300">{value}</p>
    </div>
  );
}
