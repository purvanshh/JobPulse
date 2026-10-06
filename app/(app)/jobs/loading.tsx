import { PageHeader } from "@/components/layout/PageHeader";
import { TableSkeleton } from "@/components/shared/PageSkeleton";

export default function JobsLoading() {
  return (
    <>
      <PageHeader title="Jobs" description="Loading your job list…" />
      <TableSkeleton />
    </>
  );
}
