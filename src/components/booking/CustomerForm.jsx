import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";

export default function CustomerForm() {
  const ref = useRef(null);
  const { cliente, updateCliente, setStep } = useBooking();
  const [errors, setErrors] = useState({});

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".field", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" });
    },
    { scope: ref }
  );

  const validate = () => {
    const e = {};
    if (!cliente.nombre.trim()) e.nombre = "Ingresa tu nombre completo.";
    else if (cliente.nombre.trim().length < 3) e.nombre = "Nombre demasiado corto.";
    if (!cliente.telefono.trim()) e.telefono = "Ingresa tu teléfono o WhatsApp.";
    else if (!/^[0-9+\s()-]{8,}$/.test(cliente.telefono.trim())) e.telefono = "Teléfono inválido.";
    if (cliente.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) e.email = "Correo inválido.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep(4);
  };

  const fields = [
    { key: "nombre", label: "Nombre completo *", type: "text", ph: "Juan Pérez" },
    { key: "telefono", label: "WhatsApp / Teléfono *", type: "tel", ph: "+52 81 1234 5678" },
    { key: "email", label: "Correo electrónico (opcional)", type: "email", ph: "juan@ejemplo.com" },
  ];

  return (
    <div ref={ref} className="space-y-5">
      <p className="text-sm text-bone/50 mb-2">Tus datos para confirmar la reservación.</p>

      {fields.map((f) => (
        <div key={f.key} className="field">
          <label htmlFor={f.key} className="block text-[11px] uppercase tracking-[0.2em] text-bone/50 mb-2">
            {f.label}
          </label>
          <input
            id={f.key}
            type={f.type}
            value={cliente[f.key]}
            placeholder={f.ph}
            onChange={(e) => {
              updateCliente(f.key, e.target.value);
              if (errors[f.key]) setErrors((p) => ({ ...p, [f.key]: null }));
            }}
            className={`w-full bg-transparent border-b py-3 text-bone placeholder:text-bone/25 focus:outline-none transition-colors ${
              errors[f.key] ? "border-red-400" : "border-bone/20 focus:border-champagne"
            }`}
          />
          {errors[f.key] && <p className="text-xs text-red-400 mt-1">{errors[f.key]}</p>}
        </div>
      ))}

      <div className="field">
        <label htmlFor="comentarios" className="block text-[11px] uppercase tracking-[0.2em] text-bone/50 mb-2">
          Comentarios adicionales (opcional)
        </label>
        <textarea
          id="comentarios"
          value={cliente.comentarios}
          placeholder="Indicaciones especiales para tu cita…"
          rows={3}
          onChange={(e) => updateCliente("comentarios", e.target.value)}
          className="w-full bg-transparent border-b border-bone/20 focus:border-champagne py-3 text-bone placeholder:text-bone/25 focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-4 border border-bone/20 text-bone text-xs uppercase tracking-[0.25em] hover:border-bone transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={next}
          className="px-8 py-4 bg-champagne text-[#080808] text-xs uppercase tracking-[0.25em] font-medium hover:bg-bone transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}