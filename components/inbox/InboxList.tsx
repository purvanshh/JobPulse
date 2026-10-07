"use client";

import { useMemo, useState } from "react";

import type { InboundRequest } from "@prisma/client";

import { InboundReviewSheet } from "@/components/inbox/InboundReviewSheet";
import { InboundStatusBadge } from "@/components/inbox/InboundStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatReceivedAt } from "@/lib/format-received";
import { cn } from "@/lib/utils";
import { INBOUND_SOURCE_LABELS } from "@/types";

type InboxListProps = {
  requests: InboundRequest[];
  emptyAction?: React.ReactNode;
};

export function InboxList({ requests, emptyAction }: InboxListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId],
  );

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No new requests"
        description="Website, phone, email, text, referral, and notebook requests land here before they become jobs."
        action={emptyAction}
      />
    );
  }

  return (
    <>
      <ul className="divide-y divide-nt-border rounded-lg border border-nt-border bg-nt-surface">
        {requests.map((request) => {
          const isNew = request.status === "NEW";

          return (
            <li key={request.id}>
              <button
                type="button"
                onClick={() => setSelectedId(request.id)}
                className={cn(
                  "flex w-full flex-col gap-2 px-4 py-3.5 text-left transition-colors hover:bg-[#121212] sm:flex-row sm:items-center sm:justify-between",
                  isNew && "bg-nt-amber-subtle/40",
                )}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
                      {INBOUND_SOURCE_LABELS[request.source]}
                    </span>
                    <span className="font-mono text-[10px] text-nt-muted">
                      {formatReceivedAt(request.receivedAt)}
                    </span>
                    <InboundStatusBadge status={request.status} />
                  </div>
                  <p
                    className={cn(
                      "truncate text-sm tracking-tight",
                      isNew
                        ? "font-semibold text-white"
                        : "font-medium text-neutral-200",
                    )}
                  >
                    {request.customerName}
                  </p>
                  <p className="line-clamp-2 text-xs text-nt-muted">
                    &ldquo;{request.message}&rdquo;
                  </p>
                  <p className="font-mono text-[10px] text-nt-secondary">
                    {request.customerPhone}
                    {request.customerEmail ? ` · ${request.customerEmail}` : ""}
                  </p>
                </div>
                <span className="shrink-0 self-start rounded-[4px] border border-[#27272A] px-2.5 py-1 font-mono text-[11px] text-nt-secondary sm:self-center">
                  Review
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <InboundReviewSheet
        request={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </>
  );
}
