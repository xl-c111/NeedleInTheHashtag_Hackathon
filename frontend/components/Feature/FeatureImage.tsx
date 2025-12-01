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
                className="h-full w-full group"
                style={{
                  backgroundImage: "url('/owlwrite.svg')",
                  backgroundSize: '90%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <style jsx>{`
                  @keyframes writing {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(-2deg); }
                    50% { transform: rotate(2deg); }
                    75% { transform: rotate(-1deg); }
                    100% { transform: rotate(0deg); }
                  }
                  .group:hover {
                    animation: writing 1.5s ease-in-out infinite;
                    transform-origin: center;
                  }
                `}</style>
              </div>
            ) : (
              <Image
                alt={alt}
                className="object-cover"
                style={{ objectPosition: "center 95%" }}
                fill
                sizes="(max-width: 1000px) 100vw, 50vw"
                src={src}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
