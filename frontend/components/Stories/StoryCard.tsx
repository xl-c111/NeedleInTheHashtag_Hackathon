"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/Auth";
import type { Story } from "@/lib/types";

interface StoryCardProps {
  story: Story;
  index?: number;
  onFavoriteChange?: (storyId: string, isFavorited: boolean) => void;
}

export function StoryCard({ story, index = 0, onFavoriteChange }: StoryCardProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Load favorite status and count on mount
  useEffect(() => {
    const loadFavoriteData = async () => {
      const { getFavoriteCount, isPostFavorited } = await import("@/lib/supabase");

      // Get favorite count
      const count = await getFavoriteCount(story.id);
      setFavoriteCount(count);

      // Check if user has favorited (only if logged in)
      if (user) {
        const favorited = await isPostFavorited(user.id, story.id);
        setIsFavorited(favorited);
      }
    };

    loadFavoriteData();
  }, [story.id, user]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    if (!user) {
      alert("Please sign in to favorite stories");
      return;
    }

    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);

    // Optimistic update
    const previousFavorited = isFavorited;
    const previousCount = favoriteCount;

    setIsFavorited(!isFavorited);
    setFavoriteCount(prev => isFavorited ? prev - 1 : prev + 1);

    try {
      const { toggleFavorite } = await import("@/lib/supabase");
      const { isFavorited: newFavorited, error } = await toggleFavorite(user.id, story.id);

      if (error) {
        // Revert on error
        setIsFavorited(previousFavorited);
        setFavoriteCount(previousCount);
        console.error("Failed to toggle favorite:", error);
      } else {
        // Update with actual value
        setIsFavorited(newFavorited);
        // Notify parent component of the change
        if (onFavoriteChange) {
          onFavoriteChange(story.id, newFavorited);
        }
      }
    } catch (error) {
      // Revert on error
      setIsFavorited(previousFavorited);
      setFavoriteCount(previousCount);
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

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
            <div className="flex items-center justify-between text-xs text-black/70 drop-shadow">
              {/* Favorite button */}
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className="flex items-center gap-1 transition-all hover:scale-110 disabled:opacity-50"
                aria-label={isFavorited ? "Unfavorite story" : "Favorite story"}
              >
                <img 
                  src="/heart.svg" 
                  alt={isFavorited ? "Unfavorite story" : "Favorite story"}
                  className={`h-6 w-6 transition-all ${
                    isFavorited
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
                <span className="font-medium">{favoriteCount}</span>
              </button>

              {/* Comment count */}
              <span className="flex items-center gap-1">
                <img src="/commentbubble.svg" alt="Comments" className="h-8 w-8" />
                {story.commentCount ?? 0} {story.commentCount === 1 ? 'response' : 'responses'}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
