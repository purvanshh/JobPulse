import { QuickAddInboundDialog } from "@/components/inbox/QuickAddInboundDialog";
import { SimulateInboundDialog } from "@/components/inbox/SimulateInboundDialog";
import { InboxList } from "@/components/inbox/InboxList";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { listInboundRequests, sortInboxRequests } from "@/lib/inbound";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inbox — JobPulse",
};

export default async function InboxPage() {
  const requests = sortInboxRequests(await listInboundRequests());
  const newCount = requests.filter((request) => request.status === "NEW").length;

  return (
    <PageFrame>
      <PageHeader
        title="Inbox"
        description={
          newCount === 0
            ? "Incoming requests before they become jobs."
            : newCount === 1
              ? "1 new request needs a look."
              : `${newCount} new requests need a look.`
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SimulateInboundDialog />
            <QuickAddInboundDialog />
          </div>
        }
      />

      {newCount > 0 ? (
        <p className="font-mono text-[11px] tracking-wide text-nt-amber uppercase">
          {newCount} new
        </p>
      ) : null}

      <InboxList
        requests={requests}
        emptyAction={
          <div className="flex flex-wrap items-center justify-center gap-2">
            <SimulateInboundDialog />
            <QuickAddInboundDialog />
          </div>
        }
      />
    </PageFrame>
  );
}
