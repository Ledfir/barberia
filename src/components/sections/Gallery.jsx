import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, isMobile } from "@/lib/gsap";
import { mockGaleria } from "@/data/mockData";
import { Image } from "@/components/ui/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery() {
  const ref = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const lightboxRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".gallery-item", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    },
    { scope: ref }
  );

  // Animación de apertura del lightbox
  useGSAP(
    () => {
      if (!lightbox || !lightboxRef.current) return;
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        ".lightbox-img",
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    },
    { dependencies: [lightbox] }
  );

  const closeLightbox = () => setLightbox(null);
  const next = () => setLightbox((i) => (i + 1) % mockGaleria.length);
  const prev = () => setLightbox((i) => (i - 1 + mockGaleria.length) % mockGaleria.length);

  // Layout asimétrico editorial (alturas variables)
  const heights = ["h-80", "h-64", "h-96", "h-72", "h-80", "h-64"];

  return (
    <section id="galeria" ref={ref} className="relative py-24 lg:py-40 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader index="05 —" eyebrow="Galería" title="El detalle es el oficio." className="mb-16" />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {mockGaleria.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setLightbox(i)}
              className={`gallery-item group relative ${heights[i]} ${i === 0 || i === 3 ? "lg:col-span-2" : ""} overflow-hidden cursor-pointer`}
            >
              <Image
                src={item.imagen}
                alt={item.titulo}
                fittingType="cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[10px] uppercase tracking-[0.2em] text-champagne">{item.categoria}</p>
                <p className="font-heading text-xl text-bone mt-1">{item.titulo}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[80] bg-[#080808]/95 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-bone hover:text-champagne transition-colors"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            <X size={32} />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-bone/70 hover:text-champagne transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Anterior"
          >
            <ChevronLeft size={40} />
          </button>
          <figure className="lightbox-img max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={mockGaleria[lightbox].imagen}
              alt={mockGaleria[lightbox].titulo}
              fittingType="fit"
              className="w-full max-h-[80vh] object-contain"
            />
            <figcaption className="text-center mt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne">
                {mockGaleria[lightbox].categoria}
              </p>
              <p className="font-heading text-2xl text-bone mt-1">{mockGaleria[lightbox].titulo}</p>
            </figcaption>
          </figure>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-bone/70 hover:text-champagne transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Siguiente"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </section>
  );
}