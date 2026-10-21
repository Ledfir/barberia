import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { barberConfig } from "@/config/barberConfig";
import { releasePreloader } from "@/lib/preloaderGate";

// Se muestra solo en la carga inicial (no al navegar entre secciones).
let hasShown = false;

// Preloader cinematográfico: aparece una única vez y espera los recursos
// críticos del hero (fuentes + imagen principal), nunca un tiempo artificial.
export default function Preloader() {
  const root = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (hasShown) {
      setHidden(true);
      releasePreloader();
      return;
    }
    hasShown = true;

    const el = root.current;
    const prefersReduced = prefersReducedMotion();
    const prevOverflow = document.body.style.overflow;
    // Bloquea el scroll mientras el preloader está activo.
    document.body.style.overflow = "hidden";

    let finished = false;
    const restoreScroll = () => {
      document.body.style.overflow = prevOverflow || "";
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(maxTimer);
      restoreScroll();
      releasePreloader();
      requestAnimationFrame(() => ScrollTrigger.refresh());

      if (prefersReduced || !el) {
        setHidden(true);
        return;
      }

      // Salida elegante: el logo sube y el overlay se cierra con clip-path.
      gsap
        .timeline({ onComplete: () => setHidden(true) })
        .to(".preloader-logo", { y: -18, duration: 0.5, ease: "power2.inOut" }, 0)
        .to(".preloader-fade", { opacity: 0, y: -12, duration: 0.5, ease: "power2.in" }, 0)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "power4.inOut" }, 0.3);
    };

    // Failsafe: un error de carga jamás deja el sitio bloqueado.
    const maxTimer = setTimeout(finish, 6000);

    if (prefersReduced || !el) {
      finish();
      return () => restoreScroll();
    }

    // --- Progreso real (0% → 100%) ---
    const state = { p: 0 };
    const render = () => {
      if (counterRef.current) counterRef.current.textContent = `${Math.round(state.p)}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${state.p / 100})`;
    };
    const setProgress = (target) => {
      gsap.to(state, { p: target, duration: 0.7, ease: "power2.out", onUpdate: render });
    };

    // --- Secuencia de entrada ---
    let resolveIntro;
    const introDone = new Promise((r) => {
      resolveIntro = r;
    });
    const intro = gsap.timeline({ onComplete: resolveIntro });
    intro
      .from(".preloader-logo", { opacity: 0, scale: 0.92, duration: 1, ease: "power3.out" })
      .from(".preloader-tagline", { opacity: 0, y: 14, duration: 0.9, ease: "power3.out" }, "-=0.55")
      .from(".preloader-progress", { opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.45");

    setProgress(12);

    // --- Recursos críticos: fuentes + imagen del hero (no las secciones bajas) ---
    const resources = [
      typeof document !== "undefined" && document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve(),
      new Promise((resolve) => {
        const img = new window.Image();
        img.onload = resolve;
        img.onerror = resolve; // un error no bloquea
        img.src = barberConfig.images.hero;
      }),
    ];

    let loaded = 0;
    resources.forEach((p) =>
      p.then(() => {
        loaded += 1;
        setProgress(Math.round((loaded / resources.length) * 100));
      })
    );

    let hold;
    Promise.all([introDone, Promise.all(resources)]).then(() => {
      hold = gsap.delayedCall(0.4, finish);
    });

    return () => {
      clearTimeout(maxTimer);
      if (hold) hold.kill();
      intro.kill();
      restoreScroll();
      releasePreloader();
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080808]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div className="preloader-fade flex flex-col items-center px-6">
        <div className="preloader-logo text-center">
          <div className="font-heading text-4xl sm:text-6xl tracking-[0.18em] text-bone">
            {barberConfig.logoText}
            <span className="ml-3 text-champagne">{barberConfig.logoAccent}</span>
          </div>
        </div>

        <p className="preloader-tagline mt-6 text-[10px] uppercase tracking-[0.4em] text-bone/50 sm:text-xs">
          THE EXPERIENCE STARTS HERE
        </p>

        <div className="preloader-progress mt-10 w-56 sm:w-72">
          <div className="h-px w-full overflow-hidden bg-bone/15">
            <div
              ref={barRef}
              className="h-px w-full origin-left bg-champagne"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.3em] text-bone/40">
            <span>Cargando</span>
            <span ref={counterRef} className="text-champagne">
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}