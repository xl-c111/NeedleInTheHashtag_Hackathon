import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Story, Theme } from "@/lib/types";
import CommentSection from "@/components/Comments/CommentSection";
import { FavoriteButton } from "@/components/Stories/FavoriteButton";

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
    author: `Anonymous ${row.user_id.slice(-4)}`,
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
        <article className="scroll-card-thick relative min-h-[600px] p-8 sm:p-12 md:p-16">
          {/* Story Header */}
          <div className="mb-8">
            {/* Date and Meta */}
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-black/60">
              <span>{story.datePosted}</span>
              <span>•</span>
              <span>{story.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {story.readTime} min read
              </span>
              <span>•</span>
              <FavoriteButton storyId={id} />
            </div>

            {/* Title */}
            <h1 className="mb-4 font-bold text-3xl tracking-tight text-black sm:text-4xl md:text-5xl">
              {story.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/10 px-3 py-1 text-xs font-medium text-black/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Decorative divider */}
            <div className="mt-6 h-1 w-24 rounded-full bg-black/20" />
          </div>

          {/* Story Content */}
          <div className="prose prose-lg max-w-none">
            {story.content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="mb-6 text-base leading-relaxed text-black sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Comments Section with Scroll Background */}
        <div className="scroll-card-thin relative mt-12 min-h-[400px] px-10 pt-16 pb-20 sm:px-14 sm:pt-20 sm:pb-24">
          <CommentSection postId={id} />
        </div>

        {/* More stories */}
        {relatedStories.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-6 font-semibold text-2xl tracking-tight text-black">
              More stories like this
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedStories.map((relatedStory) => (
                <Link
                  key={relatedStory.id}
                  href={`/stories/${relatedStory.id}`}
                  className="scroll-card-thin relative block px-8 pt-12 pb-14 transition-transform hover:scale-[1.02]"
                >
                  <h4 className="font-semibold text-lg tracking-tight text-black">
                    {relatedStory.title}
                  </h4>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/80">
                    {relatedStory.excerpt}
                  </p>
                  <div className="mt-4 text-xs text-black/60">
                    {relatedStory.readTime} min read
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
