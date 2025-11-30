"use client";

import { useEffect, useState } from "react";

export function HeroImage() {
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
    <div className="relative h-[300px] w-full sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-black/10 bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-2xl sm:rounded-2xl dark:border-white/10 dark:from-neutral-900 dark:to-neutral-800">
        {/* Video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full">
            {prefersReducedMotion ? (
              <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900" />
            ) : (
              <video
                autoPlay
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Background video showing community connection"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
