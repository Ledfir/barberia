// =============================================================================
// RESERVACIONES — Creación de citas
// POST /api/reservaciones
// =============================================================================

import { api, IS_DEMO } from "./api";

// Protección contra envíos duplicados
let submitting = false;

export async function createReservacion(payload) {
  if (submitting) {
    throw new Error("Ya hay una reservación en proceso.");
  }
  submitting = true;
  try {
    if (IS_DEMO) {
      await delay(1200);
      // Modo demo: NO se confirma contra un servidor real.
      // Devolvemos un identificador de demostración claramente marcado.
      return {
        demo: true,
        confirmada: false,
        numero_reservacion: `DEMO-${Date.now().toString().slice(-6)}`,
        mensaje: "Reservación de demostración. No se almacenó ninguna cita real.",
        reservacion: payload,
      };
    }
    return await api.post("/reservaciones", payload);
  } finally {
    submitting = false;
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}