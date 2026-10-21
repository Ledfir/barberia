import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { barberConfig } from "@/config/barberConfig";
import { Instagram, Facebook, ArrowUp } from "lucide-react";

export default function Footer() {
  const ref = useRef(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".footer-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
      });
    },
    { scope: ref }
  );

  const scrollTop = () => {
    if (prefersReducedMotion()) window.scrollTo({ top: 0 });
    else gsap.to(window, { duration: 1.2, ease: "power3.inOut", scrollTo: { y: 0 } });
  };

  const nav = (sel) => {
    const el = document.querySelector(sel);
    if (el) {
      if (prefersReducedMotion()) el.scrollIntoView({ behavior: "smooth" });
      else gsap.to(window, { duration: 1.1, ease: "power3.inOut", scrollTo: { y: el } });
    }
  };

  return (
    <footer ref={ref} className="relative bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Marca */}
          <div className="lg:col-span-2 footer-reveal">
            <button onClick={scrollTop} className="flex items-baseline gap-1 mb-5">
              <span className="font-heading text-2xl tracking-[0.2em] text-bone">{barberConfig.logoText}</span>
              <span className="font-heading text-2xl tracking-[0.2em] text-champagne">{barberConfig.logoAccent}</span>
            </button>
            <p className="text-bone/50 text-sm leading-relaxed max-w-sm">
              {barberConfig.tagline} Una experiencia de barbería premium donde la precisión se convierte
              en identidad.
            </p>
            <div className="flex gap-3 mt-6">
              <a href={barberConfig.contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 border border-bone/15 flex items-center justify-center text-bone/70 hover:border-champagne hover:text-champagne transition-colors">
                <Instagram size={16} />
              </a>
              <a href={barberConfig.contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 border border-bone/15 flex items-center justify-center text-bone/70 hover:border-champagne hover:text-champagne transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="footer-reveal">
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne mb-5">Navegación</p>
            <ul className="space-y-3">
              {[
                { l: "Inicio", t: "#hero" },
                { l: "Nosotros", t: "#nosotros" },
                { l: "Servicios", t: "#servicios" },
                { l: "Galería", t: "#galeria" },
                { l: "Reservaciones", t: "#reservaciones" },
                { l: "Contacto", t: "#contacto" },
              ].map((i) => (
                <li key={i.t}>
                  <button onClick={() => nav(i.t)} className="text-bone/60 hover:text-champagne text-sm transition-colors">
                    {i.l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div className="footer-reveal">
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne mb-5">Horarios</p>
            <ul className="space-y-2">
              {barberConfig.schedule.map((s) => (
                <li key={s.day} className="text-sm text-bone/60 flex justify-between gap-4">
                  <span>{s.day}</span>
                  <span className={s.hours === "Cerrado" ? "text-bone/30" : "text-bone/80"}>{s.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-reveal pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-bone/40">
            © {year} {barberConfig.name}. Todos los derechos reservados.
          </p>
          <button
            onClick={scrollTop}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bone/50 hover:text-champagne transition-colors"
          >
            Volver al inicio <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}