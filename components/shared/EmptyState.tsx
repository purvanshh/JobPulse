import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-nt-border bg-nt-card px-6 py-12 text-center",
        className,
      )}
    >
      <h3 className="font-display text-sm font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-xs text-nt-secondary">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
