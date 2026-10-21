import { useEffect, useRef } from "react";
import { isMobile } from "@/lib/gsap";

// Cursor personalizado discreto para escritorio (anillo dorado que crece en hover)
export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (isMobile() || window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onOver = (e) => {
      const t = e.target;
      if (
        t.closest("button, a, [role='button'], input, textarea, select, .cursor-hover")
      ) {
        cursor.classList.add("hovering");
      }
    };
    const onOut = (e) => {
      const t = e.target;
      if (
        t.closest("button, a, [role='button'], input, textarea, select, .cursor-hover")
      ) {
        cursor.classList.remove("hovering");
      }
    };

    const render = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    render();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor hidden lg:block" aria-hidden="true" />;
}