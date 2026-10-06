import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";

export default function TodayLoading() {
  return (
    <>
      <PageHeader
        title="Good morning, Denise"
        description="Loading today's follow-ups…"
      />
      <PageSkeleton />
    </>
  );
}
