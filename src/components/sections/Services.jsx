import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";
import { getServicios } from "@/services/servicios";
import { IS_DEMO } from "@/services/api";
import { Image } from "@/components/ui/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { Clock, ArrowRight } from "lucide-react";

export default function Services() {
  const ref = useRef(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { preselectServicio } = useBooking();

  useEffect(() => {
    getServicios()
      .then(setServicios)
      .catch(() => setServicios([]))
      .finally(() => setLoading(false));
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".service-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    },
    { scope: ref }
  );

  const reservar = (s) => {
    preselectServicio(s);
    const el = document.querySelector("#reservaciones");
    if (el) {
      if (prefersReducedMotion()) el.scrollIntoView({ behavior: "smooth" });
      else gsap.to(window, { duration: 1.1, ease: "power3.inOut", scrollTo: { y: el } });
    }
  };

  return (
    <section id="servicios" ref={ref} className="relative py-24 lg:py-40 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <SectionHeader index="03 —" eyebrow="Servicios & Precios" title="El ritual que elijas." />
          {IS_DEMO && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/70">
              · Modo demostración
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-72 bg-[#111111] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s) => (
              <article
                key={s.id}
                className="service-card group relative overflow-hidden bg-[#111111] border border-white/5 hover:border-champagne/40 transition-colors duration-500"
              >
                {/* Imagen fantasma que cobra vida en hover */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={s.imagen}
                    alt={s.nombre}
                    fittingType="cover"
                    className="w-full h-full object-cover opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] text-champagne">
                    0{s.id}
                  </span>
                </div>

                <div className="p-6 lg:p-7">
                  <h3 className="font-heading text-2xl text-bone mb-2">{s.nombre}</h3>
                  <p className="text-sm text-bone/60 leading-relaxed mb-5 min-h-[3rem]">
                    {s.descripcion}
                  </p>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-bone/50 text-xs">
                      <Clock size={14} />
                      <span>{s.duracion} min</span>
                    </div>
                    <p className="font-heading text-3xl text-champagne">
                      ${s.precio}
                      <span className="text-xs text-bone/40 ml-1 font-body">MXN</span>
                    </p>
                  </div>
                  <button
                    onClick={() => reservar(s)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-bone/15 text-bone text-xs uppercase tracking-[0.2em] hover:bg-champagne hover:text-[#080808] hover:border-champagne transition-all duration-300"
                  >
                    Reservar <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}