"use client";

import { motion, AnimatePresence } from "motion/react";
import type { ChatMessage } from "@/lib/types";
import type { MatchedStory } from "@/lib/api";

interface ChatSession {
  id: string;
  timestamp: Date;
  messages: ChatMessage[];
  preview: string;
  matchedStories?: MatchedStory[];
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (session: ChatSession) => void;
}

export function ChatHistory({ isOpen, onClose, onLoadSession }: ChatHistoryProps) {
  const sessions = loadChatSessions();

  const handleLoadSession = (session: ChatSession) => {
    onLoadSession(session);
    onClose();
  };

  const handleDeleteSession = (sessionId: string) => {
    const sessions = loadChatSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem("chat_sessions", JSON.stringify(filtered));
    // Force re-render by updating the component
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-screen w-80 border-r border-border bg-background shadow-lg"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="font-semibold text-lg">Chat History</h2>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Close chat history"
                >
                  ✕
                </button>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto p-4">
                {sessions.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground text-sm">
                      No chat history yet.
                    </p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Start a conversation and it will be saved here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <p className="line-clamp-2 text-card-foreground text-sm">
                              {session.preview}
                            </p>
                            <p className="mt-1 text-muted-foreground text-xs">
                              {new Date(session.timestamp).toLocaleDateString()}{" "}
                              {new Date(session.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLoadSession(session)}
                            className="flex-1 rounded bg-primary px-2 py-1 text-primary-foreground text-xs transition-opacity hover:opacity-90"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="rounded bg-destructive px-2 py-1 text-destructive-foreground text-xs transition-opacity hover:opacity-90"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4">
                <button
                  onClick={() => {
                    if (confirm("Clear all chat history?")) {
                      localStorage.removeItem("chat_sessions");
                      window.location.reload();
                    }
                  }}
                  className="w-full rounded bg-muted px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Clear All History
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper functions for localStorage management
export function saveChatSession(
  sessionId: string,
  messages: ChatMessage[],
  matchedStories: MatchedStory[] = []
) {
  if (messages.length <= 1) return; // Don't save if only initial message

  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return; // Don't save if no user messages

  const sessions = loadChatSessions();
  const preview = userMessages[0].content.substring(0, 100);

  // Check if session already exists (update instead of creating new)
  const existingIndex = sessions.findIndex((s) => s.id === sessionId);

  const sessionData: ChatSession = {
    id: sessionId,
    timestamp: existingIndex >= 0 ? sessions[existingIndex].timestamp : new Date(),
    messages: messages.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp), // Ensure timestamp is Date object
    })),
    preview,
    matchedStories,
  };

  let updatedSessions: ChatSession[];
  if (existingIndex >= 0) {
    // Update existing session
    updatedSessions = [...sessions];
    updatedSessions[existingIndex] = sessionData;
  } else {
    // Add new session at the beginning
    updatedSessions = [sessionData, ...sessions].slice(0, 20);
  }

  localStorage.setItem("chat_sessions", JSON.stringify(updatedSessions));
}

export function loadChatSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("chat_sessions");
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((session: any) => ({
      ...session,
      timestamp: new Date(session.timestamp),
      messages: session.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    }));
  } catch (error) {
    console.error("Error loading chat sessions:", error);
    return [];
  }
}
