"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { MatchedStory } from "@/lib/api";

interface MatchedStoriesProps {
  stories: MatchedStory[];
  onClose: () => void;
}

export function MatchedStories({ stories, onClose }: MatchedStoriesProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-lg border border-black/10 bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-gray-800/50"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-black dark:text-white">
            Stories from Others 🦉
          </h3>
          <p className="text-sm text-black/60 dark:text-white/60">
            The owl brings you {stories.length} stories from people who've been there
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-black/60 transition-colors hover:bg-black/10 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Close matched stories"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {stories.map((story, index) => {
          // Generate a story URL if we have an ID
          // Use 'id' field (Supabase UUID) if post_id is null
          const storyId = story.post_id || (story as any).id;
          const storyUrl = storyId ? `/stories/${storyId}` : null;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Story Title */}
              {story.title && (
                <h4 className="mb-2 font-semibold text-card-foreground text-base">
                  {story.title}
                </h4>
              )}

              {/* Similarity Score and Tags */}
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="rounded bg-accent px-2 py-1 font-medium text-accent-foreground text-xs">
                  {Math.round(story.similarity_score * 100)}% match
                </div>
                {story.topic_tags.slice(0, 5).map((tag, i) => (
                  <span
                    key={i}
                    className="rounded bg-secondary px-2 py-1 text-secondary-foreground text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {story.topic_tags.length > 5 && (
                  <span className="rounded bg-muted px-2 py-1 text-muted-foreground text-xs">
                    +{story.topic_tags.length - 5} more
                  </span>
                )}
              </div>

              {/* Story Content */}
              <p className="mb-3 whitespace-pre-wrap text-card-foreground text-sm leading-relaxed">
                {story.content.length > 300
                  ? `${story.content.substring(0, 300)}...`
                  : story.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-xs">
                  {new Date(story.timestamp).toLocaleDateString()}
                </div>
                {storyUrl && (
                  <Link
                    href={storyUrl}
                    className="rounded-lg bg-primary px-3 py-1.5 font-medium text-primary-foreground text-xs transition-opacity hover:opacity-90"
                  >
                    Read full story →
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Stories Link */}
      <div className="mt-4 text-center">
        <Link
          href="/stories"
          className="text-sm text-black/70 underline transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
        >
          View all stories
        </Link>
      </div>
    </motion.div>
  );
}
