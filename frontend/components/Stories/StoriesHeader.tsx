"use client";

interface StoriesHeaderProps {
  totalStories: number;
}

export function StoriesHeader({ totalStories }: StoriesHeaderProps) {
  return (
    <header className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-2xl tracking-tight text-black dark:text-white sm:text-3xl">
            Recovery Stories
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {totalStories} stories from people who've been there
          </p>
        </div>
      </div>
    </header>
  );
}
