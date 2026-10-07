import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { countNewInboundRequests } from "@/lib/inbound";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const newInboundCount = await countNewInboundRequests();

  return (
    <AppShell newInboundCount={newInboundCount}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </AppShell>
  );
}
