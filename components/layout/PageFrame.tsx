export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1184px] flex-1 flex-col gap-7 p-4 sm:p-8 lg:p-10">
      {children}
    </div>
  );
}
