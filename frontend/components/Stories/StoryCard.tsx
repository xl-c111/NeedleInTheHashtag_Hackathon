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
        <article 
          className="relative overflow-hidden group h-full transition-all flex flex-col"
          style={{
            backgroundImage: "url('/scrollpostthicc.svg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Main content area with larger margins to avoid scroll edges */}
          <div className="relative z-10 flex-1 px-8 pt-14 pb-4">
          {/* Title */}
          <h3 className="font-medium text-lg tracking-tight text-black transition-colors group-hover:text-black/80 drop-shadow-lg">
            {story.title}
          </h3>

          {/* Divider */}
          <div className="mt-3 h-px bg-black/10 dark:bg-white/10" />

          {/* Excerpt */}
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-black/80 drop-shadow">
            {story.excerpt}
          </p>

          {/* Divider */}
          <div className="mt-4 h-px bg-black/10 dark:bg-white/10" />

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {story.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground shadow-sm backdrop-blur-sm dark:bg-accent dark:text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          </div>

          {/* Meta positioned in the lighter bottom area of the scroll */}
          <div className="relative z-10 px-8 pb-16 mt-auto">
            <div className="flex items-center justify-end text-xs text-black/70 drop-shadow">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {story.readTime} min read
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
