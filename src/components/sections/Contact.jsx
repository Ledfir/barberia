import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { barberConfig } from "@/config/barberConfig";
import SectionHeader from "@/components/ui/SectionHeader";
import { MapPin, Phone, Clock, Instagram, Facebook, Navigation } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".contact-reveal", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    },
    { scope: ref }
  );

  const c = barberConfig.contact;

  return (
    <section id="contacto" ref={ref} className="relative py-24 lg:py-40 bg-[#080808] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader index="09 —" eyebrow="Ubicación & Contacto" title="Visítanos." className="mb-16" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Info */}
          <div className="space-y-8">
            <div className="contact-reveal flex items-start gap-4">
              <MapPin className="text-champagne shrink-0 mt-1" size={22} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-bone/40 mb-1">Dirección</p>
                <p className="text-bone/80">{c.address}</p>
              </div>
            </div>

            <div className="contact-reveal flex items-start gap-4">
              <Phone className="text-champagne shrink-0 mt-1" size={22} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-bone/40 mb-1">Teléfono / WhatsApp</p>
                <a href={`tel:${c.phone}`} className="text-bone/80 hover:text-champagne transition-colors block">
                  {c.phone}
                </a>
                <a
                  href={`https://wa.me/${c.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-champagne text-sm hover:underline"
                >
                  Escribir por WhatsApp
                </a>
              </div>
            </div>

            <div className="contact-reveal flex items-start gap-4">
              <Clock className="text-champagne shrink-0 mt-1" size={22} />
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-bone/40 mb-3">Horarios</p>
                <ul className="space-y-1.5">
                  {barberConfig.schedule.map((s) => (
                    <li key={s.day} className="flex justify-between text-sm text-bone/70 max-w-xs">
                      <span>{s.day}</span>
                      <span className={s.hours === "Cerrado" ? "text-bone/30" : "text-bone/80"}>{s.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="contact-reveal flex items-center gap-4">
              <a href={c.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 border border-bone/15 flex items-center justify-center text-bone hover:border-champagne hover:text-champagne transition-colors">
                <Instagram size={18} />
              </a>
              <a href={c.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 border border-bone/15 flex items-center justify-center text-bone hover:border-champagne hover:text-champagne transition-colors">
                <Facebook size={18} />
              </a>
            </div>

            <a
              href={c.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-reveal inline-flex items-center gap-2 px-8 py-4 bg-champagne text-[#080808] text-xs uppercase tracking-[0.25em] font-medium hover:bg-bone transition-colors"
            >
              <Navigation size={16} /> Cómo llegar
            </a>
          </div>

          {/* Mapa */}
          <div className="contact-reveal relative h-[400px] lg:h-full min-h-[400px] border border-white/10 overflow-hidden">
            <iframe
              title="Ubicación de la barbería"
              src={c.mapEmbed}
              className="w-full h-full grayscale invert opacity-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}