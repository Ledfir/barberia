import { BookingProvider } from "@/context/BookingContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Gallery from "@/components/sections/Gallery";
import Barbers from "@/components/sections/Barbers";
import Booking from "@/components/sections/Booking";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

// One Page completa de la barbería premium.
export default function BarberPage() {
  return (
    <BookingProvider>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Experience />
        <Gallery />
        <Barbers />
        <Booking />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </BookingProvider>
  );
}