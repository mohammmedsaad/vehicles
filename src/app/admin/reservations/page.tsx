"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

import { safeGetMillis, formatDateTime } from "@/lib/utils";

interface Reservation {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  phone: string;
  city: string;
  email: string;
  message: string;
  status: string;
  createdAt: any;
}

export default function ManageReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reservations"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      
      data.sort((a, b) => safeGetMillis(b.createdAt) - safeGetMillis(a.createdAt));
      
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id: string, newStatus: string, vehicleId?: string) => {
    try {
      await updateDoc(doc(db, "reservations", id), {
        status: newStatus
      });
      
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

      if (vehicleId) {
        if (newStatus === "Confirmed") {
          await updateDoc(doc(db, "vehicles", vehicleId), {
            status: "Reserved"
          });
          alert(`Reservation Confirmed! The vehicle status has been automatically updated to 'Reserved'.`);
        } else if (newStatus === "Cancelled") {
          await updateDoc(doc(db, "vehicles", vehicleId), {
            status: "Available"
          });
        }
      }
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status: " + (error instanceof Error ? error.message : JSON.stringify(error)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      try {
        await deleteDoc(doc(db, "reservations", id));
        setReservations(reservations.filter(r => r.id !== id));
      } catch (error) {
        console.error("Error deleting reservation", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Confirmed': return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800';
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
        <p className="text-muted-foreground mt-2">
          Manage vehicle reservations and waitlists.
        </p>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No reservations found.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>
                    <div className="font-medium">{res.customerName}</div>
                    <div className="text-xs text-muted-foreground">{res.city}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{res.phone}</div>
                    <div className="text-xs text-muted-foreground">{res.email || 'No email'}</div>
                  </TableCell>
                  <TableCell className="font-medium">{res.vehicleName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(res.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Select value={res.status} onValueChange={(val) => updateStatus(res.id, val, res.vehicleId)}>
                      <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold border-none ${getStatusColor(res.status)}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(res.id)}>
                      <Trash2 className="size-4" />
                    </Button>
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
