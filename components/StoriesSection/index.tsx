import { StoryCard } from "@/components/village/StoryCard";
import { stories } from "./StoriesData";

export default function StoriesSection() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="font-semibold text-2xl text-secondary leading-tight tracking-tight sm:text-3xl md:text-4xl dark:text-white">
          Real stories from the community
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Anonymous perspectives from people who've been where you are. No
          judgement, just honest experiences.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            title={story.title}
            preview={story.preview}
            tags={story.tags}
          />
        ))}
      </div>
    </section>
  );
}
