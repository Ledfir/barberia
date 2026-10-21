import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, isMobile } from "@/lib/gsap";
import { barberConfig } from "@/config/barberConfig";
import { Image } from "@/components/ui/image";
import SectionHeader from "@/components/ui/SectionHeader";

export default function About() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".about-img", {
        scale: 1.2,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from(".about-text", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      if (!isMobile()) {
        gsap.to(".about-img-wrap", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }
    },
    { scope: ref }
  );

  const scrollTo = (sel) => {
    const el = document.querySelector(sel);
    if (el) {
      if (prefersReducedMotion()) el.scrollIntoView({ behavior: "smooth" });
      else gsap.to(window, { duration: 1.1, ease: "power3.inOut", scrollTo: { y: el } });
    }
  };

  return (
    <section id="nosotros" ref={ref} className="relative py-24 lg:py-40 bg-[#080808] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Imagen vertical */}
          <div className="relative aspect-[4/5] overflow-hidden order-2 lg:order-1">
            <div className="about-img-wrap absolute inset-0">
              <div className="about-img relative w-full h-full">
                <Image
                  src={barberConfig.images.about}
                  alt="Barbero profesional en el establecimiento"
                  fittingType="cover"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-champagne/30 z-10 hidden lg:block" />
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <SectionHeader index="02 —" eyebrow="Nosotros" title="El arte de verte bien." />
            <div className="about-text mt-8 space-y-5 text-bone/70 text-base lg:text-lg leading-relaxed max-w-lg">
              <p>
                En Atelier Barber no cortamos cabello: esculpimos identidad. Cada sesión es un
                ritual donde la precisión, la técnica y el carácter se encuentran.
              </p>
              <p>
                Trabajamos con herramientas de alta gama, productos premium y un ambiente
                diseñado para que tu momento sea tan impecable como el resultado.
              </p>
            </div>

            <div className="about-text mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "8+", l: "Años de oficio" },
                { n: "5K+", l: "Clientes satisfechos" },
                { n: "100%", l: "Atención personalizada" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-heading text-3xl lg:text-4xl text-champagne">{s.n}</p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-bone/50 mt-1">{s.l}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollTo("#reservaciones")}
              className="about-text mt-10 inline-flex items-center px-8 py-4 border border-champagne/60 text-champagne text-xs uppercase tracking-[0.25em] hover:bg-champagne hover:text-[#080808] transition-all duration-300"
            >
              Reservar mi cita
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}