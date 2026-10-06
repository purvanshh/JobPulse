type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-nt-border px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-xs tracking-tight text-nt-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
