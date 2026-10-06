type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-1 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-xs tracking-tight text-nt-muted">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
