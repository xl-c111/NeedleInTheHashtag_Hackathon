"use client";

interface StoriesHeaderProps {
  totalStories: number;
}

export function StoriesHeader({ totalStories }: StoriesHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex-shrink-0">
            <img 
              src="/storiesbtn.svg" 
              alt="Recovery Stories" 
              className="h-24 sm:h-16 md:h-20 lg:h-24"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center sm:text-right">
            {totalStories} stories from people who've been there.
          </p>
        </div>
      </div>
    </header>
  );
}
