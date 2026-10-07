"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

import type { JobSource, JobStatus } from "@prisma/client";

import { Input } from "@/components/ui/input";
import {
  JOB_SOURCE_LABELS,
  JOB_SOURCES,
  JOB_STATUS_LABELS,
  JOB_STATUSES,
} from "@/types";

const followUpFilters = [
  { value: "", label: "All follow-ups" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "none", label: "Completed" },
] as const;

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const source = searchParams.get("source") ?? "";
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
      className={`grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] ${pending ? "opacity-70" : ""}`}
    >
      <Input
        key={q}
        type="search"
        placeholder="Search customer, phone, or description…"
        defaultValue={q}
        aria-label="Search jobs"
        onChange={(event) => {
          const value = event.target.value;
          if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
          }
          debounceRef.current = window.setTimeout(
            () => updateParam("q", value),
            250,
          );
        }}
      />
      <select
        aria-label="Filter by status"
        className="h-9 w-full min-w-0 rounded-[4px] border border-[#27272A] bg-[#0A0A0A] px-3 font-mono text-xs text-white outline-none focus:border-white"
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
        className="h-9 w-full min-w-0 rounded-[4px] border border-[#27272A] bg-[#0A0A0A] px-3 font-mono text-xs text-white outline-none focus:border-white"
        value={followUp}
        onChange={(event) => updateParam("followUp", event.target.value)}
      >
        {followUpFilters.map((item) => (
          <option key={item.label} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by source"
        className="h-9 w-full min-w-0 rounded-[4px] border border-[#27272A] bg-[#0A0A0A] px-3 font-mono text-xs text-white outline-none focus:border-white"
        value={source}
        onChange={(event) => updateParam("source", event.target.value)}
      >
        <option value="">All sources</option>
        {JOB_SOURCES.map((item) => (
          <option key={item} value={item}>
            {JOB_SOURCE_LABELS[item as JobSource]}
          </option>
        ))}
      </select>
    </div>
  );
}
