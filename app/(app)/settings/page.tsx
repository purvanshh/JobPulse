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
        description="Workspace preferences will live here in a later release."
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
            <CardDescription>
              Settings are intentionally out of scope for this prototype. Focus
              stays on daily follow-ups and job status.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No configuration is required to use JobPulse today.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
