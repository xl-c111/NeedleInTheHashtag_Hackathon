"use client";

import { useRouter } from "next/navigation";
import { HeartHandshake } from "lucide-react";

export function ResourceButton() {
  const router = useRouter();

  return (
    <button
      className="h-12 tracking-tighter px-3 hover:scale-110 transition-transform duration-200 ease-in-out flex items-center gap-2 text-sm font-medium text-foreground"
      onClick={() => router.push("/resources")}
      title="Professional Resources"
    >
      <HeartHandshake className="h-5 w-5" />
      <span>Resources</span>
    </button>
  );
}
