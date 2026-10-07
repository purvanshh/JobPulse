"use client";

import { useState } from "react";

import type { InboundRequest } from "@prisma/client";

import { InboundReviewSheet } from "@/components/inbox/InboundReviewSheet";
import { InboundStatusBadge } from "@/components/inbox/InboundStatusBadge";
import { formatReceivedAt } from "@/lib/format-received";
import { cn } from "@/lib/utils";
import { INBOUND_SOURCE_LABELS } from "@/types";

const primaryAction =
  "inline-flex h-auto items-center rounded-[4px] border-transparent bg-white px-3 py-1.5 font-mono text-xs font-medium text-black shadow-none hover:bg-neutral-200";

const ghostAction =
  "inline-flex h-auto items-center rounded-[4px] border border-[#222222] bg-transparent px-3 py-1.5 font-mono text-xs font-normal text-nt-secondary hover:bg-[#1E1E22] hover:text-white";

export function InboundAttentionCard({
  request,
}: {
  request: InboundRequest;
}) {
  const [open, setOpen] = useState(false);
  const callHref = request.customerPhone
    ? `tel:${request.customerPhone.replace(/\s/g, "")}`
    : null;

  return (
    <>
      <article className="flex min-w-0 max-w-full flex-col justify-between gap-4 rounded-md border border-nt-amber-border bg-nt-amber-subtle/30 p-4 transition-colors hover:border-nt-amber md:flex-row md:items-center">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-white">
              {request.customerName}
            </span>
            <InboundStatusBadge status={request.status} />
          </div>
          <p className="line-clamp-2 text-xs font-normal text-neutral-300">
            {request.message}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
            <span className="font-mono text-xs font-bold tracking-wide text-nt-amber uppercase">
              New request · {INBOUND_SOURCE_LABELS[request.source]}
            </span>
            <span className="font-mono text-[11px] text-nt-secondary">
              {formatReceivedAt(request.receivedAt)}
            </span>
            {request.customerPhone ? (
              <span className="font-mono text-xs text-nt-secondary">
                {request.customerPhone}
              </span>
            ) : (
              <span className="font-mono text-xs text-nt-secondary">No phone</span>
            )}
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 self-start md:w-auto md:self-center">
          {callHref ? (
            <a href={callHref} className={ghostAction}>
              Call
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(primaryAction)}
          >
            Review request
          </button>
        </div>
      </article>

      <InboundReviewSheet
        request={request}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
