"use client";

import { useState, useMemo } from "react";
import { StoriesHeader } from "./StoriesHeader";
import { StoryFilters } from "./StoryFilters";
import { StoryCard } from "./StoryCard";
import { seedStories } from "@/lib/data/stories";
import type { Theme } from "@/lib/types";

export default function StoriesPage() {
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);

  const filteredStories = useMemo(() => {
    if (selectedThemes.length === 0) return seedStories;

    return seedStories.filter((story) =>
      story.themes.some((theme) => selectedThemes.includes(theme))
    );
  }, [selectedThemes]);

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
      <StoriesHeader totalStories={seedStories.length} />

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
            Showing {filteredStories.length} of {seedStories.length} stories
          </p>
        )}

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
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
