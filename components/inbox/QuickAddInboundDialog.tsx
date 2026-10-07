"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  createInboundRequest,
  type InboundActionResult,
} from "@/lib/inbound-actions";
import { toDateTimeLocalValue } from "@/lib/format-received";
import { INBOUND_SOURCE_LABELS, INBOUND_SOURCES } from "@/types";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const initialState: InboundActionResult = { ok: false };

export function QuickAddInboundDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const lastHandledId = useRef<string | null>(null);
  const [state, formAction, pending] = useActionState(
    createInboundRequest,
    initialState,
  );

  useEffect(() => {
    if (!state.ok || !state.requestId || state.requestId === lastHandledId.current) {
      return;
    }
    lastHandledId.current = state.requestId;
    toast.success(state.message ?? "Request added.");
    setOpen(false);
    setFormKey((value) => value + 1);
    router.refresh();
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants(),
          "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs",
        )}
      >
        <span className="font-mono text-sm leading-none font-bold">+</span>
        Quick add
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick add request</DialogTitle>
          <DialogDescription className="text-xs text-nt-secondary">
            Capture a phone, text, referral, or notebook request in seconds.
          </DialogDescription>
        </DialogHeader>
        <form key={formKey} action={formAction} className="space-y-3">
          {state.message && !state.ok ? (
            <p
              role="alert"
              className="rounded-[4px] border border-nt-red-border bg-nt-red-subtle px-3 py-2 font-mono text-xs text-nt-red"
            >
              {state.message}
            </p>
          ) : null}
          <Field id="qa-source" label="Source" error={state.fieldErrors?.source}>
            <select
              id="qa-source"
              name="source"
              defaultValue="PHONE"
              className={selectClass}
            >
              {INBOUND_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {INBOUND_SOURCE_LABELS[source]}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id="qa-name"
            label="Customer name"
            required
            error={state.fieldErrors?.customerName}
          >
            <Input id="qa-name" name="customerName" required autoFocus />
          </Field>
          <Field
            id="qa-phone"
            label="Phone"
            required
            error={state.fieldErrors?.customerPhone}
          >
            <Input id="qa-phone" name="customerPhone" type="tel" required />
          </Field>
          <Field
            id="qa-email"
            label="Email (optional)"
            error={state.fieldErrors?.customerEmail}
          >
            <Input id="qa-email" name="customerEmail" type="email" />
          </Field>
          <Field
            id="qa-message"
            label="Request"
            required
            error={state.fieldErrors?.message}
          >
            <Textarea id="qa-message" name="message" rows={3} required />
          </Field>
          <Field
            id="qa-received"
            label="Received time"
            error={state.fieldErrors?.receivedAt}
          >
            <Input
              id="qa-received"
              name="receivedAt"
              type="datetime-local"
              defaultValue={toDateTimeLocalValue()}
            />
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Add to inbox"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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

const selectClass =
  "flex h-9 w-full rounded-[4px] border border-[#27272A] bg-[#0A0A0A] px-3 font-mono text-xs text-white outline-none focus-visible:border-white";
