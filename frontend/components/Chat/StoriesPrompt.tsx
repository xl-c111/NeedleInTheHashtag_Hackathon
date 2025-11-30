"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export function StoriesPrompt() {
  return (
    <div className="rounded-xl border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
          <BookOpen className="h-5 w-5 text-black/60 dark:text-white/60" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-sm tracking-tight text-black dark:text-white">
            Ready to hear from others?
          </h3>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Based on our conversation, I think some stories from people who've
            been through similar experiences might resonate with you.
          </p>

          <Link
            href="/stories"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            Browse stories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
