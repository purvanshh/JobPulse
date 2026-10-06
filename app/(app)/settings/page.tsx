import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="JobPulse is ready to use without configuration."
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>No setup required</CardTitle>
            <CardDescription>
              This prototype focuses on daily follow-ups and job status. Account
              preferences and integrations are left for a later release.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use Today to see who needs a call, and Jobs to manage every request.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
