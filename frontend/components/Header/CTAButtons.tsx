"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/Auth/AuthProvider";

export function CTAButtons() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      {/* Group 2 - Stories & Chat - Always visible (public access) */}
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

      {/* Divider after Group 2 */}
      <div className="mx-3 h-4 w-px bg-black/10 dark:bg-white/10" />

      {/* Group 3 - Write & Diary - Authenticated routes only */}
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

          {/* Divider after Group 3 (only when authenticated) */}
          <div className="mx-3 h-4 w-px bg-black/10 dark:bg-white/10" />
        </>
      )}
    </>
  );
}
