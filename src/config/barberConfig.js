// =============================================================================
// CONFIGURACIÓN CENTRAL DE LA BARBERÍA
// Edita este archivo para personalizar nombre, contacto, redes, horarios, etc.
// No dispersar contenido hardcodeado entre componentes.
// =============================================================================

export const barberConfig = {
  name: "ATELIER BARBER",
  tagline: "More than a haircut.",
  logoText: "ATELIER",
  logoAccent: "BARBER",

  // Paleta de colores (referencia, los tokens viven en index.css)
  colors: {
    obsidian: "#080808",
    carbon: "#111111",
    charcoal: "#1C1C1C",
    bone: "#F5F2EB",
    slate: "#A3A3A3",
    champagne: "#C6A667",
  },

  // Datos de contacto (placeholder editable)
  contact: {
    address: "Av. Roble 660, Valle del Campestre, San Pedro Garza García, N.L.",
    phone: "+52 81 1234 5678",
    whatsapp: "528112345678",
    whatsappMessage:
      "Hola, me gustaría recibir información sobre los servicios de la barbería.",
    whatsappTooltip: "¿Necesitas ayuda? Escríbenos",
    email: "hola@atelierbarber.mx",
    instagram: "https://instagram.com/atelierbarber",
    facebook: "https://facebook.com/atelierbarber",
    mapsUrl: "https://maps.google.com/?q=San+Pedro+Garza+Garcia+Nuevo+Leon",
    mapEmbed:
      "https://www.google.com/maps?q=San+Pedro+Garza+Garcia+Nuevo+Leon&output=embed",
  },

  // Horarios de atención
  schedule: [
    { day: "Lunes", hours: "Cerrado" },
    { day: "Martes", hours: "10:00 — 20:00" },
    { day: "Miércoles", hours: "10:00 — 20:00" },
    { day: "Jueves", hours: "10:00 — 20:00" },
    { day: "Viernes", hours: "10:00 — 21:00" },
    { day: "Sábado", hours: "09:00 — 18:00" },
    { day: "Domingo", hours: "10:00 — 15:00" },
  ],

  // Zona horaria para el calendario
  timezone: "America/Monterrey",
  locale: "es-MX",

  // Configuración de la API REST (CodeIgniter 4)
  // Define VITE_API_BASE_URL en tu archivo .env para activar el modo real.
  // Si no está definida, el sitio opera en MODO DEMOSTRACIÓN con datos mock.
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    demoMode: !import.meta.env.VITE_API_BASE_URL,
  },

  // Imágenes (sustituibles por fotografías reales del negocio)
  images: {
    hero: "/images/hero.png",
    about: "/images/about.png",
    experience: "/images/experience.png",
    barbers: [
      "/images/barber-1.png",
      "/images/barber-2.png",
      "/images/barber-3.png",
    ],
    gallery: [
      "/images/gallery-1.png",
      "/images/gallery-2.png",
      "/images/gallery-3.png",
      "/images/gallery-4.png",
      "/images/gallery-5.png",
      "/images/gallery-6.png",
    ],
    services: [
      "/images/services-1.png",
      "/images/services-2.png",
      "/images/services-3.png",
      "/images/services-4.png",
      "/images/services-5.png",
    ],
  },
};

export default barberConfig;