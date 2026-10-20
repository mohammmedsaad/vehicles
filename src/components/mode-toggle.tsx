'use client';

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
        className
      )}
    >
      <SunIcon className="absolute size-3.5 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}