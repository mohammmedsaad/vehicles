"use client";

import Link from "next/link";
import { navLinks } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  signInHref?: string;
  className?: string;
}

export default function Navbar({
  signInHref = "#whatsapp",
  className,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    
    // If Home link or hero target is clicked while on the homepage
    if (href === "/" || href === "/#hero" || href === "#hero") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    // Handle internal page anchor links (e.g. #testimonials, #why-choose-us)
    const anchor = href.includes("#") ? href.split("#")[1] : null;
    if (anchor && pathname === "/") {
      const elem = document.getElementById(anchor);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent",
        className
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/#hero"
          onClick={(e) => handleNavClick(e, "/#hero")}
          className="group flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-[11px] font-black text-background transition-transform group-hover:scale-105">
            {siteConfig.name.charAt(0).toUpperCase()}
          </span>
          <span className="text-xs font-bold tracking-tight sm:text-sm whitespace-nowrap">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center md:flex md:gap-0.5 lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              {...(link as any).target ? { target: (link as any).target } : {}}
              className="whitespace-nowrap rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:px-3 lg:py-1.5 lg:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ModeToggle />
          <Link
            href={signInHref}
            className="hidden whitespace-nowrap rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground sm:inline-flex lg:px-3.5 lg:text-sm"
          >
            WhatsApp Us
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              {...(link as any).target ? { target: (link as any).target } : {}}
              className="flex items-center rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            <Link
              href={signInHref}
              className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-medium"
            >
              WhatsApp Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
