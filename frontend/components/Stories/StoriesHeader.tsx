"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

interface StoriesHeaderProps {
  totalStories: number;
}

export function StoriesHeader({ totalStories }: StoriesHeaderProps) {
  return (
    <header className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ArrowLeft className="h-5 w-5 text-black/60 dark:text-white/60" />
            </Link>

            <div>
              <h1 className="font-semibold text-2xl tracking-tight text-black dark:text-white sm:text-3xl">
                Recovery Stories
              </h1>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                {totalStories} stories from people who've been there
              </p>
            </div>
          </div>

          <Link
            href="/chat"
            className="hidden items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            Start talking
          </Link>
        </div>
      </div>
    </header>
  );
}
