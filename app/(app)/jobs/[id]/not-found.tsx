import Link from "next/link";

import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";

export default function JobNotFound() {
  return (
    <PageFrame>
      <PageHeader
        title="Job not found"
        description="This job may have been deleted or the link is incorrect."
      />
      <Link
        href="/jobs"
        className="inline-flex w-fit items-center rounded-[4px] bg-white px-3.5 py-1.5 text-xs font-medium text-black hover:bg-neutral-200"
      >
        Back to jobs
      </Link>
    </PageFrame>
  );
}
