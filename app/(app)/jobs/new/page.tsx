import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewJobPage() {
  return (
    <>
      <PageHeader
        title="Add job"
        description="Capture a new service request as soon as it arrives."
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>New job form</CardTitle>
            <CardDescription>
              Job creation fields will be added in the job management milestone.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Required: customer name and job description.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
