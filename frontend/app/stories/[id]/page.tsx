import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MessageCircle } from "lucide-react";
import { getStoryById, seedStories } from "@/lib/data/stories";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return seedStories.map((story) => ({
    id: story.id,
  }));
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { id } = await params;
  const story = getStoryById(id);

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
  const story = getStoryById(id);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-black">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/stories"
            className="flex items-center gap-2 rounded-full p-2 text-sm text-black/60 transition-colors hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to stories</span>
          </Link>

          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Start talking</span>
          </Link>
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
        <article className="prose prose-lg max-w-none dark:prose-invert">
          {story.content.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="mb-6 leading-relaxed text-black/80 dark:text-white/80"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-medium text-base tracking-tight text-black dark:text-white">
            Did this story resonate with you?
          </h3>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Talk to Village about what you're going through. We'll help you find
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

        {/* More stories */}
        <div className="mt-12">
          <h3 className="font-medium text-lg tracking-tight text-black dark:text-white">
            More stories
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {seedStories
              .filter((s) => s.id !== story.id)
              .slice(0, 2)
              .map((relatedStory) => (
                <Link
                  key={relatedStory.id}
                  href={`/stories/${relatedStory.id}`}
                  className="rounded-lg border border-black/10 p-4 transition-colors hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
                >
                  <h4 className="font-medium text-sm tracking-tight text-black dark:text-white">
                    {relatedStory.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-black/60 dark:text-white/60">
                    {relatedStory.excerpt}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
