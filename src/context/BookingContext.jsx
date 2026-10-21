// =============================================================================
// CONTEXTO DE RESERVACIÓN
// Estado central del flujo de booking: servicio, barbero, fecha, hora, cliente.
// Al cambiar servicio o barbero, invalida las selecciones downstream obsoletas.
// =============================================================================

import { createContext, useContext, useState, useCallback } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [step, setStep] = useState(0); // 0..5
  const [servicio, setServicio] = useState(null);
  const [barbero, setBarbero] = useState(null); // null = "cualquier barbero"
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState(null);
  const [cliente, setCliente] = useState({ nombre: "", telefono: "", email: "", comentarios: "" });
  const [confirmacion, setConfirmacion] = useState(null);

  // Preseleccionar servicio desde las cards de servicios
  const preselectServicio = useCallback((s) => {
    setServicio(s);
    // El cambio de servicio invalida fecha/hora (la disponibilidad depende del servicio)
    setFecha(null);
    setHora(null);
    setConfirmacion(null);
  }, []);

  const preselectBarbero = useCallback((b) => {
    setBarbero(b);
    setFecha(null);
    setHora(null);
    setConfirmacion(null);
  }, []);

  const selectServicio = useCallback((s) => {
    setServicio(s);
    setFecha(null);
    setHora(null);
    setConfirmacion(null);
  }, []);

  const selectBarbero = useCallback((b) => {
    setBarbero(b);
    setFecha(null);
    setHora(null);
    setConfirmacion(null);
  }, []);

  const selectFecha = useCallback((f) => {
    setFecha(f);
    setHora(null); // nueva fecha => invalidar hora
    setConfirmacion(null);
  }, []);

  const selectHora = useCallback((h) => {
    setHora(h);
    setConfirmacion(null);
  }, []);

  const updateCliente = useCallback((field, value) => {
    setCliente((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setServicio(null);
    setBarbero(null);
    setFecha(null);
    setHora(null);
    setCliente({ nombre: "", telefono: "", email: "", comentarios: "" });
    setConfirmacion(null);
  }, []);

  const value = {
    step, setStep,
    servicio, barbero, fecha, hora, cliente, confirmacion,
    preselectServicio, preselectBarbero,
    selectServicio, selectBarbero, selectFecha, selectHora,
    updateCliente, setConfirmacion, reset,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking debe usarse dentro de BookingProvider");
  return ctx;
}