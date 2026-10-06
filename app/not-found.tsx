import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-nt-bg p-8 text-center text-white">
      <h1 className="font-display text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-md text-xs text-nt-muted">
        The page you requested doesn&apos;t exist. Head back to Today to see what
        needs attention.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Go to Today
      </Link>
    </div>
  );
}
