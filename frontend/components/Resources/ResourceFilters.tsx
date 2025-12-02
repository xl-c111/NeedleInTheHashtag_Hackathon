"use client";

interface ResourceFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClear: () => void;
}

export function ResourceFilters({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClear,
}: ResourceFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">
          Filter by category
        </h2>
        {selectedCategories.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm font-medium text-muted-foreground underline transition-colors hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
