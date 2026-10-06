"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ClipboardList, Settings, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Today", icon: CalendarDays, attention: true },
  { href: "/jobs", label: "Jobs", icon: ClipboardList, attention: false },
  { href: "/settings", label: "Settings", icon: Settings, attention: false },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 select-none flex-col justify-between border-r border-nt-border bg-[#0A0A0A] md:flex">
      <div className="p-5">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-nt-border bg-[#18181B] text-white">
            <Wrench className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h1 className="text-sm leading-none font-semibold tracking-tight text-white">
              JobPulse
            </h1>
            <p className="mt-1 font-mono text-[10px] tracking-tight text-nt-secondary">
              Follow-up workspace
            </p>
          </div>
        </div>

        <nav className="space-y-1" aria-label="Main">
          {navItems.map(({ href, label, icon: Icon, attention }) => {
            const active = isActive(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center rounded-[4px] px-3 py-2 text-xs font-medium transition-colors",
                  active
                    ? "justify-between border border-[#27272A] bg-[#161616] text-white"
                    : "gap-2.5 text-nt-muted hover:bg-[#141414] hover:text-white",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {label}
                </span>
                {active && attention ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-nt-red shadow-[0_0_8px_rgba(255,46,46,0.6)]" />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center justify-between border-t border-nt-border bg-[#0A0A0A] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] font-mono text-xs font-semibold text-white">
            D
          </div>
          <div className="flex flex-col">
            <span className="text-xs leading-tight font-medium text-white">
              Denise
            </span>
            <span className="font-mono text-[10px] text-nt-secondary">
              Workspace Admin
            </span>
          </div>
        </div>
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
      </div>
    </aside>
  );
}
