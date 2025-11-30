"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start items-end"}`}
    >
      {/* AI Avatar - only show for assistant messages */}
      {!isUser && (
        <div className="flex h-24 w-24 items-center justify-center mb-1 flex-shrink-0">
          <motion.div
            animate={isHovered ? { 
              y: [-2, -8, -2],
              transition: {
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            } : { y: 0 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="cursor-pointer"
          >
            <Image 
              src={isHovered ? "/owlhappyai.svg" : "/owlaitransparent.svg"}
              alt="AI Assistant" 
              width={96} 
              height={96} 
              className="h-24 w-24"
            />
          </motion.div>
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-md bg-black text-white dark:bg-white dark:text-black"
            : "rounded-bl-md border border-black/10 bg-black/5 text-black dark:border-white/10 dark:bg-white/5 dark:text-white"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
