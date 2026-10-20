"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function LogoCloud({ className }: { className?: string }) {
  return (
    <section className={cn("py-24 border-t border-border bg-background", className)}>
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8"
        >
          Trusted by top automotive brands
        </motion.p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="text-xl font-bold font-serif">Hyundai</div>
          <div className="text-xl font-bold font-serif">Honda</div>
          <div className="text-xl font-bold font-serif">Tata Motors</div>
          <div className="text-xl font-bold font-serif">Mahindra</div>
          <div className="text-xl font-bold font-serif">Kia</div>
        </div>
      </div>
    </section>
  );
}
