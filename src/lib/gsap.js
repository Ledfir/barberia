// =============================================================================
// SETUP CENTRAL DE GSAP
// Registra plugins una sola vez y expone helpers reutilizables.
// Respeta prefers-reduced-motion.
// =============================================================================

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger };

// ¿El usuario prefiere movimiento reducido?
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

// Scroll suave a una sección por selector usando GSAP ScrollToPlugin
export function scrollToSection(selector, offset = 0) {
  if (prefersReducedMotion()) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }
  gsap.to(window, {
    duration: 1.1,
    ease: "power3.inOut",
    scrollTo: { y: selector, offsetY: offset },
  });
}

// Revelado de texto palabra por palabra (alternativa ligera a SplitText)
export function splitWords(el) {
  if (!el) return [];
  const text = el.textContent;
  el.textContent = "";
  const words = text.split(" ");
  const wrappers = [];
  words.forEach((word) => {
    const outer = document.createElement("span");
    outer.style.display = "inline-block";
    outer.style.overflow = "hidden";
    outer.style.verticalAlign = "top";
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.textContent = word;
    outer.appendChild(inner);
    el.appendChild(outer);
    el.appendChild(document.createTextNode(" "));
    wrappers.push(inner);
  });
  return wrappers;
}

// Revelado de texto por líneas (divide por líneas de texto)
export function splitLines(el) {
  if (!el) return [];
  const words = splitWords(el);
  return words;
}