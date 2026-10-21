/**
 * Admin API Client
 * Centraliza todas las llamadas a endpoints de administrador
 * Incluye token de autenticación automáticamente desde localStorage
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.floresmarketing.com.mx/api';

/**
 * Realiza una solicitud autenticada al servidor
 * @param {string} endpoint - Ruta relativa (ej: /admin/stats)
 * @param {object} options - Opciones fetch adicionales
 * @returns {Promise}
 */
async function authenticatedFetch(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // Si no es JSON, usar texto plano
    }

    const error = new Error(
      errorData.message || `API Error: ${response.status} ${response.statusText}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

/**
 * Obtiene estadísticas del dashboard
 * @returns {Promise<{businesses_total, businesses_active, users_total, pending_appointments}>}
 */
export async function getStats() {
  return authenticatedFetch('/admin/stats');
}

/**
 * Obtiene lista de negocios
 * @param {object} filters - Filtros y opciones
 * @param {string} filters.search - Texto a buscar
 * @param {string} filters.status - Estado (active/inactive)
 * @param {number} filters.page - Número de página (1-based)
 * @param {number} filters.limit - Registros por página
 * @returns {Promise<Array>}
 */
export async function getBusinesses(filters = {}) {
  return authenticatedFetch('/negocios');
}

/**
 * Obtiene detalles de un negocio específico
 * @param {number} id - ID del negocio
 * @returns {Promise}
 */
export async function getBusinessById(id) {
  return authenticatedFetch(`/negocios/${id}`);
}

/**
 * Crea un nuevo negocio
 * @param {object} data - Datos del negocio
 * @returns {Promise}
 */
export async function createBusiness(data) {
  return authenticatedFetch('/negocios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza un negocio existente
 * @param {number} id - ID del negocio
 * @param {object} data - Datos a actualizar
 * @returns {Promise}
 */
export async function updateBusiness(id, data) {
  return authenticatedFetch(`/negocios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Elimina un negocio
 * @param {number} id - ID del negocio
 * @returns {Promise}
 */
export async function deleteBusiness(id) {
  return authenticatedFetch(`/negocios/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Busca negocios por texto
 * @param {string} query - Término de búsqueda
 * @returns {Promise}
 */
export async function searchBusinesses(query) {
  return getBusinesses({ search: query });
}

export default {
  getStats,
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  searchBusinesses,
};
