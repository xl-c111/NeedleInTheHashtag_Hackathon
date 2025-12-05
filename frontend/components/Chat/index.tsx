"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { MatchedStories } from "./MatchedStories";
import { ChatHistory, saveChatSession } from "./ChatHistory";
import { sendChatMessage, matchStories, type MatchedStory } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

const INITIAL_MESSAGE: ChatMessage = {
  id: "initial",
  role: "assistant",
  content:
    "Hi, I'm here to listen. What's been on your mind lately? There's no pressure to share anything specific – just whatever feels right.",
  timestamp: new Date(),
};

export default function ChatInterface() {
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [matchedStories, setMatchedStories] = useState<MatchedStory[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, matchedStories]);

  // Auto-save chat session when messages or matched stories change
  useEffect(() => {
    if (messages.length > 1) {
      saveChatSession(sessionId, messages, matchedStories);
    }
  }, [sessionId, messages, matchedStories]);

  const handleLoadSession = (session: { messages: ChatMessage[]; matchedStories?: MatchedStory[] }) => {
    setMessages(session.messages);
    setMatchedStories(session.matchedStories || []);
    setShowMatches(!!(session.matchedStories && session.matchedStories.length > 0));
  };

  const handleNewChat = () => {
    // Save current session before starting new one
    if (messages.length > 1) {
      saveChatSession(sessionId, messages, matchedStories);
    }

    // Reset to new session
    window.location.reload(); // Reload to get new session ID
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get conversation history for backend (exclude the current message we just added)
      // The current message is sent separately in the 'message' parameter
      const conversationHistory = messages
        .filter((m) => m.id !== "initial") // Exclude initial greeting
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      // Call backend chat API
      const result = await sendChatMessage(
        userMessage.content,
        conversationHistory
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // After 2-3 user messages, fetch matched stories
      // Include the current user message that was just sent
      const allUserMessages = [...messages.filter((m) => m.role === "user"), userMessage];
      if (allUserMessages.length >= 2 && !showMatches) {
        try {
          // Combine recent user messages for better matching
          const recentUserText = allUserMessages
            .slice(-3)
            .map((m) => m.content)
            .join(" ");

          const response = await matchStories(recentUserText, 3, 0.3);
          if (response.matches.length > 0) {
            setMatchedStories(response.matches);
            setShowMatches(true);
          }
        } catch (matchError) {
          console.error("Error matching stories:", matchError);
          // Don't show error to user, just skip showing matches
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Could you try again in a moment?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <ChatHeader />

      {/* Chat History Sidebar */}
      <ChatHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadSession={handleLoadSession}
      />

      {/* History and New Chat Buttons */}
      <div className="border-b border-border bg-background px-4 py-2">
        <div className="mx-auto flex max-w-2xl gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-secondary-foreground text-sm transition-colors hover:bg-secondary/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v5h5" />
              <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
              <path d="M12 7v5l4 2" />
            </svg>
            History
          </button>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm transition-opacity hover:opacity-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            New Chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="mx-auto max-w-2xl px-4 py-6 flex-1 flex flex-col justify-end">
          <MessageList messages={messages} />

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showMatches && matchedStories.length > 0 && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6"
              >
                <MatchedStories
                  stories={matchedStories}
                  onClose={() => setShowMatches(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* TODO: Add "Save to Diary" button to summarize chat conversation and save as diary entry */}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isTyping}
      />
    </div>
  );
}
