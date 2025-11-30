"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function CTAButtons() {
  const router = useRouter();

  return (
    <>
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
