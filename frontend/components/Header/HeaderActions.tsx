import ThemeToggle from "@/lib/theme-toggle";
import { CTAButtons } from "./CTAButtons";
import { ResourceButton } from "./ResourceButton";
import { UserButton } from "@/components/Auth";

export function HeaderActions() {
  return (
    <>
      {/* Groups 2 & 3: Stories, Chat, Write*, Diary* with conditional dividers */}
      <CTAButtons />

      {/* Group 1: Resources */}
      <ResourceButton />
      <div className="mx-3 h-4 w-px bg-black/10 dark:bg-white/10" />

      {/* Group 4: Theme toggle & Profile */}
      <ThemeToggle />
      <UserButton />
    </>
  );
}
