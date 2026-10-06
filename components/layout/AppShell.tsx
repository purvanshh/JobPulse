import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-nt-bg text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileNav />
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
