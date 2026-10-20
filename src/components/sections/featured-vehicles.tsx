"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/fade-in";
import { ArrowRight, Fuel, Gauge, Settings2, Calendar, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "motion/react";
import GlowingBorderCard from "@/components/ui/glowingbordercard";
import { VehicleSkeleton } from "@/components/ui/vehicle-skeleton";

interface Vehicle {
  id: string;
  name: string;
  year: number;
  fuelType: string;
  transmission: string;
  kmDriven: string;
  price: string;
  image: string;
  status?: string;
}

export default function FeaturedVehicles({ className }: { className?: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  async function fetchFeatured() {
    setLoading(true);
    setError(false);
    try {
      const q = query(collection(db, "vehicles"));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Vehicle[];

      // Filter out sold vehicles and limit to 3 in the frontend
      const availableFeatured = fetched
        .filter((v) => v.status !== "Sold")
        .slice(0, 3);

      setVehicles(availableFeatured);
    } catch (err) {
      console.error("Error fetching featured vehicles:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <section id="featured-vehicles" className={cn("border-t border-border py-8 sm:py-20 px-8 sm:px-10", className)}>
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="text-center mb-4 sm:mb-12">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-500">Handpicked Selection</span>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Featured Collection
            </h2>
          </div>
        </FadeIn>

        {loading ? (
          <VehicleSkeleton count={3} />
        ) : error ? (
          <div className="text-center py-8 px-4 border border-dashed border-border rounded-2xl bg-card">
            <p className="text-muted-foreground mb-3 text-xs sm:text-sm">Unable to load vehicles right now.</p>
            <button
              onClick={fetchFeatured}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium text-xs sm:text-sm hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw className="size-3.5" /> Try Again
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs sm:text-sm border border-dashed border-border rounded-2xl">
            No vehicles available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle, i) => (
              <FadeIn key={vehicle.id} delay={i * 0.05}>
                <motion.div
                  onHoverStart={() => setHoveredIndex(i)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="h-full cursor-pointer"
                >
                  <GlowingBorderCard className="h-full w-full flex flex-col" fromColor="from-emerald-500" toColor="to-teal-500">
                    <div className="relative h-36 sm:h-56 w-full overflow-hidden bg-muted/20 shrink-0">
                      {vehicle.image ? (
                        <Image
                          src={vehicle.image}
                          alt={vehicle.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                          priority={i < 3}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs font-medium">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                        <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold text-white backdrop-blur-md shadow-sm">
                          {vehicle.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 gap-2.5 sm:gap-4 p-3.5 sm:p-6">
                      <div>
                        <h3 className="text-sm sm:text-xl font-bold tracking-tight text-foreground">{vehicle.name}</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 text-[11px] sm:text-sm text-muted-foreground mt-0.5">
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 sm:p-2 rounded-lg">
                          <Calendar className="size-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{vehicle.year}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 sm:p-2 rounded-lg">
                          <Fuel className="size-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 sm:p-2 rounded-lg">
                          <Settings2 className="size-3.5 text-violet-500 shrink-0" />
                          <span className="truncate">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 sm:p-2 rounded-lg">
                          <Gauge className="size-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{vehicle.kmDriven}</span>
                        </div>
                      </div>

                      <Link
                        href={`/vehicle/${vehicle.id}`}
                        className="mt-auto pt-2.5 sm:pt-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-500 border-t border-border/50"
                      >
                        <span>View Details</span>
                        <ArrowRight className="size-3.5 sm:size-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </GlowingBorderCard>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}

        {vehicles.length > 0 && (
          <FadeIn delay={0.2} className="mt-6 sm:mt-12 flex justify-center">
            <Link
              href="/collection"
              className="inline-flex h-9 sm:h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 sm:px-8 text-xs sm:text-sm font-semibold text-foreground transition-all hover:border-foreground/30 hover:bg-accent active:scale-[0.99]"
            >
              <span>Explore Full Collection</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </Link>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
