"use client";

import { useState, useMemo } from "react";
import { ResourcesHeader } from "./ResourcesHeader";
import { ResourceFilters } from "./ResourceFilters";
import { ResourceCard } from "./ResourceCard";
import { RESOURCES, RESOURCE_CATEGORIES } from "@/lib/data/resources";

export default function ResourcesPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredResources = useMemo(() => {
    if (selectedCategories.length === 0) return RESOURCES;

    return RESOURCES.filter((resource) =>
      selectedCategories.includes(resource.category)
    );
  }, [selectedCategories]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <ResourcesHeader totalResources={RESOURCES.length} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="mb-8">
          <ResourceFilters
            categories={[...RESOURCE_CATEGORIES]}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            onClear={handleClearFilters}
          />
        </div>

        {/* Results info */}
        {selectedCategories.length > 0 && (
          <p className="mb-6 text-sm text-black/60 dark:text-white/60">
            Showing {filteredResources.length} of {RESOURCES.length} resources
          </p>
        )}

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource, index) => (
              <ResourceCard key={resource.id} resource={resource} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No resources match your filters.
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

      {/* Important Notice */}
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">
            In an emergency
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            If you or someone you know is in immediate danger, please call{" "}
            <strong className="text-foreground">000</strong> for emergency
            services or go to your nearest hospital emergency department.
          </p>
        </div>
      </div>
    </div>
  );
}
