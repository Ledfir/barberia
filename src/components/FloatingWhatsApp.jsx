import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion, isMobile } from "@/lib/gsap";
import { barberConfig } from "@/config/barberConfig";
import { isPreloaderDone, PRELOADER_DONE_EVENT } from "@/lib/preloaderGate";

// Icono oficial de WhatsApp (glifo simple-icons, 24x24)
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Botón flotante de WhatsApp con animaciones GSAP y tooltip elegante.
export default function FloatingWhatsApp() {
  const root = useRef(null);
  const btnRef = useRef(null);
  const iconRef = useRef(null);
  const tipRef = useRef(null);

  const { whatsapp, whatsappMessage, whatsappTooltip } = barberConfig.contact;
  const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const mobile = isMobile();

      // Estado inicial del tooltip (centrado vertical + desplazado)
      gsap.set(tipRef.current, { opacity: 0, x: 12, yPercent: -50 });

      if (reduce) {
        gsap.set(root.current, { opacity: 1, scale: 1 });
        return;
      }

      // Entrada coordinada con la salida del preloader
      let entrance = null;
      let removeListener = null;
      const playEntrance = () => {
        entrance = gsap.from(root.current, {
          opacity: 0,
          scale: 0.6,
          duration: 0.7,
          ease: "back.out(1.7)",
        });
      };
      if (isPreloaderDone()) {
        playEntrance();
      } else {
        const handler = () => playEntrance();
        window.addEventListener(PRELOADER_DONE_EVENT, handler, { once: true });
        removeListener = () => window.removeEventListener(PRELOADER_DONE_EVENT, handler);
      }

      // Flotación vertical muy sutil
      const float = gsap.to(btnRef.current, {
        y: mobile ? -4 : -6,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Pulse suave y ocasional
      const ring = root.current.querySelector(".wa-ring");
      const pulse = gsap.fromTo(
        ring,
        { scale: 1, opacity: 0.4 },
        {
          scale: 1.55,
          opacity: 0,
          duration: 1.6,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: mobile ? 4 : 2.6,
        }
      );

      // Se aparta discretamente cuando la sección de reservaciones está en pantalla
      const recede = ScrollTrigger.create({
        trigger: "#reservaciones",
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => {
          gsap.to(root.current, {
            opacity: self.isActive ? 0.55 : 1,
            scale: self.isActive ? 0.88 : 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      });

      return () => {
        float.kill();
        pulse.kill();
        recede.kill();
        if (entrance) entrance.kill();
        if (removeListener) removeListener();
      };
    },
    { scope: root }
  );

  const handleEnter = () => {
    if (prefersReducedMotion()) {
      // Sin animación, pero el tooltip sigue funcionando.
      if (tipRef.current) tipRef.current.style.opacity = "1";
      return;
    }
    gsap.to(btnRef.current, { scale: 1.12, duration: 0.35, ease: "power3.out" });
    gsap.to(iconRef.current, { rotate: 8, duration: 0.4, ease: "power3.out" });
    gsap.to(tipRef.current, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" });
  };

  const handleLeave = () => {
    if (prefersReducedMotion()) {
      if (tipRef.current) tipRef.current.style.opacity = "0";
      return;
    }
    gsap.to(btnRef.current, { scale: 1, duration: 0.35, ease: "power3.out" });
    gsap.to(iconRef.current, { rotate: 0, duration: 0.4, ease: "power3.out" });
    gsap.to(tipRef.current, { opacity: 0, x: 12, duration: 0.3, ease: "power2.in" });
  };

  return (
    <div
      ref={root}
      className="fixed z-50"
      style={{
        right: "calc(1.25rem + env(safe-area-inset-right, 0px))",
        bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <a
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      >
        <span className="wa-ring pointer-events-none absolute inset-0 rounded-full border border-[#25D366]" />
        <span ref={iconRef} className="relative flex">
          <WhatsAppIcon className="h-7 w-7" />
        </span>

        {/* Tooltip: solo escritorio (en móvil no depende de hover) */}
        <span
          ref={tipRef}
          className="pointer-events-none absolute right-full top-1/2 mr-3 hidden whitespace-nowrap rounded-md bg-[#111111] px-3 py-2 text-xs text-white shadow-lg lg:block"
        >
          {whatsappTooltip}
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-[#111111]" />
        </span>
      </a>
    </div>
  );
}