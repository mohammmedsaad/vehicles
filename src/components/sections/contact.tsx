"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail, Phone, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeparatorPro } from "@/components/ui/seperatorpro";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "contact@genuinevehicles.com",
    href: "mailto:contact@genuinevehicles.com",
  },
  { icon: Phone, label: "+91 7036516585", href: "tel:+18003214321" },
  {
    icon: Headphones,
    label: "support@genuinevehicles.com",
    href: "mailto:support@genuinevehicles.com",
  },
];

interface ContactWithGlobeProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export default function ContactWithGlobe({
  title = "Contact us",
  subtitle = "Contact",
  description = "We are always looking for ways to improve our services and help you find the perfect vehicle. Contact us and let us know how we can help you.",
  className,
}: ContactWithGlobeProps) {
  return (
    <section
      id="contact-section"
      className={cn(
        "relative w-full bg-background overflow-hidden py-8 sm:py-20 border-t border-border px-8 sm:px-10",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center gap-1 sm:gap-2 mb-5 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30"
          >
            <span className="text-xs sm:text-sm text-emerald-500 font-medium">
              {subtitle}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="text-xs sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xs sm:max-w-md leading-relaxed"
          >
            {description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-3 sm:gap-4 h-full justify-center"
          >
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <h3 className="text-base sm:text-xl font-semibold text-zinc-900 dark:text-white">
                Get in touch
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                Reach out via any channel below. We typically reply within one business day.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              {CONTACT_LINKS.map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.1,
                    ease: smoothEase,
                  }}
                  className="group flex items-center gap-2.5 sm:gap-3 w-fit text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 group-hover:border-emerald-300 dark:group-hover:border-emerald-500/40 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 flex items-center justify-center shrink-0 transition-all duration-200">
                    <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-200" />
                  </div>
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 sm:p-6 flex flex-col gap-2.5 sm:gap-3"
          >
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white mb-0.5">
                Send a message
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Fill out the form and we'll get back to you promptly.
              </p>
            </div>

            <SeparatorPro variant="dots" className="my-0.5 sm:my-1" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <div className="flex flex-col gap-1 sm:gap-2">
                <label className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-zinc-600 dark:text-zinc-400">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Ahdeetai"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-emerald-400 dark:focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
                />
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <label className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-zinc-600 dark:text-zinc-400">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-emerald-400 dark:focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-zinc-600 dark:text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                placeholder="support@genuinevehicles.com"
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-emerald-400 dark:focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-zinc-600 dark:text-zinc-400">
                Message
              </label>
              <textarea
                placeholder="Type your message here"
                rows={2}
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-emerald-400 dark:focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 resize-none transition-all duration-200"
              />
            </div>

            <Button className="w-fit h-9 sm:h-11 px-5 sm:px-8 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors">
              Submit
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
