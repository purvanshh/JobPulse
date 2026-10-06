import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryMetricsProps = {
  followUpsToday: number;
  overdue: number;
  openJobs: number;
  scheduled: number;
};

const items = [
  { key: "followUpsToday", label: "Follow-ups today" },
  { key: "overdue", label: "Overdue" },
  { key: "openJobs", label: "Open jobs" },
  { key: "scheduled", label: "Scheduled" },
] as const;

export function SummaryMetrics(props: SummaryMetricsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.key} className="shadow-none">
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-2xl font-semibold tracking-tight tabular-nums">
              {props[item.key]}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
