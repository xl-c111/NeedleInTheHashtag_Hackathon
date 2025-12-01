"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-black/80">
      <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4">
        <Link
          href="/"
          className="rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5 text-black/60 dark:text-white/60" />
        </Link>

        <div className="flex-1">
          <h1 className="font-medium text-base tracking-tight text-black dark:text-white">
            been there
          </h1>
          <p className="text-xs text-black/50 dark:text-white/50">
            share what's on your mind
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
          <Image 
            src="/owlaitransparent.svg" 
            alt="AI Assistant" 
            width={28} 
            height={28} 
            className="h-7 w-7"
          />
        </div>
      </div>
    </header>
  );
}
