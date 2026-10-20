"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, UploadCloud, X, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AddVehicle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      brand: "",
      model: "",
      variant: "",
      type: "Car",
      price: "",
      year: new Date().getFullYear().toString(),
      fuelType: "Petrol",
      transmission: "Manual",
      kmDriven: "",
      ownership: "1st",
      color: "",
      registrationState: "",
      description: "",
      status: "Available"
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);
      
      const newUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
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
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading images and saving vehicle...");

    try {
      // 1. Upload Images to Cloudflare R2
      const { uploadFileToR2 } = await import("@/lib/upload");
      
      const uploadedUrls = await Promise.all(
        images.map(async (file) => {
          return await uploadFileToR2(file);
        })
      );

      // 2. Save Document to Firestore
      const vehicleData = {
        ...data,
        year: parseInt(data.year),
        features,
        images: uploadedUrls,
        image: uploadedUrls[0], // primary image for list views
        isFeatured: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "vehicles"), vehicleData);
      
      toast.success("Vehicle added successfully!", { id: toastId });
      router.push("/admin/vehicles");
    } catch (error) {
      console.error("Error adding vehicle", error);
      toast.error("Failed to add vehicle: " + (error instanceof Error ? error.message : "Upload error"), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/vehicles">
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Vehicle</h1>
          <p className="text-muted-foreground">Fill in the details to list a new vehicle.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>The main details about the vehicle.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Listing Title (e.g. 2022 Hyundai Creta SX)</Label>
              <Input id="name" {...register("name", { required: true })} placeholder="Listing Name" />
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
              <Input id="brand" {...register("brand", { required: true })} placeholder="e.g. Hyundai, Honda, Royal Enfield" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...register("model", { required: true })} placeholder="e.g. Creta, City, Classic 350" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variant">Variant / Trim</Label>
              <Input id="variant" {...register("variant")} placeholder="e.g. SX(O) Diesel AT" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" {...register("price", { required: true })} placeholder="e.g. 15,00,000" />
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
              <Input id="year" type="number" {...register("year", { required: true })} placeholder="2022" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kmDriven">KM Driven</Label>
              <Input id="kmDriven" {...register("kmDriven", { required: true })} placeholder="e.g. 25,000" />
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
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" {...register("color")} placeholder="e.g. Polar White" />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="registrationState">Registration State (RTO)</Label>
              <Input id="registrationState" {...register("registrationState")} placeholder="e.g. MH 12 (Pune)" />
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
                  placeholder="e.g. Sunroof, Alloy Wheels, Touchscreen..." 
                />
                <Button type="button" variant="secondary" onClick={addFeature}>Add</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                {...register("description")} 
                placeholder="Write a detailed description about the vehicle's condition, service history, etc." 
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
                {previewUrls.map((url, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                    <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-black/80"
                    >
                      <X className="size-4" />
                    </button>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Vehicle"}
          </Button>
        </div>
      </form>
    </div>
  );
}
