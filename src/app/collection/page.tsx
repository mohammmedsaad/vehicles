"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FadeIn } from "@/components/fade-in";
import { ArrowRight, Fuel, Gauge, Settings2, Calendar, RefreshCw } from "lucide-react";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import Image from "next/image";
import Link from "next/link";
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
  brand: string;
  status: string;
}

export default function CollectionPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchAllVehicles() {
    setLoading(true);
    setError(false);
    try {
      let fetched: Vehicle[] = [];
      try {
        // Try optimized index query first
        const q = query(
          collection(db, "vehicles"),
          where("status", "in", ["Available", "Reserved"])
        );
        const querySnapshot = await getDocs(q);
        fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];
      } catch (queryErr) {
        console.warn("Index query failed, falling back to fetching all vehicles", queryErr);
        // Fallback: fetch all vehicles & filter client side
        const q = query(collection(db, "vehicles"));
        const querySnapshot = await getDocs(q);
        fetched = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((v: any) => v.status !== "Sold") as Vehicle[];
      }

      setVehicles(fetched);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col pt-16 sm:pt-24 px-6 sm:px-8">
        <div className="mx-auto max-w-6xl w-full py-6 sm:py-12">
          <FadeIn>
            <div className="mb-6 sm:mb-12">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-500">Verified Inventory</span>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Our Complete Collection
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-xs sm:text-base md:text-lg">
                Browse through our entire inventory of certified, high-quality pre-owned vehicles.
              </p>
            </div>
          </FadeIn>

          {loading ? (
            <VehicleSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-card">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Unable to Load Inventory</h3>
              <p className="text-muted-foreground mb-4 text-xs sm:text-sm max-w-md mx-auto">
                We encountered a connection issue while loading the vehicle collection.
              </p>
              <button
                onClick={fetchAllVehicles}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <RefreshCw className="size-3.5 sm:size-4" /> Reload Collection
              </button>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/50">
              <h3 className="text-lg font-bold mb-1">No vehicles available</h3>
              <p className="text-xs text-muted-foreground">Check back soon for new inventory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle, i) => (
                <FadeIn key={vehicle.id} delay={i * 0.04}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-lg">
                    <div className="relative h-36 sm:h-64 w-full overflow-hidden bg-muted/20">
                      {vehicle.image ? (
                        <Image
                          src={vehicle.image}
                          alt={vehicle.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={i < 4}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs font-medium">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                        {vehicle.status === "Reserved" && (
                          <span className="rounded-full border border-amber-200/20 bg-amber-500/90 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white backdrop-blur-md shadow-sm">
                            Reserved
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md shadow-sm">
                          {vehicle.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 gap-3 sm:gap-4 p-4 sm:p-6">
                      <div>
                        {vehicle.brand && (
                          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-0.5">
                            {vehicle.brand}
                          </div>
                        )}
                        <h3 className="text-base sm:text-xl font-bold tracking-tight text-foreground">{vehicle.name}</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-0.5">
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 sm:p-2 rounded-lg">
                          <Calendar className="size-3.5 text-emerald-500 shrink-0" />
                          <span className="font-medium text-foreground truncate">{vehicle.year}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 sm:p-2 rounded-lg">
                          <Fuel className="size-3.5 text-amber-500 shrink-0" />
                          <span className="font-medium text-foreground truncate">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 sm:p-2 rounded-lg">
                          <Settings2 className="size-3.5 text-violet-500 shrink-0" />
                          <span className="font-medium text-foreground truncate">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 sm:p-2 rounded-lg">
                          <Gauge className="size-3.5 text-blue-500 shrink-0" />
                          <span className="font-medium text-foreground truncate">{vehicle.kmDriven}</span>
                        </div>
                      </div>

                      <Link
                        href={`/vehicle/${vehicle.id}`}
                        className="mt-auto pt-3 flex items-center justify-between text-xs sm:text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-500 cursor-pointer border-t border-border/50"
                      >
                        <span>View Full Details</span>
                        <ArrowRight className="size-3.5 sm:size-4 transition-transform group-hover:translate-x-1.5" />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
