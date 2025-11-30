"use client";

import { motion } from "motion/react";
import { MessageCircle, Users, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    icon: MessageCircle,
    title: "Share what's on your mind",
    description: "Talk to an AI companion who listens without judgement",
    color: "teal",
  },
  {
    icon: Users,
    title: "Connect with real experiences",
    description: "Read stories from people who've walked your path",
    color: "amber",
  },
  {
    icon: Compass,
    title: "Find your way forward",
    description: "Save what resonates, build your own journey",
    color: "teal",
  },
];

export function HowItWorks() {
  return (
    <section className="relative bg-slate-950 py-24 sm:py-32">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-4 font-semibold text-2xl text-white tracking-tight sm:text-3xl md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto max-w-lg text-slate-400 tracking-tight">
            Three simple steps to feeling less alone
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">
          {/* Connection lines (desktop only) */}
          <div className="absolute top-12 left-1/3 right-1/3 hidden h-px bg-gradient-to-r from-teal-500/50 via-slate-700 to-teal-500/50 sm:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              animate={{ opacity: 1, y: 0 }}
              className="group relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {/* Step number badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-800">
                {index + 1}
              </div>

              {/* Icon container */}
              <div
                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 ${
                  step.color === "amber"
                    ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/20 group-hover:ring-amber-500/40 group-hover:shadow-lg group-hover:shadow-amber-500/10"
                    : "bg-gradient-to-br from-teal-500/20 to-teal-600/10 ring-1 ring-teal-500/20 group-hover:ring-teal-500/40 group-hover:shadow-lg group-hover:shadow-teal-500/10"
                }`}
              >
                <step.icon
                  className={`h-8 w-8 transition-all duration-300 ${
                    step.color === "amber"
                      ? "text-amber-400 group-hover:text-amber-300"
                      : "text-teal-400 group-hover:text-teal-300"
                  }`}
                />
              </div>

              {/* Content */}
              <h3 className="mb-3 font-medium text-lg text-white tracking-tight">
                {step.title}
              </h3>
              <p className="max-w-xs text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
