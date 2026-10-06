import { JobForm } from "@/components/jobs/JobForm";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";

export default function NewJobPage() {
  return (
    <PageFrame>
      <PageHeader
        title="Add job"
        description="Capture a new service request as soon as it arrives."
      />
      <section className="max-w-3xl rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6">
        <JobForm mode="create" />
      </section>
    </PageFrame>
  );
}
