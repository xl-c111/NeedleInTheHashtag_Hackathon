"use client";

import { motion } from "motion/react";

export function FeatureHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12 text-center"
    >
      <div className="mb-3 flex justify-center">
        <img src="/journeytext.svg" alt="going on your journey?" className="h-20 w-auto sm:h-16 lg:h-28" />
      </div>
      <p className="mx-auto max-w-2xl text-black/60 text-sm leading-relaxed tracking-tight sm:text-base dark:text-white/60">
        been there. talk to our friendly owl, and get matched with a mentor with a story similar to yours.
      </p>
    </motion.div>
  );
}
