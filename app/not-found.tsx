import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you requested doesn&apos;t exist. Head back to Today to see what
        needs attention.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Go to Today
      </Link>
    </div>
  );
}
