import { describe, expect, it } from "vitest";

import { inboundSourceToJobSource, sortInboxRequests } from "@/lib/inbound";
import { inboundRequestSchema } from "@/lib/validations";
import type { InboundStatus } from "@prisma/client";

describe("inboundSourceToJobSource", () => {
  it("maps every inbound channel onto a job source", () => {
    expect(inboundSourceToJobSource("PHONE")).toBe("PHONE");
    expect(inboundSourceToJobSource("WEBSITE")).toBe("WEBSITE");
    expect(inboundSourceToJobSource("EMAIL")).toBe("EMAIL");
    expect(inboundSourceToJobSource("TEXT")).toBe("TEXT");
    expect(inboundSourceToJobSource("REFERRAL")).toBe("REFERRAL");
    expect(inboundSourceToJobSource("NOTEBOOK")).toBe("NOTEBOOK");
  });
});

describe("sortInboxRequests", () => {
  it("prioritizes NEW requests, then newest receivedAt", () => {
    const newerNew = new Date(2026, 9, 7, 9, 0, 0);
    const olderNew = new Date(2026, 9, 7, 8, 0, 0);

    const sorted = sortInboxRequests([
      {
        status: "DISMISSED" as InboundStatus,
        receivedAt: new Date(2026, 9, 7, 10, 0, 0),
      },
      {
        status: "NEW" as InboundStatus,
        receivedAt: olderNew,
      },
      {
        status: "NEW" as InboundStatus,
        receivedAt: newerNew,
      },
      {
        status: "REVIEWED" as InboundStatus,
        receivedAt: new Date(2026, 9, 7, 11, 0, 0),
      },
    ]);

    expect(sorted.map((item) => item.status)).toEqual([
      "NEW",
      "NEW",
      "REVIEWED",
      "DISMISSED",
    ]);
    expect(sorted[0]?.receivedAt).toBe(newerNew);
    expect(sorted[1]?.receivedAt).toBe(olderNew);
  });
});

describe("inboundRequestSchema", () => {
  it("requires name, phone, message, and source", () => {
    const result = inboundRequestSchema.safeParse({
      source: "PHONE",
      customerName: "",
      customerPhone: "",
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid request and optional email", () => {
    const result = inboundRequestSchema.safeParse({
      source: "WEBSITE",
      customerName: "Mario's Pizza",
      customerPhone: "555-0142",
      customerEmail: "manager@marios.example",
      message: "Walk-in freezer stopped cooling",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customerEmail).toBe("manager@marios.example");
    }
  });

  it("treats blank email as undefined", () => {
    const result = inboundRequestSchema.safeParse({
      source: "TEXT",
      customerName: "Harbor Deli",
      customerPhone: "555-0199",
      customerEmail: "   ",
      message: "Prep table not holding temp",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customerEmail).toBeUndefined();
    }
  });
});
