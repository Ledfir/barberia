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
    // Usar el endpoint específico de reservaciones, incluso en modo demo
    const reservacionesUrl = import.meta.env.VITE_RESERVACIONES_URL;
    
    if (reservacionesUrl) {
      // Enviar al endpoint real
      const response = await fetch(`${reservacionesUrl}/reservaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Error HTTP ${response.status}`);
      }

      return await response.json();
    } else {
      // Fallback a modo demo si no hay URL de reservaciones
      await delay(1200);
      return {
        demo: true,
        confirmada: false,
        numero_reservacion: `DEMO-${Date.now().toString().slice(-6)}`,
        mensaje: "Reservación de demostración. No se almacenó ninguna cita real.",
        reservacion: payload,
      };
    }
  } finally {
    submitting = false;
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}