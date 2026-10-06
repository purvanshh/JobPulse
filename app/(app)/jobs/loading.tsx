import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";

export default function JobsLoading() {
  return (
    <PageFrame>
      <PageHeader title="Jobs" description="Loading your job list…" />
      <div className="h-9 animate-pulse rounded-[4px] border border-nt-border bg-nt-surface" />
      <div className="h-64 animate-pulse rounded-lg border border-nt-border bg-nt-surface" />
    </PageFrame>
  );
}
