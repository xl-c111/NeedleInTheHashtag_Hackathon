"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/Auth";

interface FavoriteButtonProps {
  storyId: string;
}

export function FavoriteButton({ storyId }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isToggling, setIsToggling] = useState(false);

  // Load favorite status and count
  useEffect(() => {
    const loadFavoriteData = async () => {
      const { getFavoriteCount, isPostFavorited } = await import("@/lib/supabase");

      const count = await getFavoriteCount(storyId);
      setFavoriteCount(count);

      if (user) {
        const favorited = await isPostFavorited(user.id, storyId);
        setIsFavorited(favorited);
      }
    };

    loadFavoriteData();
  }, [storyId, user]);

  const handleToggle = async () => {
    if (!user) {
      alert("Please sign in to favorite stories");
      return;
    }

    if (isToggling) return;
    setIsToggling(true);

    // Optimistic update
    const previousFavorited = isFavorited;
    const previousCount = favoriteCount;

    setIsFavorited(!isFavorited);
    setFavoriteCount(prev => isFavorited ? prev - 1 : prev + 1);

    try {
      const { toggleFavorite } = await import("@/lib/supabase");
      const { isFavorited: newFavorited, error } = await toggleFavorite(user.id, storyId);

      if (error) {
        setIsFavorited(previousFavorited);
        setFavoriteCount(previousCount);
        console.error("Failed to toggle favorite:", error);
      } else {
        setIsFavorited(newFavorited);
      }
    } catch (error) {
      setIsFavorited(previousFavorited);
      setFavoriteCount(previousCount);
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className="flex items-center gap-1 transition-all hover:scale-110 disabled:opacity-50"
      aria-label={isFavorited ? "Unfavorite story" : "Favorite story"}
    >
      <img 
        src="/heart.svg" 
        alt={isFavorited ? "Unfavorite story" : "Favorite story"}
        className={`h-6 w-6 transition-all ${
          isFavorited
            ? "opacity-100"
            : "opacity-60 hover:opacity-100"
        }`}
      />
      <span className="text-sm font-medium text-black/60">{favoriteCount}</span>
    </button>
  );
}
