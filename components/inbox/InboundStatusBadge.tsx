import type { InboundStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { INBOUND_STATUS_LABELS } from "@/types";

const statusStyles: Record<InboundStatus, string> = {
  NEW: "border-nt-amber-border bg-nt-amber-subtle text-nt-amber",
  REVIEWED: "border-nt-border bg-nt-card text-nt-muted",
  CONVERTED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  DISMISSED: "border-nt-border bg-[#0A0A0A] text-nt-secondary",
};

export function InboundStatusBadge({
  status,
  className,
}: {
  status: InboundStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium",
        statusStyles[status],
        className,
      )}
    >
      {INBOUND_STATUS_LABELS[status]}
    </Badge>
  );
}
