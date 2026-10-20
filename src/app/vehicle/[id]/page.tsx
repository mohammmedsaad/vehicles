"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FadeIn } from "@/components/fade-in";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import Image from "next/image";
import { ArrowLeft, Calendar, Check, Fuel, Gauge, MapPin, Settings2, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  // Modals state
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);

  // Form states
  const [submitting, setSubmitting] = useState(false);
  
  // Reserve form
  const [rName, setRName] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rCity, setRCity] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rMessage, setRMessage] = useState("");

  // Test drive form
  const [tdName, setTdName] = useState("");
  const [tdPhone, setTdPhone] = useState("");
  const [tdDate, setTdDate] = useState("");
  const [tdTime, setTdTime] = useState("");

  // Inquiry form
  const [iName, setIName] = useState("");
  const [iPhone, setIPhone] = useState("");
  const [iMessage, setIMessage] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const vehicleId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  useEffect(() => {
    async function fetchVehicle() {
      if (!vehicleId) return;
      setLoading(true);
      setNotFoundState(false);
      try {
        const docRef = doc(db, "vehicles", vehicleId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const imagesList = Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : data.image ? [data.image] : [];

          setVehicle({ id: docSnap.id, ...data });
          setActiveImage(imagesList[0] || "");
        } else {
          setNotFoundState(true);
        }
      } catch (error) {
        console.error("Error fetching vehicle details", error);
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [vehicleId]);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reservations"), {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        customerName: rName,
        phone: rPhone,
        city: rCity,
        email: rEmail,
        message: rMessage,
        status: "New",
        createdAt: serverTimestamp()
      });
      setReserveModalOpen(false);
      alert("Reservation request submitted successfully!");
    } catch (error) {
      console.error("Error submitting reservation", error);
      alert("Failed to submit reservation: " + (error instanceof Error ? error.message : JSON.stringify(error)));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "testDriveBookings"), {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        customerName: tdName,
        phone: tdPhone,
        preferredDate: tdDate,
        preferredTime: tdTime,
        status: "New",
        createdAt: serverTimestamp()
      });
      setTestDriveModalOpen(false);
      alert("Test drive request submitted successfully!");
    } catch (error) {
      console.error("Error submitting test drive", error);
      alert("Failed to submit test drive request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        customerName: iName,
        phone: iPhone,
        message: iMessage,
        status: "New",
        createdAt: serverTimestamp()
      });
      setInquirySuccess(true);
      setIName("");
      setIPhone("");
      setIMessage("");
      setTimeout(() => setInquirySuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting inquiry", error);
      alert("Failed to send inquiry.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello Genuine Vehicles,\n\nI am interested in:\nVehicle: ${vehicle.name}\n\nPlease provide more details.`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (notFoundState || !vehicle) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col pt-24 px-5 pb-20 items-center justify-center">
          <div className="text-center max-w-md p-8 rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
            <p className="text-muted-foreground text-sm mb-6">
              The requested vehicle listing could not be found or may have been removed.
            </p>
            <Button onClick={() => router.push("/collection")} className="gap-2">
              <ArrowLeft className="size-4" /> Browse Available Inventory
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isReserved = vehicle.status === "Reserved";
  const isSold = vehicle.status === "Sold";

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col pt-24 px-5 pb-20">
        <div className="mx-auto max-w-6xl w-full">
          
          <button 
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Collection
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Images */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/20">
                {activeImage ? (
                  <Image src={activeImage} alt={vehicle.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">No Image Available</div>
                )}
                {isSold && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                    <div className="border-4 border-red-500 text-red-500 font-black text-6xl tracking-widest uppercase py-4 px-8 transform -rotate-12 rounded-lg">
                      SOLD
                    </div>
                  </div>
                )}
              </div>
              
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {vehicle.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${activeImage === img ? 'border-emerald-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              <FadeIn>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-sm font-bold uppercase tracking-wider text-emerald-500">{vehicle.brand} {vehicle.model}</div>
                  {isReserved && !isSold && (
                    <span className="rounded-full border border-amber-200/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500 flex items-center gap-1.5">
                      <AlertCircle className="size-3.5" />
                      Reserved
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">{vehicle.name}</h1>
                <div className="text-3xl font-bold text-foreground mb-8">{vehicle.price}</div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-4 border border-border">
                    <Calendar className="size-6 text-emerald-500 mb-2" />
                    <span className="text-sm text-muted-foreground">Year</span>
                    <span className="font-semibold">{vehicle.year}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-4 border border-border">
                    <Gauge className="size-6 text-blue-500 mb-2" />
                    <span className="text-sm text-muted-foreground">Driven</span>
                    <span className="font-semibold">{vehicle.kmDriven}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-4 border border-border">
                    <Fuel className="size-6 text-yellow-500 mb-2" />
                    <span className="text-sm text-muted-foreground">Fuel</span>
                    <span className="font-semibold">{vehicle.fuelType}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-4 border border-border">
                    <Settings2 className="size-6 text-violet-500 mb-2" />
                    <span className="text-sm text-muted-foreground">Trans.</span>
                    <span className="font-semibold">{vehicle.transmission}</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 border-b border-border pb-2">Vehicle Overview</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div className="flex justify-between pr-4"><span className="text-muted-foreground">Ownership</span> <span className="font-medium">{vehicle.ownership} Owner</span></div>
                    <div className="flex justify-between pr-4"><span className="text-muted-foreground">Color</span> <span className="font-medium">{vehicle.color || 'N/A'}</span></div>
                    <div className="flex justify-between pr-4"><span className="text-muted-foreground">Variant</span> <span className="font-medium">{vehicle.variant || 'N/A'}</span></div>
                    <div className="flex justify-between pr-4"><span className="text-muted-foreground">RTO</span> <span className="font-medium flex items-center gap-1"><MapPin className="size-3" /> {vehicle.registrationState || 'N/A'}</span></div>
                  </div>
                </div>

                {vehicle.features && vehicle.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b border-border pb-2">Key Features</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {vehicle.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="size-4 text-emerald-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {vehicle.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b border-border pb-2">Description</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{vehicle.description}</p>
                  </div>
                )}
                
                {isReserved && !isSold && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="size-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-500 mb-1">This vehicle is currently reserved</h4>
                      <p className="text-sm text-amber-500/80">However, you can still place a reservation to be added to the waitlist in case the current reservation falls through.</p>
                    </div>
                  </div>
                )}

                {!isSold && (
                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <Dialog open={reserveModalOpen} onOpenChange={setReserveModalOpen}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="flex-1 h-12 text-base font-semibold">
                          Reserve Vehicle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Reserve {vehicle.name}</DialogTitle>
                          <DialogDescription>
                            Enter your details to join the reservation queue. No account required.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleReserve} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="rName">Full Name *</Label>
                            <Input id="rName" required value={rName} onChange={e => setRName(e.target.value)} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="rPhone">Mobile Number *</Label>
                              <Input id="rPhone" type="tel" required value={rPhone} onChange={e => setRPhone(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="rCity">City *</Label>
                              <Input id="rCity" required value={rCity} onChange={e => setRCity(e.target.value)} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rEmail">Email Address (Optional)</Label>
                            <Input id="rEmail" type="email" value={rEmail} onChange={e => setREmail(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rMessage">Message (Optional)</Label>
                            <Textarea id="rMessage" className="resize-none" value={rMessage} onChange={e => setRMessage(e.target.value)} />
                          </div>
                          <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Reservation"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={testDriveModalOpen} onOpenChange={setTestDriveModalOpen}>
                      <DialogTrigger asChild>
                        <Button size="lg" variant="outline" className="flex-1 h-12 text-base font-semibold border-emerald-500 text-emerald-500 hover:bg-emerald-500/10">
                          Book Test Drive
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Book Test Drive</DialogTitle>
                          <DialogDescription>
                            Schedule a test drive for the {vehicle.name}.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleTestDrive} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="tdName">Full Name *</Label>
                            <Input id="tdName" required value={tdName} onChange={e => setTdName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tdPhone">Phone Number *</Label>
                            <Input id="tdPhone" type="tel" required value={tdPhone} onChange={e => setTdPhone(e.target.value)} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="tdDate">Preferred Date *</Label>
                              <Input id="tdDate" type="date" required value={tdDate} onChange={e => setTdDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tdTime">Preferred Time *</Label>
                              <Input id="tdTime" type="time" required value={tdTime} onChange={e => setTdTime(e.target.value)} />
                            </div>
                          </div>
                          <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? "Submitting..." : "Confirm Booking"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                
                {!isSold && (
                  <Button 
                    onClick={handleWhatsApp} 
                    size="lg" 
                    className="w-full h-12 text-base font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 mt-4"
                  >
                    <MessageCircle className="size-5" /> Chat on WhatsApp
                  </Button>
                )}
              </FadeIn>
              
              {!isSold && (
                <FadeIn delay={0.3} className="mt-12 bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Inquiry</h3>
                  {inquirySuccess ? (
                    <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl flex items-center gap-2">
                      <Check className="size-5" /> Inquiry sent successfully. We'll contact you soon!
                    </div>
                  ) : (
                    <form onSubmit={handleInquiry} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="iName">Name *</Label>
                          <Input id="iName" required value={iName} onChange={e => setIName(e.target.value)} placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="iPhone">Phone Number *</Label>
                          <Input id="iPhone" type="tel" required value={iPhone} onChange={e => setIPhone(e.target.value)} placeholder="Your phone number" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="iMessage">Message *</Label>
                        <Textarea id="iMessage" required value={iMessage} onChange={e => setIMessage(e.target.value)} placeholder="I am interested in this vehicle..." rows={3} />
                      </div>
                      <Button type="submit" disabled={inquirySubmitting} variant="secondary" className="w-full">
                        {inquirySubmitting ? "Sending..." : "Send Inquiry"}
                      </Button>
                    </form>
                  )}
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
