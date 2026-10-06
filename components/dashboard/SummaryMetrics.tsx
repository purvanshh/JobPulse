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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">{props[item.key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
