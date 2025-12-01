"use client";

import { useState, useMemo, useEffect } from "react";
import { StoriesHeader } from "./StoriesHeader";
import { StoryFilters } from "./StoryFilters";
import { StoryCard } from "./StoryCard";
import { fetchMentorStories } from "@/lib/supabase";
import type { Story } from "@/lib/types";

export default function StoriesPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

  // Extract unique categories from all stories
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    stories.forEach((story) => {
      story.tags.forEach((tag) => categorySet.add(tag));
    });
    return Array.from(categorySet).sort();
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (selectedCategories.length === 0) return stories;

    return stories.filter((story) =>
      story.tags.some((tag) => selectedCategories.includes(tag))
    );
  }, [selectedCategories, stories]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <StoriesHeader totalStories={stories.length} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="mb-8">
          <StoryFilters
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            onClear={handleClearFilters}
          />
        </div>

        {/* Results info */}
        {selectedCategories.length > 0 && (
          <p className="mb-6 text-sm text-black/60 dark:text-white/60">
            Showing {filteredStories.length} of {stories.length} stories
          </p>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-border border-t-foreground" />
            <p className="mt-4 text-muted-foreground">
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
            <p className="text-muted-foreground">
              No stories match your filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-sm font-medium text-foreground underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
