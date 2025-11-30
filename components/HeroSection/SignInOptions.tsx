"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen } from "lucide-react";

export function SignInOptions() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Primary CTA - Start a conversation */}
      <Button
        className="h-10 tracking-tighter"
        onClick={() => router.push("/village/chat")}
        size="lg"
      >
        <MessageCircle className="h-4 w-4" />
        Start a conversation
      </Button>

      {/* Secondary CTA - Read stories */}
      <Button
        className="h-10 tracking-tighter"
        onClick={() => router.push("/village/stories")}
        size="lg"
        variant="outline"
      >
        <BookOpen className="h-4 w-4" />
        Read stories from others
      </Button>
    </div>
  );
}
