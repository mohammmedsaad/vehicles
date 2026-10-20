"use client";

import { FadeIn } from "@/components/fade-in";
import { KineticTestimonials, type Testimonial } from "@/components/ui/kinetic-testimonials";
import { cn } from "@/lib/utils";

interface TestimonialsProps {
  heading?: string;
  rows?: Testimonial[][];
  className?: string;
}

const defaultRow1: Testimonial[] = [
  {
    quote: "Got my dream SUV from here. The paperwork was incredibly smooth and they even gave me a free detailing session before delivery.",
    name: "Arjun Mehta",
    role: "Bought a Ford Endeavour",
    avatar: "https://i.pravatar.cc/100?img=11",
  },
  {
    quote: "I exchanged my old hatchback for a premium sedan. Best valuation price in the city and total transparency.",
    name: "Sarakhan",
    role: "Bought a Honda City",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    quote: "Absolutely trust these guys. I came from out of state just to buy from Genuine Vehicles because their cars are meticulously inspected.",
    name: "Vikram Singh",
    role: "Bought a Toyota Fortuner",
    avatar: "https://i.pravatar.cc/100?img=15",
  },
  {
    quote: "First time buying a used car and they made it feel like buying a brand new one. Financing was arranged in under 2 hours.",
    name: "Priya Nair",
    role: "Bought a Hyundai i20",
    avatar: "https://i.pravatar.cc/100?img=9",
  },
];

const defaultRow2: Testimonial[] = [
  {
    quote: "Their premium bike collection is unmatched. Got an incredible deal on a barely-ridden Ninja 650.",
    name: "Rohan Desai",
    role: "Bought a Kawasaki Ninja",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    quote: "The team is very professional. No aggressive sales tactics, just honest advice and great quality cars.",
    name: "Dr. Ananya Rao",
    role: "Bought a Kia Seltos",
    avatar: "https://i.pravatar.cc/100?img=36",
  },
  {
    quote: "Excellent after-sales support. I had a minor issue with the AC a week later and they fixed it instantly for free.",
    name: "Karan Patel",
    role: "Bought a VW Polo GT",
    avatar: "https://i.pravatar.cc/100?img=14",
  },
  {
    quote: "Highly recommend Genuine Vehicles. The entire team went out of their way to find exactly the color and model I wanted.",
    name: "Neha Sharma",
    role: "Bought a Maruti Swift",
    avatar: "https://i.pravatar.cc/100?img=20",
  },
];

export default function Testimonials({
  heading = "What Our Happy Customers Say",
  rows = [defaultRow1, defaultRow2],
  className,
}: TestimonialsProps) {
  return (
    <section id="testimonials" className={cn("border-t border-border py-24 overflow-hidden", className)}>
      <div className="mx-auto max-w-6xl px-5">
        <FadeIn>
          <h2 className="mb-16 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
        </FadeIn>
      </div>
      <KineticTestimonials rows={rows} />
    </section>
  );
}