import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, isMobile } from "@/lib/gsap";
import { barberConfig } from "@/config/barberConfig";
import { Image } from "@/components/ui/image";

export default function Experience() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".exp-img", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      gsap.from(".exp-text", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });
      if (!isMobile()) {
        gsap.to(".exp-img-inner", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative py-24 lg:py-40 bg-[#080808] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Texto a la izquierda */}
          <div className="lg:col-span-4 lg:order-1 order-2">
            <p className="exp-text eyebrow mb-5">04 — La experiencia</p>
            <h2 className="exp-text font-heading text-4xl lg:text-5xl text-bone leading-[1.05] mb-6">
              No es solo un corte. Es tu momento.
            </h2>
            <p className="exp-text text-bone/60 leading-relaxed mb-8">
              Un espacio diseñado para desconectar. Bebida de cortesía, música seleccionada y la
              atención de maestros que dominan su oficio.
            </p>
            <div className="exp-text space-y-4">
              {[
                "Ambiente exclusivo y privado",
                "Productos premium y herramientas de alta gama",
                "Atención personalizada de principio a fin",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-bone/70 text-sm">
                  <span className="w-6 h-px bg-champagne" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Imagen grande a la derecha */}
          <div className="lg:col-span-8 lg:order-2 order-1">
            <div className="exp-img relative aspect-[16/10] overflow-hidden">
              <div className="exp-img-inner absolute inset-[-10%]">
                <Image
                  src={barberConfig.images.experience}
                  alt="Interior de la barbería premium"
                  fittingType="cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}