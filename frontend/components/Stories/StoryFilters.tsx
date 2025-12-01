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

  const displayCategories = isExpanded ? categories : categories.slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Filter by category
        </span>

        {selectedCategories.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category}
            </button>
          );
        })}

        {!isExpanded && categories.length > 6 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-ring"
          >
            +{categories.length - 6} more
          </button>
        )}

        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-ring"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}
