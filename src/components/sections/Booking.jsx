import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";
import { IS_DEMO } from "@/services/api";
import SectionHeader from "@/components/ui/SectionHeader";
import ServiceSelector from "@/components/booking/ServiceSelector";
import BarberSelector from "@/components/booking/BarberSelector";
import BookingCalendar from "@/components/booking/BookingCalendar";
import CustomerForm from "@/components/booking/CustomerForm";
import BookingSummary from "@/components/booking/BookingSummary";

const STEPS = [
  { label: "Servicio", n: "01" },
  { label: "Barbero", n: "02" },
  { label: "Fecha y Hora", n: "03" },
  { label: "Tus Datos", n: "04" },
  { label: "Confirmación", n: "05" },
];

export default function Booking() {
  const ref = useRef(null);
  const stepRef = useRef(null);
  const { step, setStep } = useBooking();

  // Transición entre pasos (slide + fade)
  useEffect(() => {
    if (prefersReducedMotion() || !stepRef.current) return;
    gsap.fromTo(
      stepRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [step]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".booking-progress", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    },
    { scope: ref }
  );

  const renderStep = () => {
    switch (step) {
      case 0: return <ServiceSelector />;
      case 1: return <BarberSelector />;
      case 2: return <BookingCalendar />;
      case 3: return <CustomerForm />;
      case 4: return <BookingSummary />;
      default: return null;
    }
  };

  return (
    <section id="reservaciones" ref={ref} className="relative py-24 lg:py-40 bg-[#080808] overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <SectionHeader index="08 —" eyebrow="Reservaciones" title="Agenda tu momento." align="center" className="mb-4" />
        {IS_DEMO && (
          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-champagne/70 mb-12">
            · Modo demostración activo
          </p>
        )}

        {/* Indicador de progreso */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={`flex flex-col items-center gap-2 transition-opacity ${i > step ? "opacity-30" : ""}`}
              >
                <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition-all duration-300 ${
                  i === step
                    ? "bg-champagne border-champagne text-[#080808] font-medium"
                    : i < step
                    ? "border-champagne text-champagne"
                    : "border-bone/20 text-bone/40"
                }`}>
                  {i < step ? "✓" : s.n}
                </span>
                <span className={`text-[10px] uppercase tracking-[0.1em] hidden sm:block ${i === step ? "text-champagne" : "text-bone/40"}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
          {/* Barra de progreso */}
          <div className="h-px bg-bone/10 relative">
            <div
              className="booking-progress absolute top-0 left-0 h-full bg-champagne transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenido del paso */}
        <div ref={stepRef} key={step}>
          {renderStep()}
        </div>
      </div>
    </section>
  );
}