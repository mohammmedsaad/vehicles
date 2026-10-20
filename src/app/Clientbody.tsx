"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/sections/navbar";
import ScrollToTop from "@/components/scrolltotop";

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={0}>
        <Navbar />
        <div className="pt-14">
          {children}
        </div>
        <ScrollToTop />
      </TooltipProvider>
    </ThemeProvider>
  );
}
