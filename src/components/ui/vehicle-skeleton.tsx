"use client";

import { cn } from "@/lib/utils";

interface VehicleSkeletonProps {
  count?: number;
  className?: string;
}

export function VehicleSkeleton({ count = 3, className }: VehicleSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="h-36 sm:h-56 w-full bg-muted/70" />

          {/* Content */}
          <div className="flex flex-1 flex-col gap-4 p-6">
            {/* Title & Brand */}
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-muted/80" />
              <div className="h-6 w-3/4 rounded bg-muted" />
            </div>

            {/* Spec Badges Grid */}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="h-8 rounded-lg bg-muted/60" />
              <div className="h-8 rounded-lg bg-muted/60" />
              <div className="h-8 rounded-lg bg-muted/60" />
              <div className="h-8 rounded-lg bg-muted/60" />
            </div>

            {/* Footer Link */}
            <div className="mt-auto border-t border-border/50 pt-4 flex justify-between items-center">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-4 w-4 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
