"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { StoryCard } from "./StoryCard";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const previewStories = [
  {
    id: "1",
    title: "I used to blame everyone else",
    preview:
      "For years I thought the world was against me. The turning point came when I realised I was pushing people away...",
    tags: ["loneliness", "growth"],
  },
  {
    id: "2",
    title: "The gym didn't fix me, but it helped",
    preview:
      "Everyone says 'just go to the gym' like it solves everything. It doesn't. But what it gave me was...",
    tags: ["self-esteem", "small-wins"],
  },
  {
    id: "3",
    title: "She wasn't the answer",
    preview:
      "I thought if I just got a girlfriend, everything would be fixed. When I stopped treating relationships as a solution...",
    tags: ["dating", "growth"],
  },
];

export function StoriesPreview() {
  return (
    <section className="relative bg-slate-900 py-24 sm:py-32">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent" />

      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-4 font-semibold text-2xl text-white tracking-tight sm:text-3xl md:text-4xl">
            Stories from people who've been there
          </h2>
          <p className="mx-auto max-w-xl text-slate-400 tracking-tight">
            Real experiences, real growth
          </p>
        </motion.div>

        {/* Stories grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <StoryCard
                title={story.title}
                preview={story.preview}
                tags={story.tags}
              />
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <Button
            asChild
            className="h-11 rounded-xl border-slate-700 bg-slate-800/50 px-6 text-slate-300 transition-all duration-300 hover:border-teal-500/50 hover:bg-slate-800 hover:text-teal-300"
            variant="outline"
          >
            <Link href="/village/stories">
              Read more stories
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
