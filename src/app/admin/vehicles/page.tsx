"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { safeGetMillis } from "@/lib/utils";

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  price: string;
  status: string;
  isFeatured: boolean;
  image?: string;
  createdAt: any;
}

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const snapshot = await getDocs(collection(db, "vehicles"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      
      // Sort by creation date descending safely
      data.sort((a, b) => safeGetMillis(b.createdAt) - safeGetMillis(a.createdAt));
      
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "vehicles", id));
        setVehicles(vehicles.filter(v => v.id !== id));
      } catch (error) {
        console.error("Error deleting vehicle", error);
        alert("Failed to delete vehicle");
      }
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "vehicles", id), {
        isFeatured: !currentStatus
      });
      setVehicles(vehicles.map(v => v.id === id ? { ...v, isFeatured: !currentStatus } : v));
    } catch (error) {
      console.error("Error updating featured status", error);
    }
  };

  const markAsSold = async (id: string) => {
    try {
      await updateDoc(doc(db, "vehicles", id), {
        status: "Sold",
        isFeatured: false // Sold vehicles shouldn't be featured usually
      });
      setVehicles(vehicles.map(v => v.id === id ? { ...v, status: "Sold", isFeatured: false } : v));
    } catch (error) {
      console.error("Error updating status to Sold", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Vehicles</h1>
          <p className="text-muted-foreground mt-2">
            View, edit, and delete your vehicle inventory.
          </p>
        </div>
        <Link href="/admin/vehicles/add">
          <Button>Add New Vehicle</Button>
        </Link>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Vehicle Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    {vehicle.image ? (
                      <div className="relative size-12 overflow-hidden rounded-md bg-muted">
                        <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-xs text-muted-foreground">{vehicle.brand}</div>
                  </TableCell>
                  <TableCell>{vehicle.price}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.status === 'Available' ? 'default' : vehicle.status === 'Sold' ? 'destructive' : 'secondary'}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleFeatured(vehicle.id, vehicle.isFeatured)} className="transition-colors hover:text-amber-500">
                      <Star className={`size-5 ${vehicle.isFeatured ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {vehicle.status !== 'Sold' && (
                        <Button variant="outline" size="sm" onClick={() => markAsSold(vehicle.id)}>
                          Mark Sold
                        </Button>
                      )}
                      <Link href={`/admin/vehicles/edit/${vehicle.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="size-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(vehicle.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
