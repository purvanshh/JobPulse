import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { createInboundRequestRecord } from "@/lib/inbound";
import { formatZodErrors, inboundRequestSchema } from "@/lib/validations";
import { INBOUND_SOURCES, type InboundSource } from "@/types";

type RouteContext = {
  params: Promise<{ source: string }>;
};

function isInboundSource(value: string): value is InboundSource {
  return (INBOUND_SOURCES as string[]).includes(value.toUpperCase());
}

export async function POST(request: Request, context: RouteContext) {
  const { source: rawSource } = await context.params;
  const sourceKey = rawSource.toUpperCase();

  if (!isInboundSource(sourceKey)) {
    return NextResponse.json(
      {
        ok: false,
        message: `Unsupported source. Use one of: ${INBOUND_SOURCES.join(", ")}.`,
      },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Request body must be JSON." },
      { status: 400 },
    );
  }

  const payload =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const parsed = inboundRequestSchema.safeParse({
    source: sourceKey,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone ?? payload.phone,
    customerEmail: payload.customerEmail ?? payload.email,
    message: payload.message ?? payload.jobDescription ?? payload.description,
    receivedAt: payload.receivedAt,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid inbound request.",
        fieldErrors: formatZodErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
    const created = await createInboundRequestRecord({
      source: parsed.data.source,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerEmail: parsed.data.customerEmail,
      message: parsed.data.message,
      receivedAt: parsed.data.receivedAt
        ? new Date(parsed.data.receivedAt)
        : undefined,
    });

    revalidatePath("/");
    revalidatePath("/inbox");

    return NextResponse.json(
      {
        ok: true,
        id: created.id,
        status: created.status,
        source: created.source,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Couldn't save inbound request." },
      { status: 500 },
    );
  }
}
