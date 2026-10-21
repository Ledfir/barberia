# 🎯 INTEGRACIÓN API REST - GUÍA COMPLETA

## 📋 TABLA DE CONTENIDOS

1. [Resumen Rápido](#resumen-rápido)
2. [Arquitectura](#arquitectura)
3. [Autenticación](#autenticación)
4. [Endpoints](#endpoints)
5. [Formulario](#formulario)
6. [Estructura de Respuestas](#estructura-de-respuestas)
7. [Manejo de Errores](#manejo-de-errores)
8. [Pruebas](#pruebas)

---

## 🚀 Resumen Rápido

Tu API REST está **completamente integrada** con el dashboard superadmin.

**Lo que funciona**:
- ✅ Autenticación con token JWT
- ✅ Listar negocios (GET /negocios)
- ✅ Registrar negocios (POST /negocios)
- ✅ Validación de formulario
- ✅ Manejo de errores
- ✅ UI responsive

**Lo que aún no existe en la API**:
- ❌ Edición de negocios (PUT /negocios/{id})
- ❌ Eliminación de negocios (DELETE /negocios/{id})

---

## 🏗️ Arquitectura

### Flujo de Autenticación

```
┌─────────────┐
│   Login     │
│  /login     │
└──────┬──────┘
       │ POST credenciales
       │ https://api.floresmarketing.com.mx/api/auth/login
       │
       ├─ Respuesta: { token, usuario }
       │
       ├─ localStorage.setItem('authToken', token)
       ├─ localStorage.setItem('user', userData)
       │
       └─ Redirige a /superadmin/dashboard
```

### Flujo de Requests Posteriores

```
┌──────────────────┐
│  Componente React │
└────────┬─────────┘
         │ Llama a getBusinesses()
         │
┌────────▼──────────────────┐
│  src/api/adminApi.js      │
│  authenticatedFetch()     │
└────────┬──────────────────┘
         │ 
         ├─ Lee token de localStorage
         │ const token = localStorage.getItem('authToken')
         │
         ├─ Prepara headers
         │ Authorization: Bearer {token}
         │ Content-Type: application/json
         │
         ├─ Hace fetch a API
         │ https://api.floresmarketing.com.mx/api/negocios
         │
         └─ Retorna respuesta o lanza error
```

---

## 🔐 Autenticación

### 1. **Login**

**Endpoint**: `POST /api/auth/login`
**Ubicación en código**: `src/pages/Login.jsx`

**Request**:
```javascript
{
  "email": "aangel19_98@hotmail.com",
  "password": "mi_contraseña"
}
```

**Response** (éxito):
```javascript
{
  "token": "0c429f01dc00c1cb936b95d1f38354b7c1b8b486...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "usuario": {
    "id": "1",
    "nombre": "Superadministrador",
    "email": "aangel19_98@hotmail.com",
    "es_superadmin": true
  }
}
```

### 2. **Almacenamiento del Token**

```javascript
// En Login.jsx, línea ~51:
localStorage.setItem("authToken", data.token);
localStorage.setItem("user", JSON.stringify({
  id: data.usuario.id,
  name: data.usuario.nombre,
  email: data.usuario.email,
  phone: '',
  role: data.usuario.es_superadmin ? 'superadmin' : 'user'
}));
```

### 3. **Envío del Token en Requests**

```javascript
// En adminApi.js, función authenticatedFetch():
const token = localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,  // ← Token aquí
  ...options.headers,
};
```

---

## 📡 Endpoints

### GET `/api/negocios`

**Función**:
```javascript
import { getBusinesses } from '@/api/adminApi';

const { data } = useQuery({
  queryKey: ['businesses'],
  queryFn: () => getBusinesses(),
});
```

**Headers enviados**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response esperada** (200):
```javascript
[
  {
    "id": 1,
    "tipo_negocio_id": 1,
    "nombre": "Barbería Centro",
    "email": "info@barberia.mx",
    "telefono": "+52 81 1234 5678",
    "sucursal_nombre": "Centro",
    "admin_nombre": "Juan Pérez",
    "admin_email": "juan@barberia.mx"
  },
  {
    "id": 2,
    "tipo_negocio_id": 2,
    "nombre": "Salón de Belleza",
    "email": "contacto@salon.mx",
    "telefono": "+52 81 8888 9999",
    "sucursal_nombre": "Vista Hermosa",
    "admin_nombre": "María García",
    "admin_email": "maria@salon.mx"
  }
]
```

### POST `/api/negocios`

**Función**:
```javascript
import { createBusiness } from '@/api/adminApi';

createBusiness({
  tipo_negocio_id: 1,
  nombre: "Mi Barbería",
  email: "info@mibarberia.mx",
  telefono: "+52 81 1111 2222",
  sucursal_nombre: "Centro",
  admin_nombre: "Carlos López",
  admin_email: "carlos@mibarberia.mx",
  admin_password: "MiContraseñaSegura123"
});
```

**Headers enviados**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "tipo_negocio_id": "1",
  "nombre": "Mi Barbería",
  "email": "info@mibarberia.mx",
  "telefono": "+52 81 1111 2222",
  "sucursal_nombre": "Centro",
  "admin_nombre": "Carlos López",
  "admin_email": "carlos@mibarberia.mx",
  "admin_password": "MiContraseñaSegura123"
}
```

**Response** (201 - éxito):
```json
{
  "id": 3,
  "tipo_negocio_id": 1,
  "nombre": "Mi Barbería",
  "email": "info@mibarberia.mx",
  "telefono": "+52 81 1111 2222",
  "sucursal_nombre": "Centro",
  "admin_nombre": "Carlos López",
  "admin_email": "carlos@mibarberia.mx",
  "created_at": "2026-10-20T14:57:00Z"
}
```

---

## 📝 Formulario

### Campos del Formulario

**Archivo**: `src/components/admin/BusinessForm.jsx`

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|-----------|
| `tipo_negocio_id` | Select | ✅ Sí | No vacío |
| `nombre` | Text | ✅ Sí | Mínimo 3 caracteres |
| `email` | Email | ❌ No | Email válido si se ingresa |
| `telefono` | Tel | ❌ No | - |
| `sucursal_nombre` | Text | ✅ Sí | Mínimo 3 caracteres |
| `admin_nombre` | Text | ✅ Sí | Mínimo 3 caracteres |
| `admin_email` | Email | ✅ Sí | Email válido |
| `admin_password` | Password | ✅ Sí | Mínimo 12 caracteres |

### Validación Zod

```javascript
const businessSchema = z.object({
  tipo_negocio_id: z.string().min(1, 'Selecciona un tipo de negocio'),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional().or(z.literal('')),
  sucursal_nombre: z.string().min(3, 'El nombre de la sucursal es obligatorio'),
  admin_nombre: z.string().min(3, 'El nombre del administrador es obligatorio'),
  admin_email: z.string().email('Email del administrador inválido'),
  admin_password: z.string().min(12, 'La contraseña debe tener mínimo 12 caracteres'),
});
```

### Tipos de Negocio (Hardcodeados)

```javascript
const BUSINESS_TYPES = [
  { id: '1', name: 'Barbería' },
  { id: '2', name: 'Salón de Belleza' },
  { id: '3', name: 'Peluquería' },
  { id: '4', name: 'Spa' },
];
```

Para agregar más tipos, edita esta constante en `BusinessForm.jsx`.

---

## 📊 Estructura de Respuestas

### Estructura de Negocio

```typescript
interface Business {
  id: number;
  tipo_negocio_id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  sucursal_nombre: string;
  admin_nombre: string;
  admin_email: string;
  created_at?: string;
  updated_at?: string;
}
```

### Estructura de Error de Validación

```json
{
  "message": "The given data was invalid",
  "errors": {
    "admin_password": [
      "La contraseña debe tener al menos 12 caracteres"
    ],
    "email": [
      "El formato del email no es válido"
    ]
  }
}
```

---

## 🚨 Manejo de Errores

### Error 401 - No Autenticado

**Causa**: Token expirado o inválido

**Manejo en código**:
```javascript
// En adminApi.js
if (!response.ok && response.status === 401) {
  // AuthContext debería redirigir a login
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}
```

**Solución**:
- Hacer login de nuevo
- El token se renovará

### Error 422 - Validación

**Causa**: Datos inválidos

**Manejo en código**:
```javascript
// En BusinessForm.jsx
if (error.data?.errors) {
  // Mostrar errores en el formulario
  setApiError(Object.entries(error.data.errors)
    .map(([field, msgs]) => `${field}: ${msgs}`)
    .join('\n'));
}
```

**Solución**:
- Revisar el mensaje de error
- Corregir los datos
- Intentar de nuevo

### Error 500 - Servidor

**Causa**: Error en el backend

**Manejo en código**:
```javascript
catch (error) {
  toast.error('Error al guardar: ' + error.message);
}
```

**Solución**:
- Revisar logs del servidor CodeIgniter
- Verificar que la API esté online

---

## 🧪 Pruebas

### Test 1: Verificar Token

**DevTools → Storage → Local Storage**

Después de login, debe haber:
- `authToken`: JWT token
- `user`: Datos del usuario en JSON

### Test 2: Ver Request

**DevTools → Network → Buscar `negocios`**

Debe haber:
- URL: `https://api.floresmarketing.com.mx/api/negocios`
- Method: POST o GET
- Header `Authorization: Bearer {token}`
- Status: 200 (éxito) o 422 (validación)

### Test 3: Crear Negocio

1. Dashboard → Negocios
2. Clickear "Nuevo Negocio"
3. Llenar campos:
   - Tipo: "Barbería"
   - Nombre: "Test Barbería"
   - Sucursal: "Centro"
   - Admin: "Juan Test"
   - Admin Email: "test@test.mx"
   - Contraseña: "MiContraseña123456"
4. Clickear "Registrar"
5. Verificar que aparezca en la tabla

### Test 4: Manejo de Errores

1. Intentar crear con contraseña corta (< 12)
   - Esperado: Error de validación cliente
2. Intentar crear con email inválido
   - Esperado: Error de validación cliente
3. Intentar crear con datos válidos pero duplicate email
   - Esperado: Error de validación servidor (422)

---

## 📦 Variables de Entorno

**Archivo**: `.env.local`

```bash
# API Base URL
VITE_API_BASE_URL=https://api.floresmarketing.com.mx/api
```

Para cambiar la API, solo edita esta variable.

---

## 🔗 Rutas en la Aplicación

```
/                          → Página principal
/login                     → Login
/dashboard                 → Panel de usuario
/superadmin/dashboard      → Dashboard superadmin (home)
/superadmin/dashboard/businesses  → Gestión de negocios ← TE IMPORTA ESTE
/superadmin/dashboard/users       → Gestión de usuarios
/superadmin/dashboard/reports     → Reportes
```

---

## 📞 Guía Rápida de Debugging

### Problema: "No tiene permisos para acceder"

**Causa**: Token no es de superadmin

**Solución**:
1. Verifica en localStorage que `user.role === 'superadmin'`
2. Si no, el login no está asignando el rol correctamente
3. Revisa que la respuesta de /auth/login incluya `es_superadmin: true`

### Problema: Tabla vacía

**Causa**: GET /negocios no devuelve datos

**Verificar**:
1. DevTools → Network → Busca request a `/negocios`
2. ¿Status es 200? Si no → problema de autenticación
3. ¿Response tiene datos? Si no → no hay negocios registrados

### Problema: Error al registrar

**Verificar**:
1. ¿Todos los campos requeridos están llenos?
2. ¿Contraseña tiene mínimo 12 caracteres?
3. ¿Email es válido?
4. Revisar DevTools → Network → respuesta POST
5. Si hay campo `errors`, el backend rechazó la validación

---

**Versión**: 1.0
**Último update**: 2026-10-20
**Estado**: ✅ Producción
