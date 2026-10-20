"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditVehicle() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const docRef = doc(db, "vehicles", vehicleId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          reset({
            name: data.name || "",
            brand: data.brand || "",
            model: data.model || "",
            variant: data.variant || "",
            type: data.type || "Car",
            price: data.price || "",
            year: data.year?.toString() || new Date().getFullYear().toString(),
            fuelType: data.fuelType || "Petrol",
            transmission: data.transmission || "Manual",
            kmDriven: data.kmDriven || "",
            ownership: data.ownership || "1st",
            color: data.color || "",
            registrationState: data.registrationState || "",
            description: data.description || "",
            status: data.status || "Available"
          });
          
          setFeatures(data.features || []);
          setExistingImages(data.images || (data.image ? [data.image] : []));
          setIsFeatured(data.isFeatured || false);
        } else {
          toast.error("Vehicle not found");
          router.push("/admin/vehicles");
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        toast.error("Failed to load vehicle details.");
      } finally {
        setLoading(false);
      }
    }

    if (vehicleId) fetchVehicle();
  }, [vehicleId, reset, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...selectedFiles]);
      
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setNewPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    URL.revokeObjectURL(newPreviewUrls[index]);
    setNewPreviewUrls(newPreviewUrls.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(f => f !== featureToRemove));
  };

  const onSubmit = async (data: any) => {
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error("Please ensure the vehicle has at least one image");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Updating vehicle details...");

    try {
      // Upload any new images to Cloudflare R2
      let uploadedUrls: string[] = [];
      if (newImages.length > 0) {
        const { uploadFileToR2 } = await import("@/lib/upload");
        uploadedUrls = await Promise.all(
          newImages.map(async (file) => {
            return await uploadFileToR2(file);
          })
        );
      }

      const allImages = [...existingImages, ...uploadedUrls];

      // Logic: If sold, we un-feature it automatically.
      const statusIsSold = data.status === "Sold";
      const finalFeaturedState = statusIsSold ? false : isFeatured;

      const vehicleData = {
        ...data,
        year: parseInt(data.year),
        features,
        images: allImages,
        image: allImages[0], 
        isFeatured: finalFeaturedState,
      };

      const docRef = doc(db, "vehicles", vehicleId);
      await updateDoc(docRef, vehicleData);
      
      toast.success("Vehicle updated successfully!", { id: toastId });
      router.push("/admin/vehicles");
    } catch (error) {
      console.error("Error updating vehicle", error);
      toast.error("Failed to update vehicle.", { id: toastId });
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/vehicles">
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Vehicle</h1>
          <p className="text-muted-foreground">Modify details for this vehicle.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Listing Title</Label>
              <Input id="name" {...register("name", { required: true })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Bike">Bike</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Premium Vehicle">Premium Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand / Make</Label>
              <Input id="brand" {...register("brand", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...register("model", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variant">Variant / Trim</Label>
              <Input id="variant" {...register("variant")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" {...register("price", { required: true })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="year">Registration Year</Label>
              <Input id="year" type="number" {...register("year", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kmDriven">KM Driven</Label>
              <Input id="kmDriven" {...register("kmDriven", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Controller
                control={control}
                name="fuelType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Fuel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="CNG">CNG</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Controller
                control={control}
                name="transmission"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Transmission" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="AMT">AMT</SelectItem>
                      <SelectItem value="DCT">DCT</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownership">Ownership</Label>
              <Controller
                control={control}
                name="ownership"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Ownership" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Owner</SelectItem>
                      <SelectItem value="2nd">2nd Owner</SelectItem>
                      <SelectItem value="3rd+">3rd+ Owner</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="registrationState">Registration State (RTO)</Label>
              <Input id="registrationState" {...register("registrationState")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features & Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Key Features</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-foreground">
                    {f}
                    <button type="button" onClick={() => removeFeature(f)} className="text-muted-foreground hover:text-foreground">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={newFeature} 
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                  placeholder="e.g. Sunroof..." 
                />
                <Button type="button" variant="secondary" onClick={addFeature}>Add</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                {...register("description")} 
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Vehicle Images</Label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                {/* Existing Images */}
                {existingImages.map((url, i) => (
                  <div key={`old-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                    <Image src={url} alt={`Existing ${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-black/80"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                
                {/* New Images */}
                {newPreviewUrls.map((url, i) => (
                  <div key={`new-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-emerald-500/50">
                    <Image src={url} alt={`New Preview ${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-black/80"
                    >
                      <X className="size-4" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-emerald-500/80 py-1 text-center text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                      New
                    </div>
                  </div>
                ))}
                
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/60">
                  <UploadCloud className="mb-2 size-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2 md:w-1/3">
              <Label htmlFor="status">Listing Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/vehicles">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Vehicle"}
          </Button>
        </div>
      </form>
    </div>
  );
}
