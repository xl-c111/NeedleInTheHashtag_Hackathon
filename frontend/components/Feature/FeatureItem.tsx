"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Feature } from "./FeatureData";

type FeatureItemProps = {
  feature: Feature;
  isActive: boolean;
  onToggle: () => void;
};

const iconColorClasses = {
  blue: "text-blue-500 dark:text-blue-400",
  purple: "text-purple-500 dark:text-purple-400",
  pink: "text-pink-500 dark:text-pink-400",
};

export function FeatureItem({ feature, isActive, onToggle }: FeatureItemProps) {
  return (
    <motion.div
      className="group border-neutral-200 border-b dark:border-neutral-800"
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <button
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={onToggle}
        type="button"
      >
        <div className="flex items-center gap-4">
          {typeof feature.icon === 'string' ? (
            <img 
              src={feature.icon} 
              alt=""
              className={`h-20 w-20 transition-all duration-200 ${
                isActive
                  ? iconColorClasses[
                      feature.color as keyof typeof iconColorClasses
                    ]
                  : "opacity-30"
              }`}
            />
          ) : (
            <feature.icon
              className={`h-8 w-8 transition-all duration-200 ${
                isActive
                  ? iconColorClasses[
                      feature.color as keyof typeof iconColorClasses
                    ]
                  : "text-black/30 dark:text-white/30"
              }`}
            />
          )}
          <span
            className={`font-semibold text-xl tracking-tight transition-colors duration-200 sm:text-2xl ${
              isActive
                ? "text-black dark:text-white"
                : "text-black/60 group-hover:text-black dark:text-white/60 dark:group-hover:text-white"
            }`}
          >
            {feature.title}
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-black/40 transition-all duration-200 group-hover:text-black/60 dark:text-white/40 dark:group-hover:text-white/60 ${
            isActive ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="relative overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            key={feature.id}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-6 pl-10">
              <motion.p
                animate={{ opacity: 1 }}
                className="text-base text-black/60 leading-relaxed tracking-tight dark:text-white/60"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                {feature.description}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
