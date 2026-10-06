import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";

const assumptions = [
  "Single operator — no login or multi-user roles",
  "Local calendar day for follow-ups (machine timezone)",
  "SQLite file storage for easy local setup",
  "No email, SMS, or quote-sending integrations",
  "No push notifications or reminder workers",
  "Call uses a phone link (tel:) when a number exists",
];

export default function SettingsPage() {
  return (
    <PageFrame>
      <PageHeader
        title="Settings"
        description="Honest assumptions for this hiring-assignment prototype."
      />
      <section className="max-w-2xl space-y-4 rounded-lg border border-nt-border bg-nt-surface p-4 sm:p-6">
        <div className="border-b border-nt-border pb-4">
          <p className="font-mono text-[10px] font-semibold tracking-widest text-nt-secondary uppercase">
            Assumptions
          </p>
          <h2 className="mt-1 font-display text-base font-bold tracking-tight text-white">
            Current prototype assumptions
          </h2>
          <p className="mt-1 text-xs text-nt-secondary">
            JobPulse is intentionally small. These constraints keep the demo
            focused on Denise&apos;s follow-up problem.
          </p>
        </div>
        <ul className="divide-y divide-nt-border">
          {assumptions.map((item) => (
            <li
              key={item}
              className="py-3 font-mono text-[11px] tracking-wide text-neutral-300 uppercase first:pt-1 last:pb-1"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </PageFrame>
  );
}
