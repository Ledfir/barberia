import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";
import { getBarberos } from "@/services/barberos";
import { Image } from "@/components/ui/image";
import { Check, Users } from "lucide-react";

export default function BarberSelector() {
  const ref = useRef(null);
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { barbero, selectBarbero, setStep } = useBooking();

  useEffect(() => {
    getBarberos()
      .then(setBarberos)
      .catch(() => setBarberos([]))
      .finally(() => setLoading(false));
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".opt", { x: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
    },
    { scope: ref }
  );

  // "Cualquier barbero" = barbero null
  const isAny = barbero === null;
  // barbero puede be null (cualquier) or an object
  const isSelected = (b) => (barbero === null && b === null) || (barbero && b && barbero.id === b.id);

  return (
    <div ref={ref} className="space-y-3">
      <p className="text-sm text-bone/50 mb-6">Elige con quién prefieres tu cita.</p>

      {/* Opción cualquier barbero */}
      <button
        onClick={() => selectBarbero(null)}
        className={`opt w-full flex items-center gap-4 p-5 border text-left transition-all duration-300 ${
          isAny ? "border-champagne bg-champagne/5" : "border-white/10 hover:border-bone/30 bg-[#111111]"
        }`}
      >
        <div className="w-16 h-16 shrink-0 rounded-full border border-champagne/40 flex items-center justify-center">
          <Users className="text-champagne" size={26} />
        </div>
        <div className="flex-1">
          <p className="font-heading text-xl text-bone">Cualquier barbero disponible</p>
          <p className="text-xs text-bone/50">El backend asignará un profesional libre para tu horario.</p>
        </div>
        <div className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center ${isAny ? "bg-champagne border-champagne" : "border-bone/30"}`}>
          {isAny && <Check size={14} className="text-[#080808]" />}
        </div>
      </button>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-3 pt-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-[#111111] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-3 pt-3">
          {barberos.map((b) => {
            const sel = isSelected(b);
            return (
              <button
                key={b.id}
                onClick={() => selectBarbero(b)}
                className={`opt group p-4 border text-center transition-all duration-300 ${
                  sel ? "border-champagne bg-champagne/5" : "border-white/10 hover:border-bone/30 bg-[#111111]"
                }`}
              >
                <div className="relative w-24 h-24 mx-auto mb-3 overflow-hidden">
                  <Image src={b.imagen} alt={b.nombre} fittingType="cover" className={`w-full h-full object-cover transition-all duration-500 ${sel ? "" : "grayscale group-hover:grayscale-0"}`} />
                  {sel && (
                    <div className="absolute inset-0 bg-champagne/20 flex items-center justify-center">
                      <Check className="text-bone bg-champagne rounded-full p-1" size={28} />
                    </div>
                  )}
                </div>
                <p className="font-heading text-lg text-bone">{b.nombre}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-champagne mt-1">{b.especialidad}</p>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(0)}
          className="px-6 py-4 border border-bone/20 text-bone text-xs uppercase tracking-[0.25em] hover:border-bone transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={() => setStep(2)}
          className="px-8 py-4 bg-champagne text-[#080808] text-xs uppercase tracking-[0.25em] font-medium hover:bg-bone transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}