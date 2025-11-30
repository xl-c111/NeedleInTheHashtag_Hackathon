"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Theme } from "@/lib/types";

const THEME_LABELS: Record<Theme, string> = {
  loneliness: "Loneliness",
  "social-anxiety": "Social Anxiety",
  rejection: "Rejection",
  "self-improvement": "Self Improvement",
  "toxic-communities": "Toxic Communities",
  "finding-purpose": "Finding Purpose",
  therapy: "Therapy",
  fitness: "Fitness",
  career: "Career",
  relationships: "Relationships",
};

interface StoryFiltersProps {
  selectedThemes: Theme[];
  onThemeToggle: (theme: Theme) => void;
  onClear: () => void;
}

export function StoryFilters({
  selectedThemes,
  onThemeToggle,
  onClear,
}: StoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const themes = Object.keys(THEME_LABELS) as Theme[];
  const displayThemes = isExpanded ? themes : themes.slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-black/60 dark:text-white/60">
          Filter by theme
        </span>

        {selectedThemes.length > 0 && (
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
        {displayThemes.map((theme) => {
          const isSelected = selectedThemes.includes(theme);
          return (
            <button
              key={theme}
              onClick={() => onThemeToggle(theme)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
              }`}
            >
              {THEME_LABELS[theme]}
            </button>
          );
        })}

        {!isExpanded && themes.length > 6 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 transition-colors hover:border-black/20 dark:border-white/10 dark:text-white/60 dark:hover:border-white/20"
          >
            +{themes.length - 6} more
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
