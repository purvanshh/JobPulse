"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function JobsFlashToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const created = searchParams.get("created");
    const deleted = searchParams.get("deleted");

    if (!created && !deleted) {
      return;
    }

    if (created === "1") {
      toast.success("Job created. It's ready in your list.");
    }
    if (deleted === "1") {
      toast.success("Job deleted.");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("created");
    params.delete("deleted");
    const next = params.toString();
    router.replace(next ? `/jobs?${next}` : "/jobs");
  }, [searchParams, router]);

  return null;
}
