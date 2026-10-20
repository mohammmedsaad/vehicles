"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlowingBorderCardProps {
  children: React.ReactNode;
  className?: string;
  fromColor?: string;
  toColor?: string;
}

export default function GlowingBorderCard({
  children,
  className,
  fromColor = "from-emerald-500",
  toColor = "to-emerald-700",
}: GlowingBorderCardProps) {
  return (
    <div className={cn("relative group rounded-2xl p-[2px] transition-all", className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 bg-gradient-to-br",
          fromColor, toColor
        )}
      />
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
          fromColor, toColor
        )}
      />
      <div className="relative h-full w-full rounded-xl overflow-hidden bg-card border border-border group-hover:border-transparent transition-colors duration-500">
        {children}
      </div>
    </div>
  );
}
