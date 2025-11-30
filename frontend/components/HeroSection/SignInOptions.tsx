"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export function SignInOptions() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Primary CTA - Start a conversation */}
      <button
        className="h-20 tracking-tighter px-6 hover:scale-110 transition-transform duration-200 ease-in-out"
        onClick={() => router.push("/chat")}
      >
        <Image 
          src="/chatbtn.svg" 
          alt="Start a conversation" 
          width={280} 
          height={80} 
          className="h-18"
        />
      </button>

      {/* Secondary CTA - Read stories */}
      <button
        className="h-20 tracking-tighter px-6 hover:scale-110 transition-transform duration-200 ease-in-out"
        onClick={() => router.push("/stories")}
      >
        <Image 
          src="/storiesbtn.svg" 
          alt="Read stories from others" 
          width={280} 
          height={80} 
          className="h-18"
        />
      </button>
    </div>
  );
}
