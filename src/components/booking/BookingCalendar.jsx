import { useRef, useState, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBooking } from "@/context/BookingContext";
import { getDisponibilidad } from "@/services/disponibilidad";
import TimeSlots from "./TimeSlots";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function BookingCalendar() {
  const ref = useRef(null);
  const gridRef = useRef(null);
  const { servicio, barbero, fecha, selectFecha } = useBooking();
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".cal-reveal", { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" });
    },
    { scope: ref }
  );

  // Transición al cambiar de mes
  const changeMonth = (delta) => {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
    if (prefersReducedMotion() || !gridRef.current) return;
    gsap.fromTo(
      gridRef.current,
      { opacity: 0, x: delta > 0 ? 30 : -30 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
    );
  };

  // Genera los días del mes con offsets iniciales
  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    // Lunes=0 ... Domingo=6
    let firstDay = first.getDay() - 1;
    if (firstDay < 0) firstDay = 6;
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(view.getFullYear(), view.getMonth(), d));
    }
    return cells;
  }, [view]);

  const isPast = (d) => d < today;
  const isToday = (d) => toISODate(d) === toISODate(today);
  const isSelected = (d) => fecha && toISODate(d) === fecha;

  const canGoPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div ref={ref} className="space-y-8">
      <p className="cal-reveal text-sm text-bone/50">Selecciona la fecha para tu cita.</p>

      <div className="cal-reveal bg-[#111111] border border-white/10 p-6 lg:p-8">
        {/* Header del mes */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => canGoPrev && changeMonth(-1)}
            disabled={!canGoPrev}
            className="w-10 h-10 border border-bone/15 flex items-center justify-center text-bone hover:border-champagne hover:text-champagne transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Mes anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="font-heading text-2xl text-bone">
            {MONTHS[view.getMonth()]} <span className="text-champagne">{view.getFullYear()}</span>
          </p>
          <button
            onClick={() => changeMonth(1)}
            className="w-10 h-10 border border-bone/15 flex items-center justify-center text-bone hover:border-champagne hover:text-champagne transition-colors"
            aria-label="Mes siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] uppercase tracking-[0.1em] text-bone/40 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div ref={gridRef} className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (!d) return <div key={i} />;
            const past = isPast(d);
            const selected = isSelected(d);
            const todayFlag = isToday(d);
            return (
              <button
                key={i}
                disabled={past}
                onClick={() => selectFecha(toISODate(d))}
                className={`aspect-square flex items-center justify-center text-sm transition-all duration-300 relative ${
                  selected
                    ? "bg-champagne text-[#080808] font-medium"
                    : past
                    ? "text-bone/15 cursor-not-allowed"
                    : "text-bone/80 hover:bg-white/5 hover:text-champagne border border-transparent hover:border-champagne/30"
                }`}
              >
                {d.getDate()}
                {todayFlag && !selected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-champagne" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horarios disponibles para la fecha seleccionada */}
      {fecha && (
        <TimeSlots
          fecha={fecha}
          servicioId={servicio?.id}
          barberoId={barbero?.id}
        />
      )}
    </div>
  );
}