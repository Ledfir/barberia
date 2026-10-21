// =============================================================================
// SERVICIOS — Catálogo de servicios y precios
// GET /api/servicios
// =============================================================================

import { api, IS_DEMO } from "./api";
import { mockServicios } from "@/data/mockData";

export async function getServicios() {
  if (IS_DEMO) {
    await delay(300);
    return [...mockServicios];
  }
  return api.get("/servicios");
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}