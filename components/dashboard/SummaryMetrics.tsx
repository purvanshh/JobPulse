type SummaryMetricsProps = {
  followUpsToday: number;
  overdue: number;
  openJobs: number;
  scheduled: number;
};

const items = [
  { key: "followUpsToday", label: "Follow-ups Today", alert: false },
  { key: "overdue", label: "Overdue", alert: true },
  { key: "openJobs", label: "Open Jobs", alert: false },
  { key: "scheduled", label: "Scheduled", alert: false },
] as const;

export function SummaryMetrics(props: SummaryMetricsProps) {
  return (
    <section
      className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
      data-purpose="metrics-grid"
      aria-label="Today at a glance"
    >
      {items.map((item) => (
        <div
          key={item.key}
          className="flex min-w-0 flex-col justify-between rounded-lg border border-nt-border bg-nt-surface p-4"
        >
          <span
            className={`font-mono text-[10px] font-semibold tracking-wider uppercase ${
              item.alert ? "text-nt-red" : "text-nt-secondary"
            }`}
          >
            {item.label}
          </span>
          <span
            className={`mt-2 font-display text-3xl font-bold tracking-tight ${
              item.alert ? "text-nt-red" : "text-white"
            }`}
          >
            {props[item.key]}
          </span>
        </div>
      ))}
    </section>
  );
}
