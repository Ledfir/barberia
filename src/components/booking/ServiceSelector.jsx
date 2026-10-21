import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";
import { getServicios } from "@/services/servicios";
import { Image } from "@/components/ui/image";
import { Clock, Check } from "lucide-react";

export default function ServiceSelector() {
  const ref = useRef(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { servicio, selectServicio, setStep } = useBooking();

  useEffect(() => {
    getServicios()
      .then(setServicios)
      .catch(() => setServicios([]))
      .finally(() => setLoading(false));
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".opt", {
        x: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="space-y-3">
      <p className="text-sm text-bone/50 mb-6">Selecciona el servicio que deseas reservar.</p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-[#111111] animate-pulse" />
          ))}
        </div>
      ) : (
        servicios.map((s) => {
          const selected = servicio?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => selectServicio(s)}
              className={`opt w-full flex items-center gap-4 p-5 border text-left transition-all duration-300 ${
                selected
                  ? "border-champagne bg-champagne/5"
                  : "border-white/10 hover:border-bone/30 bg-[#111111]"
              }`}
            >
              <div className="w-16 h-16 shrink-0 overflow-hidden">
                <Image src={s.imagen} alt={s.nombre} fittingType="cover" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xl text-bone">{s.nombre}</p>
                <p className="text-xs text-bone/50 truncate">{s.descripcion}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="flex items-center gap-1 text-[11px] text-bone/40 justify-end mb-1">
                  <Clock size={12} /> {s.duracion} min
                </p>
                <p className="font-heading text-2xl text-champagne">${s.precio}</p>
              </div>
              <div className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                selected ? "bg-champagne border-champagne" : "border-bone/30"
              }`}>
                {selected && <Check size={14} className="text-[#080808]" />}
              </div>
            </button>
          );
        })
      )}

      <div className="flex justify-end pt-6">
        <button
          disabled={!servicio}
          onClick={() => setStep(1)}
          className="px-8 py-4 bg-champagne text-[#080808] text-xs uppercase tracking-[0.25em] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bone transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}