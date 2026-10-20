"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, Mail, Phone, Car, MapPin } from "lucide-react";
import Image from "next/image";

import { safeGetMillis, formatDate, formatDateTime } from "@/lib/utils";

interface ExchangeRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerVehicle: string;
  expectedPrice: string;
  kmDriven: string;
  year: string;
  condition: string;
  images: string[];
  status: string; // 'Pending', 'Reviewed', 'Rejected', 'Accepted'
  createdAt: any;
}

export default function ExchangeRequests() {
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<ExchangeRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const snapshot = await getDocs(collection(db, "exchanges"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ExchangeRequest[];
      
      data.sort((a, b) => safeGetMillis(b.createdAt) - safeGetMillis(a.createdAt));
      
      setRequests(data);
    } catch (error) {
      console.error("Error fetching exchange requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "exchanges", id), {
        status: newStatus
      });
      setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
      if (selectedReq?.id === id) {
        setSelectedReq({ ...selectedReq, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating exchange status", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending': return <Badge variant="default" className="bg-orange-500">Pending</Badge>;
      case 'Reviewed': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Reviewed</Badge>;
      case 'Accepted': return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Accepted</Badge>;
      case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
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
        <h1 className="text-3xl font-bold tracking-tight">Exchange Requests</h1>
        <p className="text-muted-foreground mt-2">
          Review customer vehicles offered for exchange.
        </p>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Offered Vehicle</TableHead>
              <TableHead>Expected Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No exchange requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => {
                const dateStr = formatDate(req.createdAt);
                
                return (
                  <TableRow key={req.id}>
                    <TableCell className="text-muted-foreground">{dateStr}</TableCell>
                    <TableCell>
                      <div className="font-medium">{req.name}</div>
                      <div className="text-xs text-muted-foreground">{req.phone}</div>
                    </TableCell>
                    <TableCell className="font-medium">{req.customerVehicle}</TableCell>
                    <TableCell>{req.expectedPrice}</TableCell>
                    <TableCell>
                      {getStatusBadge(req.status || 'Pending')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedReq(req);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="mr-2 size-4" /> Review
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedReq && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Exchange Request Review</DialogTitle>
              <DialogDescription>
                Submitted on {formatDateTime(selectedReq.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              {/* Customer Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1 rounded-lg border border-border p-4 bg-muted/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer Details</p>
                  <p className="font-medium mt-1">{selectedReq.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Phone className="size-3.5" /> {selectedReq.phone || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Mail className="size-3.5" /> {selectedReq.email || "N/A"}
                  </div>
                </div>

                <div className="flex flex-col gap-1 rounded-lg border border-border p-4 bg-muted/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Details</p>
                  <p className="font-medium mt-1 flex items-center gap-2"><Car className="size-4" />{selectedReq.customerVehicle}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm"><span className="text-muted-foreground">Year:</span> {selectedReq.year}</div>
                    <div className="text-sm"><span className="text-muted-foreground">Driven:</span> {selectedReq.kmDriven}</div>
                    <div className="text-sm col-span-2"><span className="text-muted-foreground">Expected:</span> <span className="font-semibold text-emerald-500">{selectedReq.expectedPrice}</span></div>
                  </div>
                </div>
              </div>

              {/* Description/Condition */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Condition Notes</h4>
                <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
                  {selectedReq.condition || "No additional notes provided."}
                </div>
              </div>

              {/* Images */}
              {selectedReq.images && selectedReq.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedReq.images.map((img, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted/30">
                        <Image src={img} alt="Customer vehicle" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-border gap-4">
                <span className="text-sm font-medium flex items-center gap-2">Status: {getStatusBadge(selectedReq.status || 'Pending')}</span>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateStatus(selectedReq.id, "Reviewed")}>
                    Mark Reviewed
                  </Button>
                  <Button variant="default" className="bg-emerald-500 hover:bg-emerald-600" size="sm" onClick={() => updateStatus(selectedReq.id, "Accepted")}>
                    Accept
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => updateStatus(selectedReq.id, "Rejected")}>
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
