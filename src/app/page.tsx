import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/hero";
import LogoCloud from "@/components/sections/logo-cloud";
import FeaturedVehicles from "@/components/sections/featured-vehicles";
import StatsSection from "@/components/sections/stats-section";
import WhyChooseUs from "@/components/sections/why-choose-us";
import Testimonials from "@/components/sections/testimonials";
import ContactWithGlobe from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-dvh flex-col overflow-hidden">
        <Hero />
        <LogoCloud />
        <StatsSection />
        <WhyChooseUs />
        <FeaturedVehicles />
        <Testimonials />
        <ContactWithGlobe />
      </main>
      <Footer />
    </>
  );
}
