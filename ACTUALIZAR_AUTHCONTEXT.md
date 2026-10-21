# 🔧 Guía: Actualizar AuthContext para API Externa

## 📋 Contexto

Ahora que el login usa una API externa, necesitas actualizar el `AuthContext.jsx` para que funcione con el token guardado en `localStorage`.

---

## 📝 Código Actualizado para AuthContext.jsx

Reemplaza el contenido de `src/lib/AuthContext.jsx` con lo siguiente:

```jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Actualizar estado
    setUser(null);
    setIsAuthenticated(false);

    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    isLoadingAuth,
    authError,
    logout,
    navigateToLogin,
    checkAuthentication,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

---

## 🔧 Cambios Principales

### 1. Removido Base44
```javascript
// ❌ Removido
import { base44 } from '@/api/base44Client';

// ✅ Agregado
import { useNavigate } from 'react-router-dom';
```

### 2. Nueva función checkAuthentication
```javascript
const checkAuthentication = () => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');

  if (token && userData) {
    setUser(JSON.parse(userData));
    setIsAuthenticated(true);
  } else {
    setUser(null);
    setIsAuthenticated(false);
  }
};
```

### 3. Logout actualizado
```javascript
const logout = (shouldRedirect = true) => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  setUser(null);
  setIsAuthenticated(false);

  if (shouldRedirect) {
    window.location.href = '/login';
  }
};
```

### 4. Removido navigateToLogin de Base44
```javascript
// ❌ Removido
base44.auth.redirectToLogin(window.location.href);

// ✅ Reemplazado con
navigate('/login');
```

---

## 📱 Uso en Componentes

El `useAuth()` sigue siendo igual:

```jsx
import { useAuth } from '@/lib/AuthContext';

export default function MiComponente() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      <button onClick={() => logout()}>Cerrar sesión</button>
    </div>
  );
}
```

---

## 🔐 Cliente API Helper

Crea un archivo helper para centralizar las llamadas a API:

**Crear archivo:** `src/lib/apiClient.js`

```javascript
/**
 * Cliente API para llamadas autenticadas
 * Incluye automáticamente el token en el header
 */

const API_BASE_URL = 'https://api.floresmarketing.com.mx/api';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Redirigir a login si no hay token
    window.location.href = '/login';
    throw new Error('No hay token de autenticación');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Si el token expiró (401), redirigir a login
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Token expirado, por favor inicia sesión nuevamente');
      }

      const error = await response.json();
      throw new Error(error.message || 'Error en la solicitud');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en apiCall:', error);
    throw error;
  }
}
```

---

## 💡 Ejemplo: Obtener Reservaciones

Usando el nuevo cliente API:

```javascript
// src/services/reservacionesUsuario.js

import { apiCall } from '@/lib/apiClient';

export async function obtenerMisReservaciones() {
  return apiCall('/reservaciones/usuario', {
    method: 'GET',
  });
}

export async function cancelarReservacion(reservacionId) {
  return apiCall(`/reservaciones/${reservacionId}`, {
    method: 'DELETE',
  });
}

export async function crearReservacion(datos) {
  return apiCall('/reservaciones', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}
```

---

## 🔄 Flujo de Autenticación Actualizado

```
1. Usuario ingresa email y contraseña en /login
   ↓
2. POST a https://api.floresmarketing.com.mx/api/auth/login
   ↓
3. API retorna { token, user }
   ↓
4. Login.jsx guarda en localStorage
   ↓
5. Redirige a /dashboard
   ↓
6. AuthContext.jsx detecta token en localStorage
   ↓
7. setIsAuthenticated(true) y setUser(user)
   ↓
8. Componentes pueden acceder a user via useAuth()
   ↓
9. Llamadas a API incluyen automáticamente el token
   ↓
10. Si token expira (401), redirige a /login
```

---

## 🧪 Prueba de Integración

### 1. Verifica el Login
```bash
npm run dev
# Abre http://localhost:5173/login
# Ingresa credenciales
# Verifica en DevTools que se guardó el token
```

### 2. Verifica AuthContext
```javascript
// En DevTools Console
const { useAuth } = await import('src/lib/AuthContext.jsx');
// Deberías ver la función

// Verifica localStorage
localStorage.getItem('authToken')
JSON.parse(localStorage.getItem('user'))
```

### 3. Verifica Dashboard
```bash
# Después de login, deberías ir a /dashboard
# Verifica que muestre tus datos
# Intenta hacer logout
```

---

## ✅ Checklist

- [ ] Actualizado AuthContext.jsx con código nuevo
- [ ] Removidos imports de Base44
- [ ] Token se guarda en localStorage desde Login
- [ ] useAuth() funciona en componentes
- [ ] Logout limpia localStorage
- [ ] Dashboard muestra datos del usuario
- [ ] Creado apiClient.js (opcional pero recomendado)
- [ ] Compilación sin errores: `npm run build`

---

## 🚀 Próximos Pasos

1. **Integrar servicios de API**
   - Actualizar `src/services/` para usar `apiCall()`

2. **Refresh Token**
   - Implementar lógica de refresh si tu API lo soporta

3. **Persistencia Mejorada**
   - Considerar usar `httpOnly` cookies en lugar de `localStorage`

4. **Endpoints Adicionales**
   - `/api/reservaciones` - Obtener citas
   - `/api/barberos` - Obtener barberos
   - `/api/servicios` - Obtener servicios

---

**AuthContext actualizado y listo para funcionar con API externa ✅**
