"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type { MediaType } from "./FeatureData";

type FeatureImageProps = {
  src: string;
  alt: string;
  mediaType: MediaType;
};

export function FeatureImage({ src, alt, mediaType }: FeatureImageProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0"
          key={src}
        >
          <div className="relative h-full w-full">
            {mediaType === "video" ? (
              <div 
                className="h-full w-full"
                style={{
                  backgroundImage: "url('/rolledscroll.svg')",
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
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
    </div>
  );
}
