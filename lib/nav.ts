import {
  CalendarDays,
  ClipboardList,
  Inbox,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  attention?: boolean;
  badgeKey?: "inboundNew";
};

/** Today = act · Inbox = incoming · Jobs = pipeline. Settings stays tertiary. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Today", icon: CalendarDays, attention: true },
  { href: "/inbox", label: "Inbox", icon: Inbox, badgeKey: "inboundNew" },
  { href: "/jobs", label: "Jobs", icon: ClipboardList },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
