import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TodayPage() {
  return (
    <>
      <PageHeader
        title="Good morning, Denise"
        description="Here's what needs your attention today."
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <CardDescription>
              Overdue and due-today follow-ups will appear here once job data
              is connected.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Dashboard intelligence ships in a later milestone.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
