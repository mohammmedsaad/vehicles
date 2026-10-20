import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeGetMillis(val: any): number {
  if (!val) return 0;
  if (typeof val.toMillis === "function") {
    try {
      return val.toMillis();
    } catch {
      // fallback
    }
  }
  if (typeof val.toDate === "function") {
    try {
      return val.toDate().getTime();
    } catch {
      // fallback
    }
  }
  if (val instanceof Date) return val.getTime();
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const parsed = Date.parse(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof val === "object" && typeof val.seconds === "number") {
    return val.seconds * 1000;
  }
  return 0;
}

export function formatDate(val: any): string {
  const ms = safeGetMillis(val);
  if (!ms) return 'N/A';
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(val: any): string {
  const ms = safeGetMillis(val);
  if (!ms) return 'N/A';
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
