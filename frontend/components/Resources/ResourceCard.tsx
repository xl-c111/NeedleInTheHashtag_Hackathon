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
      className="w-full"
    >
      <article
        onClick={handleClick}
        className={`relative overflow-hidden group transition-all flex flex-col justify-center mx-auto ${
          resource.website ? "cursor-pointer" : ""
        }`}
        style={{
          backgroundImage: "url('/scrollpostthicc.svg')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          aspectRatio: '999 / 738',
          maxWidth: '350px',
          minHeight: '258px'
        }}
      >
        {/* Main content area with more side padding to avoid scroll edges */}
        <div className="relative z-10 flex-1 px-8 pt-16 pb-0.5 flex flex-col justify-center">
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-base tracking-tight leading-tight text-black transition-colors group-hover:text-black/80 drop-shadow-lg line-clamp-2">
              {resource.title}
            </h3>
            {resource.website && (
              <ExternalLink className="h-3.5 w-3.5 text-black/60 flex-shrink-0 mt-0.5" />
            )}
          </div>

          {/* Divider */}
          <div className="mt-1 h-px bg-black/10 dark:bg-white/10" />

          {/* Description */}
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-black/80 drop-shadow">
            {resource.description}
          </p>

          {/* Divider */}
          <div className="mt-2 h-px bg-black/10 dark:bg-white/10" />

          {/* Contact Info */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-black/90 drop-shadow">
              <Phone className="h-3 w-3" />
              <span className="font-medium">{resource.contactInfo}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-black/80 drop-shadow">
              <Clock className="h-3 w-3" />
              <span>{resource.availability}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground shadow-sm backdrop-blur-sm dark:bg-accent dark:text-accent-foreground whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Category badge positioned in the lighter bottom area of the scroll */}
        <div className="relative z-10 px-8 pb-12 mt-auto">
          <div className="inline-block rounded-full bg-primary/90 px-3 py-1 text-[10px] font-medium text-primary-foreground shadow-sm">
            {resource.category}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
