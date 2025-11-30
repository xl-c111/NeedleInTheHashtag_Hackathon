import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Story } from "@/lib/types";

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

// Transform post row to Story
function postToStory(row: { id: string; user_id: string; content: string; topic_tags: string[] | null; timestamp: string | null; created_at: string }): Story {
  return {
    id: row.id,
    title: generateTitle(row.content),
    author: `Anonymous ${row.user_id.slice(-4)}`,
    excerpt: generateExcerpt(row.content),
    content: row.content,
    tags: row.topic_tags || [],
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
    return { title: "Story Not Found | been there" };
  }

  return {
    title: `${story.title} | been there`,
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
    <div className="min-h-screen pt-16">
      {/* Header - simplified */}
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-3xl items-center justify-end px-4 py-4 sm:px-6">
          <span className="text-sm text-black/60 dark:text-white/60">
            {story.datePosted}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/60 dark:bg-white/5 dark:text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-semibold text-2xl tracking-tight text-black dark:text-white sm:text-3xl md:text-4xl">
          {story.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-sm text-black/50 dark:text-white/50">
          <span>{story.author}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {story.readTime} min read
          </span>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-black/10 dark:bg-white/10" />

        {/* Content */}
        <article className="scroll-card-thick relative overflow-hidden rounded-lg prose prose-lg max-w-none dark:prose-invert">
          <div className="relative z-10 bg-white/90 p-8 dark:bg-black/90">
            {story.content.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="mb-6 leading-relaxed text-black/80 dark:text-white/80"
            >
              {paragraph}
            </p>
          ))}
          </div>
        </article>

        {/* CTA */}
        <div className="scroll-card-thin relative overflow-hidden rounded-xl mt-12 border border-black/10 dark:border-white/10">
          <div className="relative z-10 bg-white/80 p-6 dark:bg-black/80">
            <h3 className="font-medium text-base tracking-tight text-black dark:text-white">
              Did this story resonate with you?
            </h3>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              Talk to been there about what you're going through. We'll help you find
              more stories from people who understand.
            </p>
            <Link
              href="/chat"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
            >
              <MessageCircle className="h-4 w-4" />
              Start talking
            </Link>
          </div>
        </div>

        {/* More stories */}
        <div className="mt-12">
          <h3 className="font-medium text-lg tracking-tight text-black dark:text-white">
            More stories
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedStories.map((relatedStory) => (
              <Link
                key={relatedStory.id}
                href={`/stories/${relatedStory.id}`}
                className="scroll-card-thin relative overflow-hidden rounded-lg border border-black/10 transition-colors hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
              >
                <div className="relative z-10 bg-white/85 p-4 dark:bg-black/85">
                  <h4 className="font-medium text-sm tracking-tight text-black dark:text-white">
                    {relatedStory.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-black/60 dark:text-white/60">
                    {relatedStory.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
