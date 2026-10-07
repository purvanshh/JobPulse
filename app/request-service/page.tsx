"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SubmitState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export default function RequestServicePage() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  if (state.status === "success") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-4 px-4 py-10">
        <Brand />
        <div className="rounded-lg border border-nt-border bg-nt-surface p-6">
          <h1 className="font-display text-xl font-bold tracking-tight text-white">
            Request received
          </h1>
          <p className="mt-2 text-xs text-nt-secondary">
            Thanks — we&apos;ll follow up shortly about your refrigeration issue.
          </p>
          <Button
            className="mt-4"
            type="button"
            variant="outline"
            onClick={() => setState({ status: "idle" })}
          >
            Submit another
          </Button>
        </div>
        <Link
          href="/"
          className="font-mono text-[11px] text-nt-secondary hover:text-white hover:underline"
        >
          Back to JobPulse
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4 py-10">
      <Brand />
      <div className="rounded-lg border border-nt-border bg-nt-surface p-5 sm:p-6">
        <h1 className="font-display text-xl font-bold tracking-tight text-white">
          Request service
        </h1>
        <p className="mt-1 text-xs text-nt-secondary">
          Tell us what&apos;s going wrong. We&apos;ll get it into the queue.
        </p>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              const response = await fetch("/api/inbound/website", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  customerName: formData.get("customerName"),
                  customerPhone: formData.get("customerPhone"),
                  customerEmail: formData.get("customerEmail"),
                  message: formData.get("message"),
                }),
              });
              const payload = (await response.json()) as {
                ok?: boolean;
                message?: string;
                fieldErrors?: Record<string, string>;
              };
              if (!response.ok || !payload.ok) {
                setState({
                  status: "error",
                  message: payload.message ?? "Couldn't submit. Try again.",
                  fieldErrors: payload.fieldErrors,
                });
                return;
              }
              setState({ status: "success" });
            });
          }}
        >
          {state.status === "error" ? (
            <p
              role="alert"
              className="rounded-[4px] border border-nt-red-border bg-nt-red-subtle px-3 py-2 font-mono text-xs text-nt-red"
            >
              {state.message}
            </p>
          ) : null}

          <Field
            id="customerName"
            label="Business / customer name"
            required
            error={state.status === "error" ? state.fieldErrors?.customerName : undefined}
          >
            <Input id="customerName" name="customerName" required autoFocus />
          </Field>
          <Field
            id="customerPhone"
            label="Phone"
            required
            error={state.status === "error" ? state.fieldErrors?.customerPhone : undefined}
          >
            <Input id="customerPhone" name="customerPhone" type="tel" required />
          </Field>
          <Field
            id="customerEmail"
            label="Email"
            error={state.status === "error" ? state.fieldErrors?.customerEmail : undefined}
          >
            <Input id="customerEmail" name="customerEmail" type="email" />
          </Field>
          <Field
            id="message"
            label="What's the problem?"
            required
            error={state.status === "error" ? state.fieldErrors?.message : undefined}
          >
            <Textarea id="message" name="message" rows={4} required />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Submitting…" : "Submit request"}
          </Button>
        </form>
      </div>
    </main>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-nt-border bg-[#18181B] text-white">
        <Wrench className="h-4 w-4" aria-hidden />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-tight text-white">JobPulse</p>
        <p className="font-mono text-[10px] text-nt-secondary">Service request</p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="font-mono text-[11px] text-nt-red">{error}</p> : null}
    </div>
  );
}
