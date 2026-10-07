type AttentionSummaryProps = {
  overdue: number;
  dueToday: number;
  newRequests: number;
};

export function AttentionSummary({
  overdue,
  dueToday,
  newRequests,
}: AttentionSummaryProps) {
  const total = overdue + dueToday + newRequests;

  if (total === 0) {
    return (
      <section
        className="flex items-center gap-2.5 rounded-[4px] border border-nt-border bg-nt-surface px-4 py-2.5"
        role="status"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
        <p className="text-xs font-medium tracking-tight text-white">
          You&apos;re caught up. No overdue follow-ups, due-today work, or new
          requests.
        </p>
      </section>
    );
  }

  const parts: string[] = [];
  if (overdue > 0) {
    parts.push(
      overdue === 1 ? "1 overdue" : `${overdue} overdue`,
    );
  }
  if (dueToday > 0) {
    parts.push(
      dueToday === 1 ? "1 due today" : `${dueToday} due today`,
    );
  }
  if (newRequests > 0) {
    parts.push(
      newRequests === 1 ? "1 new request" : `${newRequests} new requests`,
    );
  }

  const headline =
    total === 1
      ? "1 person needs attention"
      : `${total} people need attention`;

  const isUrgent = overdue > 0;

  return (
    <section
      className={
        isUrgent
          ? "flex min-w-0 flex-col gap-1 rounded-[4px] border border-nt-red-border bg-nt-red-subtle px-4 py-2.5 sm:flex-row sm:items-center sm:gap-2.5"
          : "flex min-w-0 flex-col gap-1 rounded-[4px] border border-nt-amber-border bg-nt-amber-subtle px-4 py-2.5 sm:flex-row sm:items-center sm:gap-2.5"
      }
      role="status"
      data-purpose="system-alert"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {isUrgent ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nt-red opacity-75" />
        ) : null}
        <span
          className={
            isUrgent
              ? "relative inline-flex h-2 w-2 rounded-full bg-nt-red"
              : "relative inline-flex h-2 w-2 rounded-full bg-nt-amber shadow-[0_0_6px_rgba(245,158,11,0.6)]"
          }
        />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-tight text-white">
          <span
            className={
              isUrgent
                ? "font-semibold text-nt-red"
                : "font-semibold text-nt-amber"
            }
          >
            {headline}
          </span>
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-nt-secondary">
          {parts.join(" · ")}
        </p>
      </div>
    </section>
  );
}
