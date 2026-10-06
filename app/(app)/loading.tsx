export default function TodayLoading() {
  return (
    <div className="mx-auto w-full max-w-[1184px] flex-1 space-y-7 p-4 sm:p-8 lg:p-10">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">
          Good morning, Denise
        </h2>
        <p className="mt-1 text-xs tracking-tight text-nt-muted">
          Loading today&apos;s follow-ups…
        </p>
      </div>
      <div className="h-10 animate-pulse rounded-[4px] border border-nt-border bg-nt-surface" />
      <div className="h-72 animate-pulse rounded-lg border border-nt-border bg-nt-surface" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-lg border border-nt-border bg-nt-surface"
          />
        ))}
      </div>
    </div>
  );
}
