"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, PenLine } from "lucide-react";

export function CTAButtons() {
  const router = useRouter();

  return (
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
      <button
        className="h-12 tracking-tighter px-3 hover:scale-110 transition-transform duration-200 ease-in-out"
        onClick={() => router.push("/stories")}
      >
        <Image
          src="/storiesbtn.svg"
          alt="Read stories"
          width={150}
          height={45}
          className="h-10"
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
          className="h-10"
        />
      </button>
    </>
  );
}
