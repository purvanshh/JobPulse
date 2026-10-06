import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function JobNotFound() {
  return (
    <>
      <PageHeader
        title="Job not found"
        description="This job may have been deleted or the link is incorrect."
      />
      <div className="p-6">
        <Link href="/jobs" className={cn(buttonVariants())}>
          Back to jobs
        </Link>
      </div>
    </>
  );
}
