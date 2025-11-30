"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function CTAButtons() {
  const router = useRouter();

  return (
    <>
      <Button
        className="h-9 tracking-tighter"
        onClick={() => router.push("#")}
        size="sm"
        variant="outline"
      >
        Read stories
      </Button>
      <Button
        className="h-9 tracking-tighter"
        onClick={() => router.push("#")}
        size="sm"
      >
        <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
        Start talking
      </Button>
    </>
  );
}
