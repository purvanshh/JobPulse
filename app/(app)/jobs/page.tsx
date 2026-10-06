import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function JobsPage() {
  return (
    <>
      <PageHeader
        title="Jobs"
        description="Every open request in one place."
        actions={
          <Link href="/jobs/new" className={cn(buttonVariants())}>
            Add job
          </Link>
        }
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Job list</CardTitle>
            <CardDescription>
              Search, filters, and job management will be wired up next.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No jobs loaded yet.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
