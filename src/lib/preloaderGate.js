// =============================================================================
// PUERTA DEL PRELOADER
// Sincroniza la salida del preloader con las animaciones de entrada del sitio.
// Si el preloader falla o no se monta, se libera solo (nunca bloquea el sitio).
// =============================================================================

export const PRELOADER_DONE_EVENT = "atelier:preloader-done";

let resolved = false;
let resolveFn;
const promise = new Promise((res) => {
  resolveFn = res;
});

export function releasePreloader() {
  if (resolved) return;
  resolved = true;
  resolveFn();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
  }
}

export function isPreloaderDone() {
  return resolved;
}

// Promesa que resuelve cuando el preloader termina (o al agotarse el failsafe).
export const preloaderReady = promise;

// Failsafe global: pase lo que pase, el contenido se revela.
if (typeof window !== "undefined") {
  setTimeout(releasePreloader, 7000);
}