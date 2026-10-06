"use client";

import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="font-display text-2xl font-bold tracking-tight text-white">
        Something went wrong
      </h2>
      <p className="max-w-md text-xs text-nt-muted">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button type="button" className={cn(buttonVariants())} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
