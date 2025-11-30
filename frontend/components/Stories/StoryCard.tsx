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
          <div className="relative z-10 flex-1 px-12 pt-10 pb-4">
            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {story.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-black shadow-sm backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-medium text-lg tracking-tight text-black transition-colors group-hover:text-black/80 drop-shadow-lg">
              {story.title}
            </h3>

            {/* Excerpt */}
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/80 drop-shadow">
              {story.excerpt}
            </p>
          </div>

          {/* Meta positioned in the lighter bottom area of the scroll */}
          <div className="relative z-10 px-12 pb-12 mt-auto">
            <div className="flex items-center justify-between text-xs text-black/70 drop-shadow">
              <span className="font-medium">{story.author}</span>
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
