"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ClipboardList, PlusCircle, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/jobs", label: "Jobs", icon: ClipboardList },
  { href: "/jobs/new", label: "Add Job", icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wrench className="size-5" aria-hidden />
        </div>
        <div>
          <p className="font-semibold leading-tight">JobPulse</p>
          <p className="text-xs text-muted-foreground">Follow-up workspace</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/jobs/new"
              ? pathname === "/jobs/new"
              : href === "/jobs"
                ? pathname === "/jobs" ||
                  (pathname.startsWith("/jobs/") && pathname !== "/jobs/new")
                : pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
