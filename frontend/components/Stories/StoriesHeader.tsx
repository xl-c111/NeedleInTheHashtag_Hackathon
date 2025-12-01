"use client";

interface StoriesHeaderProps {
  totalStories: number;
}

export function StoriesHeader({ totalStories }: StoriesHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-2xl tracking-tight text-foreground sm:text-3xl">
            Recovery Stories
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalStories} stories from people who've been there
          </p>
        </div>
      </div>
    </header>
  );
}
