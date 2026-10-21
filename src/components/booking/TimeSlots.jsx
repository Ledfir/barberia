import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";
import { getDisponibilidad } from "@/services/disponibilidad";
import { Loader2, Clock } from "lucide-react";

// Convierte "14:30" a formato 12h legible (02:30 PM)
function to12h(hora) {
  const [h, m] = hora.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

export default function TimeSlots({ fecha, servicioId, barberoId }) {
  const ref = useRef(null);
  const { hora, selectHora, setStep } = useBooking();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getDisponibilidad({ fecha, servicioId, barberoId })
      .then((data) => {
        if (!cancelled) setSlots(data.slots || []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Error al consultar disponibilidad");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fecha, servicioId, barberoId]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".slot", { y: 20, opacity: 0, duration: 0.5, stagger: 0.04, ease: "power3.out" });
    },
    { scope: ref, dependencies: [loading] }
  );

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-bone/50 py-6">
        <Loader2 className="animate-spin text-champagne" size={20} />
        <span className="text-sm">Consultando horarios disponibles…</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-400 py-4">{error}</p>;
  }

  const disponibles = slots.filter((s) => s.disponible);

  return (
    <div ref={ref}>
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-champagne" />
        <p className="text-sm text-bone/70">
          {disponibles.length} horarios disponibles
        </p>
      </div>

      {disponibles.length === 0 ? (
        <p className="text-sm text-bone/50 py-4">
          No hay horarios disponibles para esta fecha. Intenta con otro día.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {slots.map((s) => {
            const sel = hora === s.hora;
            return (
              <button
                key={s.hora}
                disabled={!s.disponible}
                onClick={() => selectHora(s.hora)}
                className={`slot py-3 text-sm border transition-all duration-300 ${
                  sel
                    ? "bg-champagne text-[#080808] border-champagne font-medium"
                    : s.disponible
                    ? "border-white/10 text-bone/80 hover:border-champagne hover:text-champagne"
                    : "border-white/5 text-bone/20 line-through cursor-not-allowed"
                }`}
              >
                {to12h(s.hora)}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-between pt-8">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-4 border border-bone/20 text-bone text-xs uppercase tracking-[0.25em] hover:border-bone transition-colors"
        >
          Atrás
        </button>
        <button
          disabled={!hora}
          onClick={() => setStep(3)}
          className="px-8 py-4 bg-champagne text-[#080808] text-xs uppercase tracking-[0.25em] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bone transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}