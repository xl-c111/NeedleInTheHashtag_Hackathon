"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { FAQ } from "./FAQData";

interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
}

export function FAQItem({ faq, isExpanded, onToggle }: FAQItemProps) {
  return (
    <motion.div
      className="group relative border-neutral-200 border-t dark:border-neutral-800"
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Collapsed State - Clickable Row */}
      <button
        aria-label={isExpanded ? "Show less" : "Show more"}
        className="relative flex w-full items-center justify-between py-4"
        onClick={onToggle}
        type="button"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-neutral-400 text-xs transition-colors duration-200 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-400">
            ({faq.id})
          </span>
          <h3 className="text-left font-medium text-sm tracking-tight transition-colors duration-200 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
            {faq.title}
          </h3>
        </div>
        <div className="flex h-6 w-6 shrink-0 items-center justify-center">
          {isExpanded ? (
            <Minus className="h-4 w-4 text-neutral-400 transition-colors duration-200 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-400" />
          ) : (
            <Plus className="h-4 w-4 text-neutral-400 transition-colors duration-200 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-400" />
          )}
        </div>
      </button>

      {/* Expanded State */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="relative overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-4 pl-8">
              <motion.p
                animate={{ opacity: 1 }}
                className="text-neutral-600 text-sm leading-relaxed tracking-tight dark:text-neutral-400"
                initial={{ opacity: 0 }}
                transition={{
                  delay: 0.1,
                }}
              >
                {faq.description}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
