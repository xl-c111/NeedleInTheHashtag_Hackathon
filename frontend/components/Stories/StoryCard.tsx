"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Clock } from "lucide-react";
import type { Story } from "@/lib/types";

interface StoryCardProps {
  story: Story;
  index?: number;
}

export function StoryCard({ story, index = 0 }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/stories/${story.id}`}>
        <article className="scroll-card-thick relative overflow-hidden rounded-lg group h-full border border-black/10 transition-all hover:border-black/20 hover:shadow-sm dark:border-white/10 dark:hover:border-white/20">
          <div className="relative z-10 bg-white/85 p-6 dark:bg-black/85">
            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
            {story.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/60 dark:bg-white/5 dark:text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-medium text-lg tracking-tight text-black transition-colors group-hover:text-black/80 dark:text-white dark:group-hover:text-white/80">
            {story.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/60 dark:text-white/60">
            {story.excerpt}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center justify-between text-xs text-black/40 dark:text-white/40">
            <span>{story.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {story.readTime} min
            </span>
          </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
