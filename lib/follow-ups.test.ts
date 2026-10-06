import type { Job, JobStatus } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  addDaysFromToday,
  daysBetween,
  formatRelativeDay,
  parseDateInput,
  toDateInputValue,
  toDateOnly,
} from "@/lib/dates";
import {
  compareAttentionJobs,
  getAttentionJobs,
  getFollowUpState,
  getRecommendedAction,
  getUpcomingFollowUps,
} from "@/lib/follow-ups";

function localDay(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function makeJob(
  overrides: Partial<Job> & Pick<Job, "status" | "nextFollowUp">,
): Job {
  return {
    id: overrides.id ?? "job-1",
    customerName: overrides.customerName ?? "Customer",
    company: overrides.company ?? null,
    phone: overrides.phone ?? null,
    jobDescription: overrides.jobDescription ?? "Repair",
    source: overrides.source ?? "OTHER",
    status: overrides.status,
    nextFollowUp: overrides.nextFollowUp,
    notes: overrides.notes ?? null,
    createdAt: overrides.createdAt ?? localDay(2026, 10, 1),
    updatedAt: overrides.updatedAt ?? localDay(2026, 10, 1),
  };
}

describe("date utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(localDay(2026, 10, 6));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("parses YYYY-MM-DD as a local calendar day without UTC shift", () => {
    const parsed = toDateOnly("2026-10-06");
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(9);
    expect(parsed.getDate()).toBe(6);
    expect(parsed.getHours()).toBe(0);
  });

  it("parseDateInput builds local midnight", () => {
    const parsed = parseDateInput("2026-01-15");
    expect(toDateInputValue(parsed)).toBe("2026-01-15");
    expect(parsed.getHours()).toBe(0);
  });

  it("addDaysFromToday stays on calendar days", () => {
    expect(toDateInputValue(addDaysFromToday(0))).toBe("2026-10-06");
    expect(toDateInputValue(addDaysFromToday(1))).toBe("2026-10-07");
    expect(toDateInputValue(addDaysFromToday(-2))).toBe("2026-10-04");
  });

  it("daysBetween counts calendar days", () => {
    expect(daysBetween(localDay(2026, 10, 4))).toBe(2);
    expect(daysBetween(localDay(2026, 10, 6))).toBe(0);
  });

  it("formatRelativeDay uses Today/Tomorrow/Yesterday", () => {
    expect(formatRelativeDay(localDay(2026, 10, 6))).toBe("Today");
    expect(formatRelativeDay(localDay(2026, 10, 7))).toBe("Tomorrow");
    expect(formatRelativeDay(localDay(2026, 10, 5))).toBe("Yesterday");
  });
});

describe("getFollowUpState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(localDay(2026, 10, 6));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns COMPLETED for DONE regardless of follow-up date", () => {
    expect(
      getFollowUpState(
        makeJob({ status: "DONE", nextFollowUp: localDay(2026, 10, 1) }),
      ),
    ).toBe("COMPLETED");
  });

  it("returns OVERDUE for yesterday", () => {
    expect(
      getFollowUpState(
        makeJob({ status: "NEW", nextFollowUp: localDay(2026, 10, 5) }),
      ),
    ).toBe("OVERDUE");
  });

  it("returns OVERDUE for older dates", () => {
    expect(
      getFollowUpState(
        makeJob({
          status: "WAITING_ON_CUSTOMER",
          nextFollowUp: localDay(2026, 10, 1),
        }),
      ),
    ).toBe("OVERDUE");
  });

  it("returns DUE_TODAY for today", () => {
    expect(
      getFollowUpState(
        makeJob({ status: "NEW", nextFollowUp: localDay(2026, 10, 6) }),
      ),
    ).toBe("DUE_TODAY");
  });

  it("returns UPCOMING for tomorrow", () => {
    expect(
      getFollowUpState(
        makeJob({ status: "NEW", nextFollowUp: localDay(2026, 10, 7) }),
      ),
    ).toBe("UPCOMING");
  });

  it("returns UPCOMING for future dates", () => {
    expect(
      getFollowUpState(
        makeJob({ status: "SCHEDULED", nextFollowUp: localDay(2026, 10, 20) }),
      ),
    ).toBe("UPCOMING");
  });
});

describe("getRecommendedAction", () => {
  const cases: Array<[JobStatus, string]> = [
    ["NEW", "Contact Customer"],
    ["WAITING_ON_QUOTE", "Follow Up on Quote"],
    ["WAITING_ON_CUSTOMER", "Follow Up"],
    ["SCHEDULED", "View Job"],
    ["DONE", "No Action"],
  ];

  it.each(cases)("%s → %s", (status, label) => {
    expect(getRecommendedAction(status)).toBe(label);
  });
});

describe("attention prioritization", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(localDay(2026, 10, 6));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("puts overdue before due today", () => {
    const overdue = makeJob({
      id: "overdue",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 5),
    });
    const dueToday = makeJob({
      id: "today",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 6),
    });
    expect(compareAttentionJobs(overdue, dueToday)).toBeLessThan(0);
    expect(getAttentionJobs([dueToday, overdue]).map((job) => job.id)).toEqual([
      "overdue",
      "today",
    ]);
  });

  it("orders more overdue jobs first", () => {
    const threeDays = makeJob({
      id: "3d",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 3),
    });
    const oneDay = makeJob({
      id: "1d",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 5),
    });
    expect(getAttentionJobs([oneDay, threeDays]).map((job) => job.id)).toEqual([
      "3d",
      "1d",
    ]);
  });

  it("uses earlier follow-up before later follow-up within the same state", () => {
    const earlier = makeJob({
      id: "earlier",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 4),
    });
    const later = makeJob({
      id: "later",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 5),
    });
    expect(compareAttentionJobs(earlier, later)).toBeLessThan(0);
  });

  it("uses createdAt as a tie-breaker", () => {
    const older = makeJob({
      id: "older",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 5),
      createdAt: localDay(2026, 9, 1),
    });
    const newer = makeJob({
      id: "newer",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 5),
      createdAt: localDay(2026, 10, 1),
    });
    expect(getAttentionJobs([newer, older]).map((job) => job.id)).toEqual([
      "older",
      "newer",
    ]);
  });

  it("excludes DONE jobs from attention", () => {
    const done = makeJob({
      id: "done",
      status: "DONE",
      nextFollowUp: localDay(2026, 10, 1),
    });
    const overdue = makeJob({
      id: "overdue",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 5),
    });
    expect(getAttentionJobs([done, overdue]).map((job) => job.id)).toEqual([
      "overdue",
    ]);
  });
});

describe("getUpcomingFollowUps", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(localDay(2026, 10, 6));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("identifies upcoming jobs and excludes completed", () => {
    const upcoming = makeJob({
      id: "up",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 8),
    });
    const later = makeJob({
      id: "later",
      status: "SCHEDULED",
      nextFollowUp: localDay(2026, 10, 10),
    });
    const dueToday = makeJob({
      id: "today",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 6),
    });
    const done = makeJob({
      id: "done",
      status: "DONE",
      nextFollowUp: localDay(2026, 10, 9),
    });

    expect(
      getUpcomingFollowUps([later, done, dueToday, upcoming]).map((job) => job.id),
    ).toEqual(["up", "later"]);
  });

  it("orders upcoming ascending by follow-up date", () => {
    const a = makeJob({
      id: "a",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 12),
    });
    const b = makeJob({
      id: "b",
      status: "NEW",
      nextFollowUp: localDay(2026, 10, 7),
    });
    expect(getUpcomingFollowUps([a, b]).map((job) => job.id)).toEqual(["b", "a"]);
  });
});
