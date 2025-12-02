"use client";

import { motion } from "motion/react";
import type { Resource } from "@/lib/data/resources";
import { ExternalLink, Phone, Clock } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
  index?: number;
}

export function ResourceCard({ resource, index = 0 }: ResourceCardProps) {
  const handleClick = () => {
    if (resource.website) {
      window.open(resource.website, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <article
        onClick={handleClick}
        className={`relative overflow-hidden group h-full transition-all flex flex-col ${
          resource.website ? "cursor-pointer" : ""
        }`}
        style={{
          backgroundImage: "url('/scrollpostthicc.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Main content area */}
        <div className="relative z-10 flex-1 px-8 pt-14 pb-4">
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-lg tracking-tight text-black transition-colors group-hover:text-black/80 drop-shadow-lg">
              {resource.title}
            </h3>
            {resource.website && (
              <ExternalLink className="h-4 w-4 text-black/60 flex-shrink-0 mt-1" />
            )}
          </div>

          {/* Divider */}
          <div className="mt-3 h-px bg-black/10 dark:bg-white/10" />

          {/* Description */}
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-black/80 drop-shadow">
            {resource.description}
          </p>

          {/* Divider */}
          <div className="mt-4 h-px bg-black/10 dark:bg-white/10" />

          {/* Contact Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-black/90 drop-shadow">
              <Phone className="h-4 w-4" />
              <span className="font-medium">{resource.contactInfo}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-black/80 drop-shadow">
              <Clock className="h-4 w-4" />
              <span>{resource.availability}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground shadow-sm backdrop-blur-sm dark:bg-accent dark:text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Category badge in bottom area */}
        <div className="relative z-10 px-8 pb-16 mt-auto">
          <div className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
            {resource.category}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
