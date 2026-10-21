# 🔌 Integración con API REST de CodeIgniter 4

## ✅ Estado: COMPLETADO

La integración del dashboard del superadministrador con tu API REST está lista.

---

## 📋 Cambios Realizados

### 1. **Configuración de Variables de Entorno**
- **Archivo creado**: `.env.local`
- **Variable**: `VITE_API_BASE_URL=https://api.floresmarketing.com.mx/api`
- La URL se lee automáticamente en `adminApi.js`

### 2. **Cliente API Actualizado**
- **Archivo**: `src/api/adminApi.js`
- **Cambios**:
  - Ahora usa la variable de entorno `VITE_API_BASE_URL`
  - Endpoints actualizados a `/negocios` (en lugar de `/admin/businesses`)
  - Mantiene automáticamente el token en el header `Authorization: Bearer TOKEN`
  - Maneja errores de validación del backend

### 3. **Formulario de Registro**
- **Archivo**: `src/components/admin/BusinessForm.jsx`
- **Campos implementados**:
  - `tipo_negocio_id` (Tipo de negocio - select con opciones)
  - `nombre` (Nombre del negocio)
  - `email` (Email del negocio - opcional)
  - `telefono` (Teléfono del negocio - opcional)
  - `sucursal_nombre` (Nombre de la sucursal)
  - `admin_nombre` (Nombre del administrador)
  - `admin_email` (Email del administrador)
  - `admin_password` (Contraseña del administrador - mín 12 caracteres)
  
- **Validación**: Zod schema valida todos los campos según requerimientos
- **Manejo de errores**: Muestra errores devueltos por la API en tiempo real

### 4. **Tabla de Negocios**
- **Archivo**: `src/components/admin/BusinessTable.jsx`
- **Campos mostrados**:
  - Nombre del negocio
  - Nombre de la sucursal
  - Contacto (teléfono y email)
  - Datos del administrador
  
- **Responsive**: Tabla en desktop, cards en mobile

### 5. **Página de Gestión**
- **Archivo**: `src/pages/admin/BusinessManagement.jsx`
- **Funcionalidades**:
  - ✅ Lista de negocios (GET `/negocios`)
  - ✅ Crear negocio (POST `/negocios`)
  - ❌ Editar negocio (pendiente - endpoint no existe)
  - ❌ Eliminar negocio (pendiente - endpoint no existe)
  - Búsqueda y filtros (estructura lista, funcionalidad adaptable)

### 6. **Dashboard Home**
- **Archivo**: `src/pages/admin/DashboardHome.jsx`
- **Arreglo**: Agregado import `useState` faltante

---

## 🔐 Autenticación

La autenticación se maneja automáticamente:

1. El usuario hace login con las credenciales en `/login`
2. El token se guarda en `localStorage.authToken`
3. `adminApi.js` lee el token automáticamente de `localStorage`
4. Se envía en cada request: `Authorization: Bearer {token}`

**Nota**: El servidor debe validar el token y responder con un error 401 si no es válido.

---

## 🚀 Endpoints Integrados

### GET `/negocios`
```javascript
// Retorna array de negocios
getBusinesses()
```

**Respuesta esperada**:
```json
[
  {
    "id": 1,
    "tipo_negocio_id": 1,
    "nombre": "Barbería Centro",
    "email": "info@barberia.mx",
    "telefono": "+52 81 1234 5678",
    "sucursal_nombre": "Centro",
    "admin_nombre": "Juan Pérez",
    "admin_email": "admin@barberia.mx"
  }
]
```

### POST `/negocios`
```javascript
// Crea un nuevo negocio
createBusiness({
  tipo_negocio_id: 1,
  nombre: "Mi Barbería",
  email: "info@mibarberia.mx",
  telefono: "+52 81 9999 8888",
  sucursal_nombre: "Centro",
  admin_nombre: "Carlos López",
  admin_email: "admin@mibarberia.mx",
  admin_password: "MiContraseña123456"
})
```

**Validaciones esperadas desde la API**:
- `tipo_negocio_id`: Debe ser válido
- `nombre`: Mínimo 3 caracteres
- `sucursal_nombre`: Obligatorio
- `admin_nombre`: Obligatorio
- `admin_email`: Email válido
- `admin_password`: Mínimo 12 caracteres

**Respuesta en caso de error**:
```json
{
  "message": "Validation failed",
  "errors": {
    "admin_password": "La contraseña debe tener al menos 12 caracteres",
    "admin_email": "El email ya está registrado"
  }
}
```

---

## 📍 Ubicación de Componentes

