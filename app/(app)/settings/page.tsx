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
        title="Prototype notes"
        description="Honest assumptions for this hiring-assignment prototype."
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Current prototype assumptions</CardTitle>
            <CardDescription>
              JobPulse is intentionally small. These constraints keep the demo
              focused on Denise&apos;s follow-up problem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Single operator — no login or multi-user roles</li>
              <li>Local calendar day for follow-ups (machine timezone)</li>
              <li>SQLite file storage for easy local setup</li>
              <li>No email, SMS, or quote-sending integrations</li>
              <li>No push notifications or reminder workers</li>
              <li>Call uses a phone link (`tel:`) when a number exists</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
