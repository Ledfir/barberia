// =============================================================================
// BARBEROS — Equipo de profesionales
// GET /api/barberos
// =============================================================================

import { api, IS_DEMO } from "./api";
import { mockBarberos } from "@/data/mockData";

export async function getBarberos() {
  if (IS_DEMO) {
    await delay(300);
    return [...mockBarberos];
  }
  return api.get("/barberos");
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}