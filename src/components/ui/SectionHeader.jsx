import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, splitWords, prefersReducedMotion } from "@/lib/gsap";

// Encabezado de sección reutilizable: eyebrow + título editorial con revelado GSAP
export default function SectionHeader({ index, eyebrow, title, align = "left", className = "" }) {
  const ref = useRef(null);
  const titleRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = splitWords(titleRef.current);
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.06,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
      gsap.from(".sh-eyebrow", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className={`${align === "center" ? "text-center mx-auto" : "text-left"} ${className}`}
    >
      <p className="sh-eyebrow eyebrow mb-5">
        {index && <span className="text-champagne/60 mr-2">{index}</span>}
        {eyebrow}
      </p>
      <h2
        ref={titleRef}
        className="font-heading text-4xl sm:text-5xl lg:text-6xl text-bone leading-[1.05] tracking-tight"
      >
        {title}
      </h2>
    </div>
  );
}