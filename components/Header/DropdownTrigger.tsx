"use client";

import { ChevronDown } from "lucide-react";

interface DropdownTriggerProps {
  name: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function DropdownTrigger({
  name,
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: DropdownTriggerProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] text-black tracking-tighter transition-all duration-200 hover:bg-black/10 dark:text-white dark:hover:bg-white/10"
        type="button"
      >
        {name}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
