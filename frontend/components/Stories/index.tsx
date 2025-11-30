"use client";

import { useState, useMemo, useEffect } from "react";
import { StoriesHeader } from "./StoriesHeader";
import { StoryFilters } from "./StoryFilters";
import { StoryCard } from "./StoryCard";
import { fetchMentorStories } from "@/lib/supabase";
import type { Theme, Story } from "@/lib/types";

export default function StoriesPage() {
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stories from Supabase on mount
  useEffect(() => {
    async function loadStories() {
      setIsLoading(true);
      const supabaseStories = await fetchMentorStories();
      setStories(supabaseStories);
      setIsLoading(false);
    }
    loadStories();
  }, []);

  const filteredStories = useMemo(() => {
    if (selectedThemes.length === 0) return stories;

    return stories.filter((story) =>
      story.themes.some((theme) => selectedThemes.includes(theme))
    );
  }, [selectedThemes, stories]);

  const handleThemeToggle = (theme: Theme) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleClearFilters = () => {
    setSelectedThemes([]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <StoriesHeader totalStories={stories.length} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="mb-8">
          <StoryFilters
            selectedThemes={selectedThemes}
            onThemeToggle={handleThemeToggle}
            onClear={handleClearFilters}
          />
        </div>

        {/* Results info */}
        {selectedThemes.length > 0 && (
          <p className="mb-6 text-sm text-black/60 dark:text-white/60">
            Showing {filteredStories.length} of {stories.length} stories
          </p>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
            <p className="mt-4 text-black/60 dark:text-white/60">
              Loading stories...
            </p>
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-black/60 dark:text-white/60">
              No stories match your filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-sm font-medium text-black underline dark:text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
