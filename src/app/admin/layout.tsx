"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Car, LayoutDashboard, Settings, MessageSquare, Repeat, CheckCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Add Vehicle", href: "/admin/vehicles/add", icon: Car },
  { name: "Manage Vehicles", href: "/admin/vehicles", icon: Car },
  { name: "Reservations", href: "/admin/reservations", icon: CheckCircle },
  { name: "Customer Leads", href: "/admin/leads", icon: MessageSquare },
  { name: "Exchange Requests", href: "/admin/exchange", icon: Repeat },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !pathname.includes("/admin/login")) {
      router.push("/admin/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!user && !pathname.includes("/admin/login")) {
    return null; // Will redirect in useEffect
  }

  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-card">
        <div className="flex h-14 items-center border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-6 items-center justify-center rounded bg-foreground text-[10px] text-background">
              {siteConfig.name.charAt(0)}
            </span>
            Admin Panel
          </Link>
        </div>
        
        <div className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-foreground/10 text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
