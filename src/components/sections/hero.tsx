"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ColumnLines } from "@/components/ui/column-lines";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Typeanimation from "@/components/ui/typeanimation";

interface HeroProps {
  headline?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export default function Hero({
  headline = "Genuine Vehicles",
  description = "Buy your dream car or bike with confidence at unbeatable prices.",
  primaryCtaText = "Browse Collection",
  primaryCtaHref = "/collection",
  secondaryCtaText = "Sell Your Vehicle",
  secondaryCtaHref = "#sell-vehicle",
  className,
}: HeroProps) {
  return (
    <ColumnLines
      id="hero"
      columnWidth={80}
      columnCount={16}
      radialFadeStart={25}
      radialFadeEnd={65}
      noiseOpacity={0.04}
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center px-8 sm:px-10",
        className
      )}
    >
      <div className="mx-auto pt-16 flex max-w-3xl flex-col items-center gap-7 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl flex flex-col items-center gap-2"
        >
          <div>{headline}</div>
          <Typeanimation
            words={["Cars", "Bikes", "SUVs", "Premium Vehicles"]}
            typingSpeed="slow"
            deletingSpeed="slow"
            gradientFrom="red-500"
            gradientTo="yellow-500"
            pauseDuration={2000}
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-120 text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center w-full"
        >
          <ShinyButton href={primaryCtaHref} className="gap-2 px-7 py-3 text-sm">
            {primaryCtaText} <ArrowRight className="size-4" />
          </ShinyButton>
        </motion.div>
      </div>
    </ColumnLines>
  );
}
