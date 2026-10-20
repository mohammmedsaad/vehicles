"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const GRADIENT_MAP: Record<string, string> = {
  "red-500:yellow-500": "bg-gradient-to-r from-red-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent",
  "emerald-500:teal-400": "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent",
  "purple-500:pink-500": "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent",
  "blue-500:cyan-400": "bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent",
};

interface TypeanimationProps {
  words: string[];
  typingSpeed?: "slow" | "fast" | number;
  deletingSpeed?: "slow" | "fast" | number;
  gradientFrom?: string;
  gradientTo?: string;
  pauseDuration?: number;
  className?: string;
}

export default function Typeanimation({
  words,
  typingSpeed = "slow",
  deletingSpeed = "fast",
  gradientFrom = "emerald-500",
  gradientTo = "teal-400",
  pauseDuration = 2000,
  className,
}: TypeanimationProps) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const getSpeed = (speed: "slow" | "fast" | number) => {
    if (typeof speed === "number") return speed;
    return speed === "slow" ? 140 : 50;
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex % words.length];

    if (isDeleting) {
      if (text === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        timeout = setTimeout(() => {}, 400);
      } else {
        timeout = setTimeout(() => {
          setText((t) => t.slice(0, -1));
        }, getSpeed(deletingSpeed));
      }
    } else {
      if (text === currentWord) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, getSpeed(typingSpeed));
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  const key = `${gradientFrom}:${gradientTo}`;
  const gradientClass = GRADIENT_MAP[key] || "text-emerald-500 dark:text-emerald-400";

  return (
    <span className={cn("inline-block font-extrabold tracking-tight", gradientClass, className)}>
      {text || "\u00A0"}
      <span className="animate-pulse border-r-2 border-emerald-500 dark:border-emerald-400 ml-0.5" style={{ opacity: 1 }}>
        &nbsp;
      </span>
    </span>
  );
}
