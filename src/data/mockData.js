// =============================================================================
// DATOS MOCK — MODO DEMOSTRACIÓN
// Centraliza los datos ficticios usados cuando no hay backend conectado.
// La capa de servicios (src/services/*) consume estos datos en modo demo.
// =============================================================================

import { barberConfig } from "@/config/barberConfig";

const svcImg = barberConfig.images.services;

export const mockServicios = [
  {
    id: 1,
    nombre: "Corte Clásico",
    descripcion: "Corte de precisión con tijera y máquina, finalizado con estilo.",
    precio: 350,
    duracion: 30,
    imagen: svcImg[0],
  },
  {
    id: 2,
    nombre: "Fade / Degradado",
    descripcion: "Degradado americano de alta definición con líneas impecables.",
    precio: 450,
    duracion: 45,
    imagen: svcImg[1],
  },
  {
    id: 3,
    nombre: "Arreglo de Barba",
    descripcion: "Perfilado de barba con navaja, toalla caliente y aceites.",
    precio: 250,
    duracion: 30,
    imagen: svcImg[2],
  },
  {
    id: 4,
    nombre: "Corte + Barba",
    descripcion: "La combinación perfecta de corte y arreglo de barba.",
    precio: 550,
    duracion: 60,
    imagen: svcImg[3],
  },
  {
    id: 5,
    nombre: "Experiencia Premium",
    descripcion: "Corte, barba, mascarilla facial, lavado y bebida de cortesía.",
    precio: 850,
    duracion: 90,
    imagen: svcImg[4],
  },
];

export const mockBarberos = [
  {
    id: 1,
    nombre: "Diego Hernández",
    especialidad: "Fades & Degradados",
    descripcion: "Especialista en degradados de alta definición y líneas precisas.",
    imagen: barberConfig.images.barbers[0],
  },
  {
    id: 2,
    nombre: "Marco Ruiz",
    especialidad: "Barba & Navaja",
    descripcion: "Maestro del perfilado con navaja y cuidado de la barba.",
    imagen: barberConfig.images.barbers[1],
  },
  {
    id: 3,
    nombre: "Andrés Solís",
    especialidad: "Cortes Clásicos",
    descripcion: "Experto en cortes clásicos atemporales y estilismo masculino.",
    imagen: barberConfig.images.barbers[2],
  },
];

// Horarios base de atención (formato 24h) usados por el mock de disponibilidad
const baseSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00",
  "13:00", "15:00", "16:30", "18:00",
];

// Genera disponibilidad ficticia determinista para una fecha.
// Simula algunos horarios ocupados de forma pseudo-aleatoria pero estable.
export function getMockDisponibilidad(fecha, servicioId, barberoId) {
  // Semilla simple basada en la fecha y el barbero
  const seed = [...fecha].reduce((a, c) => a + c.charCodeAt(0), 0) + (barberoId || 0) * 7;
  const ocupados = new Set();
  baseSlots.forEach((slot, i) => {
    if ((seed + i * 3) % 5 === 0) ocupados.add(slot);
  });
  const slots = baseSlots.map((hora) => ({
    hora,
    disponible: !ocupados.has(hora),
  }));
  return {
    fecha,
    servicio_id: servicioId,
    barbero_id: barberoId,
    slots,
  };
}

export const mockTestimonios = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    calificacion: 5,
    comentario:
      "La mejor experiencia de barbería que he tenido. Atención impecable y un ambiente que se siente premium de principio a fin.",
  },
  {
    id: 2,
    nombre: "Javier Torres",
    calificacion: 5,
    comentario:
      "El degradado que me hicieron es perfecto. Se nota el dominio de la técnica y el cuidado por cada detalle.",
  },
  {
    id: 3,
    nombre: "Ricardo Salinas",
    calificacion: 5,
    comentario:
      "Más que un corte, es un ritual. El servicio premium vale cada peso. Salí renovado.",
  },
  {
    id: 4,
    nombre: "Andrés Garza",
    calificacion: 4,
    comentario:
      "Profesionales de verdad. Reservé desde la página y todo fluyó sin complicaciones.",
  },
];

export const mockGaleria = [
  { id: 1, titulo: "Fade Clásico", categoria: "Fades", imagen: barberConfig.images.gallery[0] },
  { id: 2, titulo: "Barba Esculpida", categoria: "Barba", imagen: barberConfig.images.gallery[1] },
  { id: 3, titulo: "Corte Texturizado", categoria: "Cortes", imagen: barberConfig.images.gallery[2] },
  { id: 4, titulo: "Degradado Americano", categoria: "Fades", imagen: barberConfig.images.gallery[3] },
  { id: 5, titulo: "Detalles de Oficio", categoria: "Oficio", imagen: barberConfig.images.gallery[4] },
  { id: 6, titulo: "Look Editorial", categoria: "Estilos", imagen: barberConfig.images.gallery[5] },
];