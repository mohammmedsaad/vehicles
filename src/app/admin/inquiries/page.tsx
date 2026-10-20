"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Eye, Check, X, Mail, Phone, Calendar } from "lucide-react";

import { safeGetMillis, formatDate, formatDateTime } from "@/lib/utils";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleInterestedIn: string;
  message: string;
  status: string; // 'New', 'Contacted', 'Closed'
  createdAt: any;
}

export default function CustomerInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInquiries = async () => {
    try {
      const snapshot = await getDocs(collection(db, "inquiries"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
      
      data.sort((a, b) => safeGetMillis(b.createdAt) - safeGetMillis(a.createdAt));
      
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), {
        status: newStatus
      });
      setInquiries(inquiries.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating inquiry status", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'New': return <Badge variant="default" className="bg-blue-500">New</Badge>;
      case 'Contacted': return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">Contacted</Badge>;
      case 'Closed': return <Badge variant="outline" className="text-muted-foreground">Closed</Badge>;
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
        <h1 className="text-3xl font-bold tracking-tight">Customer Inquiries</h1>
        <p className="text-muted-foreground mt-2">
          Manage and respond to vehicle inquiries from customers.
        </p>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => {
                const dateStr = formatDate(inquiry.createdAt);
                
                return (
                  <TableRow key={inquiry.id}>
                    <TableCell className="text-muted-foreground">{dateStr}</TableCell>
                    <TableCell>
                      <div className="font-medium">{inquiry.name || (inquiry as any).customerName}</div>
                      <div className="text-xs text-muted-foreground">{inquiry.phone}</div>
                    </TableCell>
                    <TableCell className="font-medium">{inquiry.vehicleInterestedIn || (inquiry as any).vehicleName}</TableCell>
                    <TableCell>
                      {getStatusBadge(inquiry.status || 'New')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="mr-2 size-4" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedInquiry && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
              <DialogDescription>
                Received on {formatDateTime(selectedInquiry.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Customer Info</p>
                  <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                    <Mail className="size-3.5" /> {selectedInquiry.email || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
                    <Phone className="size-3.5" /> {selectedInquiry.phone || "N/A"}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Vehicle of Interest</h4>
                <div className="rounded-md bg-muted p-3 text-sm font-semibold">
                  {selectedInquiry.vehicleInterestedIn}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Message from Customer</h4>
                <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground whitespace-pre-wrap min-h-[100px]">
                  {selectedInquiry.message || "No message provided."}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm font-medium">Current Status: {getStatusBadge(selectedInquiry.status || 'New')}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateStatus(selectedInquiry.id, "Contacted")}>
                    Mark Contacted
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => updateStatus(selectedInquiry.id, "Closed")}>
                    Close Inquiry
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
