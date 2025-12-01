"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import CircleTheme from "@/components/icons/circle-theme";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      className="h-8 cursor-pointer rounded-lg px-2 py-1 text-black tracking-tighter transition-colors hover:bg-black/15 sm:h-8 dark:text-white dark:hover:bg-white/15"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      variant="ghost"
    >
      {theme === "light" ? (
        <img src="/moonicon.svg" alt="Switch to dark mode" className="h-5 w-5" />
      ) : (
        <img src="/sunicon.svg" alt="Switch to light mode" className="h-5 w-5" />
      )}
    </Button>
  );
}
