"use client";

interface ResourcesHeaderProps {
  totalResources: number;
}

export function ResourcesHeader({ totalResources }: ResourcesHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Professional Resources
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access trusted support services across Australia
            </p>
          </div>
          <p className="text-sm text-muted-foreground text-center sm:text-right">
            {totalResources} resources available
          </p>
        </div>
      </div>
    </header>
  );
}
