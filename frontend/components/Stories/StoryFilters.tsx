"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface StoryFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClear: () => void;
}

export function StoryFilters({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClear,
}: StoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safety check: ensure categories is defined
  const safeCategories = categories || [];
  const displayCategories = isExpanded ? safeCategories : safeCategories.slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-black/60 dark:text-white/60">
          Filter by category
        </span>

        {selectedCategories.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayCategories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          );
        })}

        {!isExpanded && safeCategories.length > 6 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 transition-colors hover:border-black/20 dark:border-white/10 dark:text-white/60 dark:hover:border-white/20"
          >
            +{safeCategories.length - 6} more
          </button>
        )}

        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 transition-colors hover:border-black/20 dark:border-white/10 dark:text-white/60 dark:hover:border-white/20"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}
