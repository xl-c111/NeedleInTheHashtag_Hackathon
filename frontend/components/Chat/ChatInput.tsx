"use client";

import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-black/10 bg-white dark:border-white/10 dark:bg-black">
      <div className="mx-auto max-w-2xl px-4 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={disabled}
              rows={1}
              className="w-full resize-none rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-black/20 focus:outline-none disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/20"
              style={{ minHeight: "44px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "44px";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>

          <button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-black"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-black/40 dark:text-white/40">
          Village connects you with stories from people who understand. Not a
          substitute for professional help.
        </p>
      </div>
    </div>
  );
}
