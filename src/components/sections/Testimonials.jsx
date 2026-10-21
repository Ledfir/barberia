import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { mockTestimonios } from "@/data/mockData";
import SectionHeader from "@/components/ui/SectionHeader";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".test-reveal", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    },
    { scope: ref }
  );

  // Transición GSAP al cambiar de testimonio
  useEffect(() => {
    if (prefersReducedMotion() || !trackRef.current) return;
    gsap.fromTo(
      trackRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
    );
  }, [active]);

  const t = mockTestimonios[active];

  return (
    <section ref={ref} className="relative py-24 lg:py-40 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <SectionHeader index="07 —" eyebrow="Testimonios" title="Lo que dicen nuestros clientes." align="center" className="mb-16" />

        <div ref={trackRef} className="test-reveal">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < t.calificacion ? "fill-champagne text-champagne" : "text-bone/20"}
              />
            ))}
          </div>
          <blockquote className="font-heading text-2xl lg:text-3xl text-bone/90 leading-relaxed italic mb-8">
            “{t.comentario}”
          </blockquote>
          <p className="text-xs uppercase tracking-[0.3em] text-champagne">{t.nombre}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-bone/40 mt-1">Cliente demostración</p>
        </div>

        <div className="test-reveal flex items-center justify-center gap-6 mt-12">
          <button
            onClick={() => setActive((a) => (a - 1 + mockTestimonios.length) % mockTestimonios.length)}
            className="w-12 h-12 border border-bone/15 flex items-center justify-center text-bone hover:border-champagne hover:text-champagne transition-colors"
            aria-label="Anterior testimonio"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {mockTestimonios.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 transition-all duration-300 ${
                  i === active ? "w-8 bg-champagne" : "w-4 bg-bone/20"
                }`}
                aria-label={`Ir a testimonio ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setActive((a) => (a + 1) % mockTestimonios.length)}
            className="w-12 h-12 border border-bone/15 flex items-center justify-center text-bone hover:border-champagne hover:text-champagne transition-colors"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}