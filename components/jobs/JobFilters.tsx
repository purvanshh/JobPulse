"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

import type { JobStatus } from "@prisma/client";

import { Input } from "@/components/ui/input";
import { JOB_STATUS_LABELS, JOB_STATUSES } from "@/types";

const followUpFilters = [
  { value: "", label: "All" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "none", label: "No follow-up" },
] as const;

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const followUp = searchParams.get("followUp") ?? "";
  const debounceRef = useRef<number | null>(null);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.replace(`/jobs?${params.toString()}`);
    });
  }

  return (
    <div
      className={`grid gap-3 md:grid-cols-[1fr_auto_auto] ${pending ? "opacity-70" : ""}`}
    >
      <Input
        key={q}
        type="search"
        placeholder="Search customer, company, or job…"
        defaultValue={q}
        aria-label="Search jobs"
        onChange={(event) => {
          const value = event.target.value;
          if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
          }
          debounceRef.current = window.setTimeout(() => updateParam("q", value), 250);
        }}
      />
      <select
        aria-label="Filter by status"
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        value={status}
        onChange={(event) => updateParam("status", event.target.value)}
      >
        <option value="">All statuses</option>
        {JOB_STATUSES.map((item) => (
          <option key={item} value={item}>
            {JOB_STATUS_LABELS[item as JobStatus]}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by follow-up"
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        value={followUp}
        onChange={(event) => updateParam("followUp", event.target.value)}
      >
        {followUpFilters.map((item) => (
          <option key={item.label} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
