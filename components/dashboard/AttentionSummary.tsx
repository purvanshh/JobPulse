type AttentionSummaryProps = {
  overdue: number;
  dueToday: number;
};

export function AttentionSummary({ overdue, dueToday }: AttentionSummaryProps) {
  if (overdue > 0) {
    const overdueLabel =
      overdue === 1 ? "1 overdue follow-up" : `${overdue} overdue follow-ups`;
    const dueLabel =
      dueToday === 1 ? "1 more is due today." : `${dueToday} more are due today.`;

    return (
      <section
        className="flex min-w-0 items-center gap-2.5 rounded-[4px] border border-nt-red-border bg-nt-red-subtle px-4 py-2.5"
        role="status"
        data-purpose="system-alert"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nt-red opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-nt-red" />
        </span>
        <p className="text-xs font-medium tracking-tight text-white">
          <span className="font-semibold text-nt-red">{overdueLabel}</span>
          {overdue === 1 ? " needs attention." : " need attention."}
          {dueToday > 0 ? ` ${dueLabel}` : null}
        </p>
      </section>
    );
  }

  if (dueToday > 0) {
    const label =
      dueToday === 1
        ? "1 follow-up is due today."
        : `${dueToday} follow-ups are due today.`;

    return (
      <section
        className="flex items-center gap-2.5 rounded-[4px] border border-nt-amber-border bg-nt-amber-subtle px-4 py-2.5"
        role="status"
      >
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-nt-amber shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
        </span>
        <p className="text-xs font-medium tracking-tight text-white">
          <span className="font-semibold text-nt-amber">{label}</span>
        </p>
      </section>
    );
  }

  return (
    <section
      className="flex items-center gap-2.5 rounded-[4px] border border-nt-border bg-nt-surface px-4 py-2.5"
      role="status"
    >
      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
      <p className="text-xs font-medium tracking-tight text-white">
        You&apos;re all caught up.
      </p>
    </section>
  );
}
