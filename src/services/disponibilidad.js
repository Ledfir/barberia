// =============================================================================
// DISPONIBILIDAD — Horarios disponibles por fecha, servicio y barbero
// GET /api/disponibilidad?fecha=YYYY-MM-DD&servicio_id=1&barbero_id=1
// =============================================================================

import { api, IS_DEMO } from "./api";
import { getMockDisponibilidad } from "@/data/mockData";

export async function getDisponibilidad({ fecha, servicioId, barberoId }) {
  if (IS_DEMO) {
    await delay(500);
    return getMockDisponibilidad(fecha, servicioId, barberoId);
  }
  const query = new URLSearchParams({
    fecha,
    servicio_id: servicioId,
    barbero_id: barberoId || "",
  });
  return api.get(`/disponibilidad?${query.toString()}`);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}