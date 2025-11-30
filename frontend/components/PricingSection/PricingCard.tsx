"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { PricingTier } from "./PricingData";

type PricingCardProps = {
  tier: PricingTier;
  index: number;
};

const ANIMATION_DELAY_MULTIPLIER = 0.15;
const ANIMATION_DURATION = 0.5;
const FEATURE_DELAY_MULTIPLIER = 0.05;

const colorClasses = {
  blue: {
    border: "border-blue-500/20 dark:border-blue-400/20",
  },
  purple: {
    border: "border-purple-500/20 dark:border-purple-400/20",
  },
  pink: {
    border: "border-pink-500/20 dark:border-pink-400/20",
  },
};

export function PricingCard({ tier, index }: PricingCardProps) {
  const colors = colorClasses[tier.color as keyof typeof colorClasses];

  return (
    <motion.div
      className={`group relative flex flex-col rounded-2xl border bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 dark:bg-black/50 dark:hover:bg-black/80 ${colors.border}`}
      initial={{ opacity: 0, y: 30 }}
      transition={{
        delay: index * ANIMATION_DELAY_MULTIPLIER,
        duration: ANIMATION_DURATION,
      }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Title */}
      <h3 className="mb-2 font-semibold text-2xl text-black tracking-tighter dark:text-white">
        {tier.name}
      </h3>

      {/* Subtitle */}
      <p className="mb-6 text-black/60 text-sm leading-relaxed tracking-tighter dark:text-white/60">
        {tier.subtitle}
      </p>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          {tier.price === 0 ? (
            <span className="font-bold text-5xl text-black tracking-tighter dark:text-white">
              Free
            </span>
          ) : (
            <>
              <span className="font-bold text-5xl text-black tracking-tighter dark:text-white">
                ${tier.price}
              </span>
              <span className="text-base text-black/60 tracking-tighter dark:text-white/60">
                /month
              </span>
            </>
          )}
        </div>
      </div>

      {/* CTA */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          className="group/btn relative mb-6 h-9 w-full overflow-hidden rounded-lg bg-black tracking-tighter shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-white"
          size="sm"
          variant="default"
        >
          <span className="relative z-10 text-white transition-colors duration-300 dark:text-black">
            {tier.ctaText}
          </span>
          <div className="-z-0 absolute inset-0 bg-gradient-to-r from-black/0 via-white/10 to-black/0 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100 dark:from-white/0 dark:via-black/10 dark:to-white/0" />
        </Button>
      </motion.div>

      {/* Features */}
      <div className="space-y-2.5">
        {tier.features.map((feature, idx) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            key={feature}
            transition={{
              delay:
                index * ANIMATION_DELAY_MULTIPLIER +
                idx * FEATURE_DELAY_MULTIPLIER,
            }}
          >
            <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
              <Check className="h-2.5 w-2.5 text-black dark:text-white" />
            </div>
            <span className="text-black/70 text-sm leading-tight tracking-tighter dark:text-white/70">
              {feature}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
