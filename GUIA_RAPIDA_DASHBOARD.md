# 🚀 Guía Rápida - Dashboard Superadmin

## Acceso

```
http://localhost:5173/superadmin/dashboard
```

**Requiere:** Usuario con `role: 'superadmin'` autenticado

---

## Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/superadmin/dashboard` | Dashboard home (estadísticas) |
| `/superadmin/dashboard/businesses` | Gestión de negocios |
| `/superadmin/dashboard/users` | Gestión de usuarios (pronto) |
| `/superadmin/dashboard/reports` | Reportes (pronto) |

---

## Característica: Administración de Negocios

### Tabla
- Buscar por nombre
- Filtrar por estado (activo/inactivo)
- Editar negocio
- Eliminar con confirmación
- Responsive (mobile/desktop)

### Formulario
- Campos: Nombre, Teléfono, Email, Dirección, Estado
- Validación con Zod
- Modal reutilizable
- Estados de carga

---

## API Endpoints (Mínimo Requerido)

```
GET  /api/admin/stats
GET  /api/admin/businesses?page=1&limit=10&search=&status=
POST /api/admin/businesses
PUT  /api/admin/businesses/:id
DELETE /api/admin/businesses/:id
```

**Header requerido:** `Authorization: Bearer <token>`

---

## Respuesta de Login (Estructura Esperada)

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "superadmin"
  }
}
```

> ⚠️ IMPORTANTE: El campo `role` es crítico para validar acceso

---

## Validaciones

✅ **Frontend**
- Token presente
- Usuario autenticado
- Rol es superadmin

✅ **Backend (CRÍTICO)**
- Validar token
- Verificar rol superadmin
- Retornar 403 si no autorizado

---

## Componentes Principales

### AdminSidebar
Menú lateral con navegación y logout

### AdminHeader
Encabezado con información del usuario

### StatCard
Tarjetas de estadísticas

### BusinessTable
Tabla CRUD de negocios

### BusinessForm
Modal para crear/editar

---

## Testing Rápido

```bash
# 1. Login como superadmin
# 2. Navegar a /superadmin/dashboard
# 3. Verificar que carguen estadísticas
# 4. Crear un negocio (click "+ Nuevo Negocio")
# 5. Editar un negocio (click lápiz)
# 6. Eliminar un negocio (click papelera)
```

---

## Estructura de Carpetas

```
src/
├── api/
│   └── adminApi.js              ← Cliente de API
├── components/
│   ├── ProtectedAdminRoute.jsx  ← Protección de rutas
│   └── admin/
│       ├── AdminSidebar.jsx
│       ├── AdminHeader.jsx
│       ├── StatCard.jsx
│       ├── BusinessTable.jsx
│       └── BusinessForm.jsx
└── pages/
    └── admin/
        ├── SuperAdminDashboard.jsx
        ├── DashboardHome.jsx
        ├── BusinessManagement.jsx
        ├── UsersManagement.jsx
        └── Reports.jsx
```

---

## Próximos Pasos

1. ✅ Crear endpoints en backend
2. ✅ Verificar login retorna `role: 'superadmin'`
3. ✅ Probar CRUD de negocios
4. ⏳ Implementar módulo de usuarios
5. ⏳ Agregar reportes

---

## Ayuda Rápida

**P: No puedo acceder al dashboard**
R: Verifica que tengas `role: 'superadmin'` en la respuesta de login

**P: No carga las estadísticas**
R: Verifica que exista endpoint `/api/admin/stats`

**P: Errores en la tabla**
R: Abre DevTools → Network y verifica la respuesta de `/api/admin/businesses`

---

**Documentación Completa:** Ver `DASHBOARD_SUPERADMIN.md`