```
src/
├── api/
│   └── adminApi.js                          (Cliente API centralizado)
├── pages/admin/
│   ├── SuperAdminDashboard.jsx              (Layout principal)
│   ├── DashboardHome.jsx                    (Estadísticas)
│   └── BusinessManagement.jsx               (Gestión de negocios)
├── components/admin/
│   ├── BusinessForm.jsx                     (Formulario de registro)
│   ├── BusinessTable.jsx                    (Tabla de listado)
│   ├── StatCard.jsx                         (Tarjetas de estadísticas)
│   ├── AdminSidebar.jsx                     (Menú lateral)
│   └── AdminHeader.jsx                      (Encabezado)
└── lib/
    └── AuthContext.jsx                      (Autenticación y token)
```

---

## 🧪 Pruebas

### Test Flow

1. **Iniciar sesión**:
   - Ir a http://localhost:5173/login
   - Ingresar credenciales superadmin
   - Redirigirse automáticamente al dashboard

2. **Ver negociosregistrados**:
   - Navegar a `/superadmin/dashboard/businesses`
   - Deberían aparecer los negocios del endpoint GET `/negocios`

3. **Registrar un negocio**:
   - Clickear "Nuevo Negocio"
   - Llenar todos los campos requeridos
   - Clickear "Registrar Negocio"
   - Verificar que aparezca en la tabla inmediatamente

4. **Verificar manejo de errores**:
   - Intentar registrar con contraseña corta
   - Intentar registrar con email inválido
   - Los errores de la API deberían mostrarse en el formulario

---

## 🔄 Flujo de Datos

```
User → Login (/api/auth/login)
  ↓
Token guardado en localStorage
  ↓
Navigate /superadmin/dashboard
  ↓
AdminApi.js lee token de localStorage
  ↓
GET /api/negocios (con Authorization header)
  ↓
Tabla se rellena con negocios
  ↓
User clickea "Nuevo Negocio"
  ↓
Formulario abre
  ↓
User llena datos
  ↓
POST /api/negocios (con datos y Authorization header)
  ↓
Si éxito: se refresca la lista y aparece el nuevo negocio
Si error: se muestran los errores en el formulario
```

---

## ⚙️ Configuración

### Variables de Entorno

**Archivo**: `.env.local`

```
VITE_API_BASE_URL=https://api.floresmarketing.com.mx/api
```

Para cambiar la URL base de la API, solo edita este valor.

### Tipos de Negocio

Los tipos de negocio están hardcodeados en `BusinessForm.jsx` en la constante `BUSINESS_TYPES`:

```javascript
const BUSINESS_TYPES = [
  { id: '1', name: 'Barbería' },
  { id: '2', name: 'Salón de Belleza' },
  { id: '3', name: 'Peluquería' },
  { id: '4', name: 'Spa' },
];
```

**Para agregar más tipos**, edita esta constante.

---

## 🚫 Limitaciones Actuales

1. **Edición**: No implementada (endpoint `/negocios/{id}` PUT no existe en API)
2. **Eliminación**: No implementada (endpoint `/negocios/{id}` DELETE no existe en API)
3. **Estadísticas**: El endpoint `/admin/stats` sigue siendo de prueba
4. **Paginación**: Aún no implementada en BusinessManagement

---

## 📝 Próximas Tareas

Cuando tengas los endpoints de edición y eliminación:

1. Descomentar la lógica en `BusinessManagement.jsx` (líneas de updateMutation y deleteMutation)
2. Activar botones de editar y eliminar en `BusinessTable.jsx`
3. Agregar campos de edición en `BusinessForm.jsx`
4. Implementar paginación con query parameters

---

## 🐛 Debugging

### Ver requests en DevTools
1. Abre F12 → Network
2. Realiza una acción (crear negocio, etc.)
3. Busca requests a `api.floresmarketing.com.mx`
4. Verifica:
   - Headers incluyen `Authorization: Bearer {token}`
   - Response status (200 = éxito, 422 = validación, 401 = no autenticado)

### Ver logs en consola
Hay `console.log` en `adminApi.js` que muestran:
- Requests enviadas
- Errores de API
- Estructura de respuestas

### Token no enviado
Si ves error 401:
1. Verifica que localStorage tenga `authToken`
   - DevTools → Storage → Local Storage → authToken
2. Si está vacío, el login no guardó el token correctamente
3. Revisa AuthContext.jsx

---

## 📞 Soporte

Si hay errores:

1. Verifica que la API devuelva JSON válido
2. Asegúrate que el token es válido
3. Revisa la estructura de respuesta coincida con lo documentado aquí
4. Mira los logs en DevTools Console

---

**Última actualización**: 2026-10-20
**Estado**: ✅ Producción lista
