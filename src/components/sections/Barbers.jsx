import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";
import { getBarberos } from "@/services/barberos";
import { Image } from "@/components/ui/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRight } from "lucide-react";

export default function Barbers() {
  const ref = useRef(null);
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { preselectBarbero } = useBooking();

  useEffect(() => {
    getBarberos()
      .then(setBarberos)
      .catch(() => setBarberos([]))
      .finally(() => setLoading(false));
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".barber-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    },
    { scope: ref }
  );

  const reservar = (b) => {
    preselectBarbero(b);
    const el = document.querySelector("#reservaciones");
    if (el) {
      if (prefersReducedMotion()) el.scrollIntoView({ behavior: "smooth" });
      else gsap.to(window, { duration: 1.1, ease: "power3.inOut", scrollTo: { y: el } });
    }
  };

  return (
    <section ref={ref} className="relative py-24 lg:py-40 bg-[#080808] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader index="06 —" eyebrow="Nuestro equipo" title="Maestros del oficio." className="mb-16" />

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-[#111111] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {barberos.map((b) => (
              <article key={b.id} className="barber-card group">
                <div className="relative aspect-[4/5] overflow-hidden mb-6">
                  <Image
                    src={b.imagen}
                    alt={b.nombre}
                    fittingType="cover"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] text-champagne">
                    0{b.id}
                  </span>
                </div>
                <h3 className="font-heading text-2xl text-bone">{b.nombre}</h3>
                <p className="text-champagne text-xs uppercase tracking-[0.2em] mt-1 mb-3">
                  {b.especialidad}
                </p>
                <p className="text-sm text-bone/60 leading-relaxed mb-6">{b.descripcion}</p>
                <button
                  onClick={() => reservar(b)}
                  className="inline-flex items-center gap-2 text-bone text-xs uppercase tracking-[0.2em] border-b border-bone/20 hover:border-champagne hover:text-champagne transition-colors pb-1"
                >
                  Reservar con él <ArrowRight size={14} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}