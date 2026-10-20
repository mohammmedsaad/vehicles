"use client";

import * as React from "react";
import { FadeIn } from "@/components/fade-in";
import { CheckCircle2, ShieldCheck, Banknote, Repeat, FileText, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reason {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
}

const reasons: Reason[] = [
  {
    title: "Verified Vehicles",
    description: "Every vehicle is thoroughly inspected before listing. Quality and condition are guaranteed.",
    icon: ShieldCheck,
    iconColor: "text-emerald-500",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden costs or surprise charges. What you see is exactly what you pay.",
    icon: Banknote,
    iconColor: "text-yellow-500",
  },
  {
    title: "Vehicle Exchange",
    description: "Upgrade your current vehicle easily with our seamless exchange process and best valuations.",
    icon: Repeat,
    iconColor: "text-violet-500",
  },
  {
    title: "RC Transfer Assistance",
    description: "Complete documentation support from start to finish, ensuring a hassle-free ownership transfer.",
    icon: FileText,
    iconColor: "text-blue-500",
  },
  {
    title: "Trusted Dealer",
    description: "Thousands of happy customers and years of experience building trust in the automotive community.",
    icon: ThumbsUp,
    iconColor: "text-orange-500",
  },
  {
    title: "Quality Assurance",
    description: "Only genuine and verified vehicles make it to our showroom, ensuring peace of mind.",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
];

export default function WhyChooseUs({ className }: { className?: string }) {
  return (
    <section id="why-choose-us" className={cn("border-t border-border py-8 sm:py-20 px-8 sm:px-10", className)}>
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="mb-4 sm:mb-12 text-xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-center sm:text-left">
            Why Choose Genuine Vehicles
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:auto-rows-fr">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <FadeIn key={reason.title} delay={i * 0.04}>
                <div className="group flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-sm">
                  <div className="mb-2 sm:mb-4 flex size-8 sm:size-12 items-center justify-center rounded-lg sm:rounded-xl border border-border bg-muted/50 transition-colors group-hover:bg-muted shrink-0">
                    <Icon className={cn("size-4 sm:size-6", reason.iconColor)} />
                  </div>
                  <h3 className="mb-1 text-sm sm:text-lg font-bold tracking-tight text-foreground">{reason.title}</h3>
                  <p className="text-xs sm:text-sm leading-snug sm:leading-relaxed text-muted-foreground">{reason.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
