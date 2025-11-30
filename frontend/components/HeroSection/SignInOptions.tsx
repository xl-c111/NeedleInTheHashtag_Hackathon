"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export function SignInOptions() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Primary CTA - Start a conversation */}
      <button
        className="h-12 tracking-tighter px-3 hover:scale-110 transition-transform duration-200 ease-in-out"
        onClick={() => router.push("/chat")}
      >
        <Image 
          src="/chatbtn.svg" 
          alt="Start a conversation" 
          width={150} 
          height={45} 
          className="h-10"
        />
      </button>

      {/* Secondary CTA - Read stories */}
      <button
        className="h-12 tracking-tighter px-3 hover:scale-110 transition-transform duration-200 ease-in-out"
        onClick={() => router.push("/stories")}
      >
        <Image 
          src="/storiesbtn.svg" 
          alt="Read stories from others" 
          width={150} 
          height={45} 
          className="h-10"
        />
      </button>
    </div>
  );
}
