import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, splitWords, prefersReducedMotion, isMobile } from "@/lib/gsap";
import { preloaderReady } from "@/lib/preloaderGate";
import { barberConfig } from "@/config/barberConfig";
import { Image } from "@/components/ui/image";

export default function Hero() {
  const container = useRef(null);
  const titleRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Revelado palabra por palabra del título
      const words = splitWords(titleRef.current);
      gsap.set(words, { yPercent: 110, opacity: 0 });

      // La entrada del hero espera a que el preloader se retire (coordinado).
      const tl = gsap.timeline({ paused: true, delay: 0.4 });
      tl.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
      })
        .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.2)
        .from(".hero-sub", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.6)
        .from(".hero-desc", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.8)
        .from(".hero-cta", { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }, 1)
        .from(".hero-image", { scale: 1.15, opacity: 0, duration: 1.6, ease: "power3.out" }, 0)
        .from(".hero-meta", { opacity: 0, duration: 1, ease: "power2.out" }, 1.2);

      preloaderReady.then(() => tl.play());

      // Parallax suave de la imagen al hacer scroll
      if (!isMobile()) {
        gsap.to(".hero-image-wrap", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to(titleRef.current, {
          yPercent: -12,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Indicador de scroll
      gsap.to(".scroll-indicator", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "power1.inOut",
      });
    },
    { scope: container }
  );

  const scrollTo = (sel) => {
    const el = document.querySelector(sel);
    if (el) {
      if (prefersReducedMotion()) el.scrollIntoView({ behavior: "smooth" });
      else
        gsap.to(window, {
          duration: 1.1,
          ease: "power3.inOut",
          scrollTo: { y: el },
        });
    }
  };

  return (
    <section
      id="hero"
      ref={container}
      className="relative min-h-screen w-full overflow-hidden bg-[#080808] flex items-end"
    >
      {/* Imagen de fondo a sangre completa (composición cinematográfica) */}
      <div className="hero-image-wrap absolute inset-0">
        <div className="hero-image relative w-full h-full">
          <Image
            src={barberConfig.images.hero}
            alt="Barbero maestro trabajando con navaja"
            fittingType="cover"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Overlay para legibilidad del texto a la izquierda */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-[#080808]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
      </div>

      {/* Texto a la izquierda */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-24 lg:pb-32 pt-32">
        <div className="max-w-xl">
          <p className="hero-eyebrow eyebrow mb-6">01 — Atelier Barber</p>
          <h1
            ref={titleRef}
            className="font-heading text-[14vw] leading-[0.95] sm:text-7xl lg:text-8xl xl:text-[8.5rem] text-bone tracking-tight"
          >
            MORE THAN A HAIRCUT.
          </h1>
          <p className="hero-sub mt-8 text-lg lg:text-xl text-bone/80 font-heading italic">
            Estilo, precisión y carácter en cada corte.
          </p>
          <p className="hero-desc mt-4 max-w-md text-sm lg:text-base text-bone/60 leading-relaxed">
            Una experiencia de barbería diseñada para quienes cuidan cada detalle de su imagen.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo("#reservaciones")}
              className="hero-cta px-8 py-4 bg-champagne text-[#080808] text-xs uppercase tracking-[0.25em] font-medium hover:bg-bone transition-colors duration-300"
            >
              Reservar mi cita
            </button>
            <button
              onClick={() => scrollTo("#servicios")}
              className="hero-cta px-8 py-4 border border-bone/30 text-bone text-xs uppercase tracking-[0.25em] hover:border-champagne hover:text-champagne transition-colors duration-300"
            >
              Descubrir servicios
            </button>
          </div>
        </div>
      </div>

      {/* Meta lateral derecha */}
      <div className="hero-meta hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-bone/40 [writing-mode:vertical-rl] rotate-180">
          Est. 2026 · San Pedro Garza García
        </span>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-bone/40">Scroll</span>
        <div className="scroll-indicator w-px h-10 bg-gradient-to-b from-champagne to-transparent" />
      </div>
    </section>
  );
}