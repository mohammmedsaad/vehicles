"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CheckCircle, Star, MessageSquare, Repeat, Activity } from "lucide-react";
import { FadeIn } from "@/components/fade-in";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    featured: 0,
    inquiries: 0,
    exchanges: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const vehiclesRef = collection(db, "vehicles");
        const inquiriesRef = collection(db, "inquiries");
        const exchangesRef = collection(db, "exchanges");

        // Note: In a real production app with thousands of documents, 
        // using aggregate queries (e.g. getCountFromServer) is better.
        // For a dealership, getDocs is perfectly fine and simple.
        
        const results = await Promise.allSettled([
          getDocs(vehiclesRef),
          getDocs(inquiriesRef),
          getDocs(exchangesRef)
        ]);

        const vehiclesSnap = results[0].status === "fulfilled" ? results[0].value : null;
        const inquiriesSnap = results[1].status === "fulfilled" ? results[1].value : null;
        const exchangesSnap = results[2].status === "fulfilled" ? results[2].value : null;

        let available = 0;
        let sold = 0;
        let featured = 0;

        if (vehiclesSnap) {
          vehiclesSnap.forEach((doc) => {
            const data = doc.data();
            if (data.status === "Available") available++;
            if (data.status === "Sold") sold++;
            if (data.isFeatured) featured++;
          });
        }

        setStats({
          total: vehiclesSnap ? vehiclesSnap.size : 0,
          available,
          sold,
          featured,
          inquiries: inquiriesSnap ? inquiriesSnap.size : 0,
          exchanges: exchangesSnap ? exchangesSnap.size : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Vehicles", value: stats.total, icon: Car, color: "text-blue-500" },
    { title: "Available", value: stats.available, icon: CheckCircle, color: "text-emerald-500" },
    { title: "Sold Vehicles", value: stats.sold, icon: Activity, color: "text-rose-500" },
    { title: "Featured", value: stats.featured, icon: Star, color: "text-amber-500" },
    { title: "New Inquiries", value: stats.inquiries, icon: MessageSquare, color: "text-violet-500" },
    { title: "Exchange Requests", value: stats.exchanges, icon: Repeat, color: "text-orange-500" },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your dealership's inventory and customer requests.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <FadeIn key={stat.title} delay={i * 0.05}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`size-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
