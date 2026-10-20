"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Instagram } from "lucide-react";

export interface FooterLinkGroup {
  label: string;
  items: { label: string; href: string }[];
}

interface FooterProps {
  tagline?: string;
  linkGroups?: FooterLinkGroup[];
  whatsappHref?: string;
  instagramHref?: string;
  className?: string;
}

const defaultLinkGroups: FooterLinkGroup[] = [
  {
    label: "Quick Links",
    items: [
      { label: "Home", href: "/" },
      { label: "Buy Vehicle", href: "#buy-vehicle" },
      { label: "Sell Vehicle", href: "#sell-vehicle" },
      { label: "Our Collection", href: "#collection" },
      { label: "Exchange", href: "#exchange" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    label: "Vehicle Categories",
    items: [
      { label: "Cars", href: "#categories" },
      { label: "Bikes", href: "#categories" },
      { label: "SUVs", href: "#categories" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About Us", href: "#about" },
      { label: "Customer Reviews", href: "#reviews" },
      { label: "Instagram", href: "https://www.instagram.com/genuine_vehicles/" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
  {
    label: "Contact Information",
    items: [
      { label: "Phone Number", href: "tel:+1234567890" },
      { label: "Email Address", href: "mailto:contact@genuinevehicles.com" },
      { label: "Location", href: "#location" },
    ],
  },
];

export default function Footer({
  tagline = "Follow us on social media for the latest vehicle updates and arrivals..",
  linkGroups = defaultLinkGroups,
  whatsappHref = "#whatsapp",
  instagramHref = "https://www.instagram.com/genuine_vehicles/",
  className,
}: FooterProps) {
  return (
    <footer id="contact" className={cn("border-t border-border px-8 sm:px-10 py-16", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="group flex w-fit items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-[11px] font-black text-background transition-transform group-hover:scale-105">
                {siteConfig.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-bold tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="max-w-40 text-xs leading-relaxed text-muted-foreground">{tagline}</p>
            <div className="flex gap-2">
              <Link href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground">
                <Icons.whatsapp className="size-3.5" />
              </Link>
              <Link href={instagramHref} target="_blank" rel="noopener noreferrer" className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground">
                <Instagram className="size-3.5" />
              </Link>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{group.label}</p>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground font-medium">
            © 2026 Genuine Vehicles. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
