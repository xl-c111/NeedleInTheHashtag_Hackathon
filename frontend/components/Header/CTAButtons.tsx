"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, PenLine, HeartHandshake } from "lucide-react";

export function CTAButtons() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      {/* Stories - Always visible (public access) */}
      <button
        className="h-12 tracking-tighter px-3 hover:scale-110 transition-transform duration-200 ease-in-out"
        onClick={() => router.push("/stories")}
      >
        <Image
          src="/storiesbtn.svg"
          alt="Read stories"
          width={150}
          height={45}
          className="h-10 w-auto"
        />
      </button>

      {/* Chat - Always visible (public access) */}
      <button
        className="h-12 tracking-tighter px-3 hover:scale-110 transition-transform duration-200 ease-in-out"
        onClick={() => router.push("/chat")}
      >
        <Image
          src="/chatbtn.svg"
          alt="Start talking"
          width={150}
          height={45}
          className="h-10 w-auto"
        />
      </button>

      {/* Resources - Always visible (public access) */}
      <button
        className="h-12 tracking-tighter px-3 hover:scale-110 transition-transform duration-200 ease-in-out flex items-center gap-2 text-sm font-medium text-foreground"
        onClick={() => router.push("/resources")}
        title="Professional Resources"
      >
        <HeartHandshake className="h-5 w-5" />
        <span>Resources</span>
      </button>

      {/* Authenticated routes - Only visible when logged in */}
      {user && (
        <>
          <Link
            href="/write"
            className="flex items-center rounded-lg px-3 py-1.5 transition-all hover:scale-110"
          >
            <img src="/storiesbtnfeather.svg" alt="write" className="h-11 w-auto" />
          </Link>
          <Link
            href="/diary"
            className="flex items-center rounded-lg px-3 py-1.5 transition-all hover:scale-110"
          >
            <img src="/diarybtn.svg" alt="diary" className="h-11 w-auto" />
          </Link>
        </>
      )}
    </>
  );
}
