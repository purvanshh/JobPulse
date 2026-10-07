import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";

const assumptions = [
  "Today = who to call · Inbox = incoming · Jobs = full pipeline",
  "Job status and follow-up date are separate — a job can be Waiting on Customer and overdue at once",
  "Single operator — no login or multi-user roles",
  "Local calendar day for follow-ups (machine timezone)",
  "SQLite file storage for easy local setup",
  "Inbound channels are simulated — no real Gmail/SMS/telephony",
  "Public /request-service and POST /api/inbound/[source] feed the same Inbox",
  "Marking contacted records history and next follow-up; status changes only if Denise chooses",
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
