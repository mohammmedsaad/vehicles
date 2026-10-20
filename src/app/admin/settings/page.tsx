"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      businessName: "",
      phoneNumber: "",
      whatsappNumber: "",
      email: "",
      address: "",
      instagram: "",
      facebook: "",
      youtube: "",
      heroText: "",
      heroSubtext: "",
    }
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          reset(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const toastId = toast.loading("Saving settings...");

    try {
      await setDoc(doc(db, "settings", "general"), data);
      toast.success("Settings saved successfully!", { id: toastId });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings.", { id: toastId });
    } finally {
      setSaving(false);
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
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dealership Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business information and website content.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Contact details displayed across the website.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" {...register("businessName")} placeholder="Genuine Vehicles" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} placeholder="+91 9876543210" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input id="whatsappNumber" {...register("whatsappNumber")} placeholder="+91 9876543210" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} placeholder="contact@genuinevehicles.com" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Physical Address</Label>
              <Textarea id="address" {...register("address")} placeholder="123 Dealership Row, Auto Hub..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" {...register("instagram")} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" {...register("facebook")} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input id="youtube" {...register("youtube")} placeholder="https://youtube.com/..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Content</CardTitle>
            <CardDescription>Customize the main text on your homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heroText">Hero Section Title</Label>
              <Input id="heroText" {...register("heroText")} placeholder="Find Your Dream Vehicle Today" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtext">Hero Section Subtext</Label>
              <Textarea 
                id="heroSubtext" 
                {...register("heroSubtext")} 
                placeholder="Browse our extensive collection of premium pre-owned cars and bikes..." 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg" className="w-full md:w-auto">
            {saving ? (
              <span className="flex items-center gap-2"><div className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" /> Saving...</span>
            ) : (
              <span className="flex items-center gap-2"><Save className="size-4" /> Save Settings</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
