import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Story, Theme } from "@/lib/types";
import CommentSection from "@/components/Comments/CommentSection";
import { FavoriteButton } from "@/components/Stories/FavoriteButton";
import { StoryCard } from "@/components/Stories/StoryCard";
import { generateUsername } from "@/lib/utils";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

// Generate title from content
function generateTitle(content: string): string {
  const firstSentence = content.split(/[.!?]/)[0]?.trim();
  if (firstSentence && firstSentence.length <= 80) return firstSentence;
  const truncated = content.substring(0, 60);
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.substring(0, lastSpace > 0 ? lastSpace : 60) + "...";
}

// Generate excerpt
function generateExcerpt(content: string): string {
  const maxLength = 200;
  if (content.length <= maxLength) return content;
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.substring(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
}

// Calculate read time
function calculateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Map topic_tags to themes
function mapTopicTagsToThemes(topicTags: string[] | null): Theme[] {
  if (!topicTags) return ['self-improvement'];

  const tagToTheme: Record<string, Theme> = {
    'Mental health history': 'therapy',
    'Views on women': 'relationships',
    'Views on men/masculinity': 'self-improvement',
    'Dating history': 'rejection',
    'Sexuality': 'relationships',
    'Friendship history': 'loneliness',
    'Online spaces': 'toxic-communities',
    'Social isolation': 'loneliness',
    'Self-improvement': 'self-improvement',
    'Career': 'career',
    'Fitness': 'fitness',
    'Purpose': 'finding-purpose',
  };

  const themes = new Set<Theme>();
  for (const tag of topicTags) {
    const theme = tagToTheme[tag];
    if (theme) themes.add(theme);
  }

  return themes.size === 0 ? ['self-improvement'] : Array.from(themes);
}

// Transform post row to Story
function postToStory(row: { id: string; user_id: string; content: string; topic_tags: string[] | null; timestamp: string | null; created_at: string }): Story {
  return {
    id: row.id,
    title: generateTitle(row.content),
    author: generateUsername(row.user_id),
    excerpt: generateExcerpt(row.content),
    content: row.content,
    tags: row.topic_tags || [],
    themes: mapTopicTagsToThemes(row.topic_tags),
    readTime: calculateReadTime(row.content),
    datePosted: row.timestamp ? new Date(row.timestamp).toISOString().split("T")[0] : row.created_at.split("T")[0],
  };
}

// Helper to fetch story from Supabase posts table
async function fetchStoryFromSupabase(id: string): Promise<Story | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return postToStory(data);
}

// Helper to fetch related stories from Supabase posts table
async function fetchRelatedStories(excludeId: string): Promise<Story[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .neq("id", excludeId)
    .limit(2);

  if (error || !data) {
    return [];
  }

  return data.map(postToStory);
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { id } = await params;

  const story = await fetchStoryFromSupabase(id);

  if (!story) {
    return { title: "Story Not Found | Village" };
  }

  return {
    title: `${story.title} | Village`,
    description: story.excerpt,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;

  const story = await fetchStoryFromSupabase(id);

  if (!story) {
    notFound();
  }

  // Fetch related stories
  const relatedStories = await fetchRelatedStories(id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-16 pb-12">
      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Story Scroll Card - Main Content */}
        <article className="scroll-card-thick relative px-16 py-[15%] sm:px-20 md:px-24 lg:px-28 overflow-hidden">
          {/* Story Header */}
          <div className="mb-4 sm:mb-6">
            {/* Date and Meta */}
            <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-black/60">
              <span>{story.datePosted}</span>
              <span>•</span>
              <span>{story.author}</span>
            </div>

            {/* Title */}
            <h1 className="mb-3 font-bold text-lg tracking-tight text-black break-words sm:text-xl md:text-2xl">
              {story.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-medium text-black/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Decorative divider */}
            <div className="mt-3 h-0.5 w-16 rounded-full bg-black/20" />
          </div>

          {/* Story Content */}
          <div className="prose max-w-none">
            {story.content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="mb-3 text-xs leading-relaxed text-black break-words sm:text-sm"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Favorite Button - Bottom Left */}
          <div className="mt-4">
            <FavoriteButton storyId={id} />
          </div>
        </article>

        {/* Comments Section with Scroll Background */}
        <div className="scroll-card-thin relative mt-12 px-12 py-8 sm:px-16 sm:py-10 md:px-20 md:py-12 lg:px-24 lg:py-14 min-h-[600px] flex flex-col">
          <CommentSection postId={id} />
        </div>

        {/* More stories */}
        {relatedStories.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="mb-6 flex justify-center">
              <img
                src="/moreribbon.svg"
                alt="More stories like this"
                className="h-16 sm:h-20"
              />
            </div>
            <div className="grid gap-4 sm:gap-50 sm:grid-cols-2 lg:grid-cols-3">
              {relatedStories.map((relatedStory, index) => (
                <StoryCard key={relatedStory.id} story={relatedStory} index={index} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
