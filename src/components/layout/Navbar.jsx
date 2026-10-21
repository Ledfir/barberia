import { useState, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { barberConfig } from "@/config/barberConfig";

const NAV_LINKS = [
  { label: "Inicio", target: "#hero" },
  { label: "Nosotros", target: "#nosotros" },
  { label: "Servicios", target: "#servicios" },
  { label: "Galería", target: "#galeria" },
  { label: "Reservaciones", target: "#reservaciones" },
  { label: "Contacto", target: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Indicador de sección activa
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.target)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Animación de entrada del navbar
  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.from(navRef.current, {
      y: -30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.2,
    });
  }, []);

  // Animación del menú móvil
  useEffect(() => {
    if (!menuRef.current) return;
    if (prefersReducedMotion()) return;
    if (open) {
      gsap.fromTo(
        menuRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        menuRef.current.querySelectorAll(".mobile-link"),
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.08, delay: 0.2, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [open]);

  const handleNav = (target) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector(target);
      if (el) {
        if (prefersReducedMotion()) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          gsap.to(window, {
            duration: 1.1,
            ease: "power3.inOut",
            scrollTo: { y: el, offsetY: 0 },
          });
        }
      }
    }, open ? 250 : 0);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#080808]/80 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("#hero")}
            className="flex items-baseline gap-1 group"
            aria-label="Inicio"
          >
            <span className="font-heading text-xl tracking-[0.2em] text-bone group-hover:text-champagne transition-colors">
              {barberConfig.logoText}
            </span>
            <span className="font-heading text-xl tracking-[0.2em] text-champagne">
              {barberConfig.logoAccent}
            </span>
          </button>

          {/* Links desktop */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.target}>
                <button
                  onClick={() => handleNav(link.target)}
                  className={`relative text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                    active === link.target
                      ? "text-champagne"
                      : "text-bone/70 hover:text-bone"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-champagne transition-all duration-300 ${
                      active === link.target ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* CTA Reservar o Dashboard */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-champagne/60 text-champagne text-xs uppercase tracking-[0.2em] hover:bg-champagne hover:text-[#080808] transition-all duration-300"
              >
                <User size={16} />
                Panel
              </button>
            ) : (
              <button
                onClick={() => handleNav("#reservaciones")}
                className="inline-flex items-center px-6 py-2.5 border border-champagne/60 text-champagne text-xs uppercase tracking-[0.2em] hover:bg-champagne hover:text-[#080808] transition-all duration-300"
              >
                Reservar Cita
              </button>
            )}
          </div>

          {/* Botón móvil */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-bone"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Menú móvil */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-[#080808]/90 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            ref={menuRef}
            className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-[#111111] border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
              <span className="font-heading text-lg tracking-[0.2em] text-bone">
                {barberConfig.logoText} <span className="text-champagne">{barberConfig.logoAccent}</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="text-bone">
                <X size={24} />
              </button>
            </div>
            <ul className="flex flex-col px-6 py-8 gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.target} className="mobile-link">
                  <button
                    onClick={() => handleNav(link.target)}
                    className={`block w-full text-left py-3 font-heading text-2xl ${
                      active === link.target ? "text-champagne" : "text-bone/80"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-auto px-6 pb-10 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="py-2 text-bone/60 text-xs">
                    Hola, {user?.name || 'Usuario'}
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full py-4 border border-champagne/60 text-champagne text-xs uppercase tracking-[0.2em] font-medium hover:bg-champagne hover:text-[#080808] transition-all"
                  >
                    <User size={16} className="inline mr-2" />
                    Panel de Usuario
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNav("#reservaciones")}
                  className="w-full py-4 bg-champagne text-[#080808] text-xs uppercase tracking-[0.2em] font-medium"
                >
                  Reservar Cita
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}