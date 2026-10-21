import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";
import { createReservacion } from "@/services/reservaciones";
import { IS_DEMO } from "@/services/api";
import { Loader2, Check, Copy, Calendar, Clock, User, Phone, RotateCcw } from "lucide-react";

function formatDate(fecha) {
  const d = new Date(fecha + "T00:00:00");
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function to12h(hora) {
  const [h, m] = hora.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

export default function BookingSummary() {
  const ref = useRef(null);
  const successRef = useRef(null);
  const { servicio, barbero, fecha, hora, cliente, setConfirmacion, confirmacion, setStep, reset } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".sum-reveal", { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
    },
    { scope: ref }
  );

  // Animación de éxito
  useGSAP(
    () => {
      if (!confirmacion || !successRef.current || prefersReducedMotion()) return;
      gsap.from(successRef.current, { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(1.7)" });
      gsap.from(".success-line", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.3 });
    },
    { dependencies: [confirmacion] }
  );

  const confirmar = async () => {
    setLoading(true);
    setError(null);
    const payload = {
      servicio_id: servicio.id,
      barbero_id: barbero?.id || null,
      fecha,
      hora,
      cliente: {
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email || null,
      },
      comentarios: cliente.comentarios || "",
    };
    try {
      const res = await createReservacion(payload);
      setConfirmacion(res);
    } catch (e) {
      if (e.code === "CONFLICT") {
        setError(e.message);
      } else {
        setError(e.message || "No se pudo completar la reservación.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copiar = () => {
    const txt = [
      `Reservación: ${confirmacion.numero_reservacion}`,
      `Servicio: ${servicio.nombre}`,
      `Barbero: ${barbero ? barbero.nombre : "Cualquier barbero"}`,
      `Fecha: ${formatDate(fecha)}`,
      `Hora: ${to12h(hora)}`,
      `Nombre: ${cliente.nombre}`,
      `Teléfono: ${cliente.telefono}`,
    ].join("\n");
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Estado de éxito
  if (confirmacion) {
    return (
      <div ref={successRef} className="text-center py-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-champagne flex items-center justify-center mb-6">
          <Check size={40} className="text-[#080808]" />
        </div>
        <h3 className="success-line font-heading text-3xl text-bone mb-2">
          {confirmacion.demo ? "Reservación de demostración" : "¡Reservación confirmada!"}
        </h3>
        <p className="success-line text-champagne text-sm uppercase tracking-[0.2em] mb-6">
          N° {confirmacion.numero_reservacion}
        </p>

        {confirmacion.demo && (
          <p className="success-line text-xs text-bone/50 max-w-md mx-auto mb-8">
            {confirmacion.mensaje}
          </p>
        )}

        <div className="success-line max-w-md mx-auto bg-[#111111] border border-white/10 p-6 text-left space-y-2 mb-6">
          <Row icon={<Calendar size={16} />} label="Servicio" value={servicio.nombre} />
          <Row icon={<User size={16} />} label="Barbero" value={barbero ? barbero.nombre : "Cualquiera"} />
          <Row icon={<Calendar size={16} />} label="Fecha" value={formatDate(fecha)} />
          <Row icon={<Clock size={16} />} label="Hora" value={to12h(hora)} />
          <Row icon={<User size={16} />} label="Nombre" value={cliente.nombre} />
          <Row icon={<Phone size={16} />} label="Teléfono" value={cliente.telefono} />
        </div>

        <div className="success-line flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={copiar}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-bone/20 text-bone text-xs uppercase tracking-[0.2em] hover:border-champagne hover:text-champagne transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiado" : "Copiar detalles"}
          </button>
          <button
            onClick={() => { reset(); setStep(0); }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-champagne text-[#080808] text-xs uppercase tracking-[0.2em] font-medium hover:bg-bone transition-colors"
          >
            <RotateCcw size={14} /> Nueva reservación
          </button>
        </div>
      </div>
    );
  }

  // Resumen previo a confirmar
  return (
    <div ref={ref} className="space-y-6">
      <p className="sum-reveal text-sm text-bone/50">Revisa los detalles de tu reservación.</p>

      <div className="sum-reveal bg-[#111111] border border-white/10 p-6 lg:p-8">
        <div className="space-y-4">
          <Row icon={<Calendar size={16} />} label="Servicio" value={`${servicio.nombre} · ${servicio.duracion} min · $${servicio.precio} MXN`} />
          <Row icon={<User size={16} />} label="Barbero" value={barbero ? barbero.nombre : "Cualquier barbero disponible"} />
          <Row icon={<Calendar size={16} />} label="Fecha" value={formatDate(fecha)} />
          <Row icon={<Clock size={16} />} label="Hora" value={to12h(hora)} />
          <div className="h-px bg-white/5 my-2" />
          <Row icon={<User size={16} />} label="Nombre" value={cliente.nombre} />
          <Row icon={<Phone size={16} />} label="Teléfono" value={cliente.telefono} />
          {cliente.email && <Row icon={<User size={16} />} label="Correo" value={cliente.email} />}
        </div>
      </div>

      {IS_DEMO && (
        <p className="sum-reveal text-xs text-champagne/70 bg-champagne/5 border border-champagne/20 p-3">
          Modo demostración: la reservación no se enviará a ningún servidor ni se almacenará.
        </p>
      )}

      {error && (
        <p className="sum-reveal text-sm text-red-400 bg-red-400/10 border border-red-400/20 p-3">
          {error}
        </p>
      )}

      <div className="sum-reveal flex justify-between">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-4 border border-bone/20 text-bone text-xs uppercase tracking-[0.25em] hover:border-bone transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={confirmar}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-4 bg-champagne text-[#080808] text-xs uppercase tracking-[0.25em] font-medium hover:bg-bone transition-colors disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Confirmando…</>
          ) : (
            "Confirmar reservación"
          )}
        </button>
      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-champagne mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-bone/40">{label}</p>
        <p className="text-bone/90 text-sm capitalize">{value}</p>
      </div>
    </div>
  );
}