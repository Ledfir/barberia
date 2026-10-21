// =============================================================================
// CAPA BASE DE LA API REST
// Cliente fetch desacoplado, preparado para consumir CodeIgniter 4.
// No contiene credenciales privadas. La URL base viene de VITE_API_BASE_URL.
// =============================================================================

import { barberConfig } from "@/config/barberConfig";

const BASE_URL = barberConfig.api.baseUrl;
export const IS_DEMO = barberConfig.api.demoMode;

// Controlador de AbortController para cancelar solicitudes obsoletas
const controllers = new Map();

function cancelPrevious(key) {
  const prev = controllers.get(key);
  if (prev) prev.abort();
  const controller = new AbortController();
  controllers.set(key, controller);
  return controller.signal;
}

async function request(path, options = {}) {
  if (IS_DEMO) {
    throw new Error("Modo demostración activo: no hay backend conectado.");
  }
  const url = `${BASE_URL}${path}`;
  const signal = options.signal || cancelPrevious(path);

  let lastError;
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(options.headers || {}),
        },
      });

      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        const err = new Error(data.message || "El horario seleccionado ya no está disponible.");
        err.code = "CONFLICT";
        err.status = 409;
        throw err;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      if (err.name === "AbortError") throw err;
      if (err.code === "CONFLICT") throw err;
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export const api = {
  get: (path, opts) => request(path, { method: "GET", ...opts }),
  post: (path, body, opts) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...opts,
    }),
};