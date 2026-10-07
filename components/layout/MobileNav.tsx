"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Wrench } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isNavActive, NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileNav({ newInboundCount = 0 }: { newInboundCount?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-nt-border bg-[#0A0A0A] px-4 py-3 md:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-nt-border bg-[#18181B] text-white">
          <Wrench className="h-4 w-4" aria-hidden />
        </div>
        <div>
          <p className="text-sm leading-none font-semibold tracking-tight">JobPulse</p>
          <p className="mt-1 font-mono text-[10px] text-nt-secondary">Follow-up workspace</p>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Open menu"
              className="border-nt-border bg-transparent text-nt-muted hover:bg-[#141414] hover:text-white"
            />
          }
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 border-nt-border bg-[#0A0A0A] p-0 text-white shadow-none"
        >
          <SheetHeader className="border-b border-nt-border px-5 py-5 text-left">
            <SheetTitle className="font-display text-sm font-semibold tracking-tight text-white">
              JobPulse
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Mobile">
            {NAV_ITEMS.map(({ href, label, icon: Icon, attention, badgeKey }) => {
              const active = isNavActive(pathname, href);
              const badge =
                badgeKey === "inboundNew" && newInboundCount > 0
                  ? newInboundCount
                  : null;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center rounded-[4px] px-3 py-2 text-xs font-medium transition-colors",
                    active
                      ? "justify-between border border-[#27272A] bg-[#161616] text-white"
                      : "gap-2.5 text-nt-muted hover:bg-[#141414] hover:text-white",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {label}
                  </span>
                  {badge != null ? (
                    <span className="rounded-[4px] bg-nt-amber-subtle px-1.5 py-0.5 font-mono text-[10px] font-semibold text-nt-amber">
                      {badge}
                    </span>
                  ) : active && attention ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-nt-red shadow-[0_0_8px_rgba(255,46,46,0.6)]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex items-center justify-between border-t border-nt-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] font-mono text-xs font-semibold">
                D
              </div>
              <div className="flex flex-col">
                <span className="text-xs leading-tight font-medium">Denise</span>
                <span className="font-mono text-[10px] text-nt-secondary">
                  Workspace Admin
                </span>
              </div>
            </div>
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
