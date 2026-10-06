import { PageFrame } from "@/components/layout/PageFrame";

export default function JobDetailLoading() {
  return (
    <PageFrame>
      <div className="h-16 animate-pulse rounded-[4px] bg-nt-surface" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-40 animate-pulse rounded-lg border border-nt-border bg-nt-surface" />
        <div className="h-40 animate-pulse rounded-lg border border-nt-border bg-nt-surface" />
      </div>
    </PageFrame>
  );
}
