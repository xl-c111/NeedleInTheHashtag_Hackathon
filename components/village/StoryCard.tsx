"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  title: string;
  preview: string;
  tags: string[];
  className?: string;
}

export function StoryCard({ title, preview, tags, className }: StoryCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-teal-500/30 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-teal-500/5",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <h3 className="mb-3 font-medium text-lg text-white leading-tight tracking-tight group-hover:text-teal-50 transition-colors duration-300">
          {title}
        </h3>

        {/* Preview - max 2 lines */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
          {preview}
        </p>
      </div>

      {/* Tags */}
      <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-400 ring-1 ring-teal-500/20 transition-all duration-300 group-hover:bg-teal-500/20 group-hover:ring-teal-500/30"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
