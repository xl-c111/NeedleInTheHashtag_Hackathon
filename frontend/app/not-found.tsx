"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative mx-2 mt-1 mb-4 flex min-h-[calc(100vh-5.5rem)] w-full items-center justify-center overflow-hidden rounded-xl py-6 sm:mx-4 sm:py-2">
      {/* Large "404" text in background - vertical on right side */}
      <div
        className="-right-16 sm:-right-20 pointer-events-none absolute bottom-12 origin-bottom-right"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="select-none font-bold text-[12rem] text-black/[0.03] tracking-tighter sm:text-[14rem] md:text-[16rem] lg:text-[18rem] dark:text-white/[0.03]">
          404
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full px-4">
        {/* Centered content */}
        <div className="space-y-8 text-center">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center text-black/70 text-md tracking-tighter dark:text-white/70">
              Error 404 — Page Not Found
            </div>
          </div>

          <h1 className="font-semibold text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Oops! This page <br />
            doesn't{" "}
            <span className="text-red-500/85 dark:text-red-500/85">exist.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-black/60 tracking-tighter sm:text-lg md:text-xl dark:text-white/60">
            The page you're looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              asChild
              className="group relative h-9 overflow-hidden rounded-lg bg-black px-8 text-white tracking-tighter transition-all duration-300 hover:bg-black/90 sm:h-10 sm:px-4 dark:bg-white dark:text-black dark:hover:bg-white/90"
              size="lg"
            >
              <Link href="/">
                <span className="group-hover:-translate-y-full relative inline-block transition-transform duration-300 ease-in-out">
                  <span className="flex items-center gap-2 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </span>
                  <span className="absolute top-full left-0 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </span>
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-lg border-1 border-black/10 border-solid px-8 text-black tracking-tighter transition-all duration-300 hover:bg-black/5 sm:h-10 sm:px-4 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              size="lg"
              variant="ghost"
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
