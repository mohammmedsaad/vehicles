"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

import { safeGetMillis, formatDateTime } from "@/lib/utils";

interface Lead {
  id: string;
  vehicleName?: string;
  vehicleInterestedIn?: string;
  customerName?: string;
  name?: string;
  phone: string;
  message: string;
  status: string;
  createdAt: any;
}

export default function ManageLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const snapshot = await getDocs(collection(db, "inquiries"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      
      data.sort((a, b) => safeGetMillis(b.createdAt) - safeGetMillis(a.createdAt));
      
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), {
        status: newStatus
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status: " + (error instanceof Error ? error.message : JSON.stringify(error)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteDoc(doc(db, "inquiries", id));
        setLeads(leads.filter(l => l.id !== id));
      } catch (error) {
        console.error("Error deleting lead", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Follow-up': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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
        <h1 className="text-3xl font-bold tracking-tight">Customer Leads</h1>
        <p className="text-muted-foreground mt-2">
          Manage inquiries and customer contacts.
        </p>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Vehicle Interested In</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Inquiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.customerName || lead.name || "Anonymous"}</TableCell>
                  <TableCell>{lead.phone || "N/A"}</TableCell>
                  <TableCell className="font-medium text-emerald-600">{lead.vehicleName || lead.vehicleInterestedIn || "General Inquiry"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={lead.message}>
                    {lead.message || "No message"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(lead.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Select value={lead.status || "New"} onValueChange={(val) => updateStatus(lead.id, val)}>
                      <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold border-none ${getStatusColor(lead.status || "New")}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(lead.id)}>
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
