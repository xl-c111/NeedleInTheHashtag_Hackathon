"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, Heart } from "lucide-react";

export function VillageHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      </div>

      {/* Subtle animated dots pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(94, 234, 212, 0.15) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Floating orbs for depth */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl"
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        {/* Badge */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="h-4 w-4 text-teal-400 fill-teal-400/30" />
          <span className="text-sm font-medium text-teal-300 tracking-tight">
            A safe space to talk
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 font-semibold text-4xl text-white leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          You're not alone
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-12 max-w-2xl text-lg text-slate-300 leading-relaxed tracking-tight sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Connect with real people who understand what you're going through.
          <span className="text-teal-300"> A village of support</span>, right on
          your screen.
        </motion.p>

        {/* CTAs */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            asChild
            className="h-12 px-8 text-base font-medium bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02]"
            size="lg"
          >
            <Link href="/village/chat">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start a conversation
            </Link>
          </Button>

          <Link
            className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-slate-300 transition-all duration-300 hover:text-teal-300"
            href="/village/stories"
          >
            <span className="tracking-tight">Read stories from others</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          animate={{ opacity: 1 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Anonymous
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            No sign-up required
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Always free
          </span>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
