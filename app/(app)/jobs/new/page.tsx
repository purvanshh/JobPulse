import { JobForm } from "@/components/jobs/JobForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function NewJobPage() {
  return (
    <>
      <PageHeader
        title="Add job"
        description="Capture a new service request as soon as it arrives."
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card className="max-w-3xl">
          <CardContent className="pt-6">
            <JobForm mode="create" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
