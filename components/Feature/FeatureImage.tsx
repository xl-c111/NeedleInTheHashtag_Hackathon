"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { MediaType } from "./FeatureData";

type FeatureImageProps = {
  src: string;
  alt: string;
  mediaType: MediaType;
};

export function FeatureImage({ src, alt, mediaType }: FeatureImageProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-2xl dark:border-white/10 dark:from-neutral-900 dark:to-neutral-800">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0"
          key={src}
        >
          <div className="relative h-full w-full">
            {mediaType === "video" ? (
              prefersReducedMotion ? (
                <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900" />
              ) : (
                <video
                  autoPlay
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 75%" }}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={alt}
                >
                  <source src={src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <Image
                alt={alt}
                className="object-cover"
                style={{ objectPosition: "center 75%" }}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={src}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      {/* Floating elements - only show if motion is OK */}
      {!prefersReducedMotion && (
        <>
          <div className="absolute top-8 right-8 h-20 w-20 animate-pulse rounded-full bg-blue-500/20 blur-2xl" />
          <div className="animation-delay-1000 absolute bottom-12 left-12 h-32 w-32 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
        </>
      )}
    </div>
  );
}
