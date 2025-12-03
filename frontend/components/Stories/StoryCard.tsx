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
      className="w-full"
    >
      <Link href={`/stories/${story.id}`}>
        <article
          className="relative overflow-hidden group transition-all flex flex-col mx-auto"
          style={{
            backgroundImage: "url('/scrollpostthicc.svg')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '999 / 738',
            maxWidth: '350px',
            minHeight: '258px'
          }}
        >
          {/* Main content area with more side padding to avoid scroll edges */}
          <div className="relative z-10 flex-1 px-8 pt-9 pb-0.5">
          {/* Title - More prominent */}
          <h3 className="font-medium text-base tracking-tight leading-tight text-black transition-colors group-hover:text-black/80 drop-shadow-lg line-clamp-3">
            {story.title}
          </h3>

          {/* Divider */}
          <div className="mt-1 h-px bg-black/10 dark:bg-white/10" />

          {/* Excerpt */}
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-black/80 drop-shadow">
            {story.excerpt}
          </p>

          {/* Tags section - dedicated space with wrapping */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {story.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground shadow-sm backdrop-blur-sm dark:bg-accent dark:text-accent-foreground whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {story.tags.length > 5 && (
              <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60 whitespace-nowrap">
                +{story.tags.length - 5} more
              </span>
            )}
          </div>
          </div>

          {/* Meta positioned in the lighter bottom area of the scroll */}
          <div className="relative z-10 px-8 pb-9 mt-auto">
            <div className="flex items-center gap-3 text-[10px] text-black/70 drop-shadow">
              {/* Favorite button */}
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className="flex items-center gap-0.5 transition-all hover:scale-110 disabled:opacity-50"
                aria-label={isFavorited ? "Unfavorite story" : "Favorite story"}
              >
                <img
                  src="/heart.svg"
                  alt={isFavorited ? "Unfavorite story" : "Favorite story"}
                  className={`h-4 w-4 transition-all ${
                    isFavorited
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
                <span className="font-medium text-[10px]">{favoriteCount}</span>
              </button>

              {/* Comment count */}
              <span className="flex items-center gap-0.5">
                <img src="/commentbubble.svg" alt="Comments" className="h-5 w-5" />
                <span className="text-[10px]">{story.commentCount ?? 0}</span>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
