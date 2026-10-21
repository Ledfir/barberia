# 🗺️ Mapa de Rutas - Dashboard Admin

## 🌳 Árbol de Rutas

```
APLICACIÓN
│
├─ / (BarberPage)
│  └─ Página principal - SIN CAMBIOS
│
├─ /login (Login)
│  └─ Autenticación de usuario - SIN CAMBIOS
│
├─ /dashboard (UserDashboard)
│  └─ Panel de usuario regular - SIN CAMBIOS
│
└─ /superadmin/dashboard ⭐ NUEVO
   │
   └─ [SuperAdminDashboard - Layout Raíz]
      │
      ├─ Header: AdminHeader
      │  ├─ Breadcrumbs
      │  ├─ Título de página
      │  └─ Menú de usuario
      │
      ├─ Sidebar: AdminSidebar
      │  ├─ Logo
      │  ├─ Menu Items
      │  │  ├─ Dashboard
      │  │  ├─ Negocios
      │  │  ├─ Usuarios
      │  │  └─ Reportes
      │  └─ User Info + Logout
      │
      └─ Content Area (Outlet)
         │
         ├─ / (index)
         │  └─ [DashboardHome]
         │     ├─ Título y descripción
         │     ├─ Tarjetas de estadísticas
         │     │  ├─ StatCard: Negocios Registrados
         │     │  ├─ StatCard: Negocios Activos
         │     │  ├─ StatCard: Usuarios
         │     │  └─ StatCard: Citas Pendientes
         │     └─ Info panels
         │
         ├─ /businesses
         │  └─ [BusinessManagement]
         │     ├─ Búsqueda
         │     ├─ Filtros
         │     ├─ "+ Nuevo Negocio" (botón)
         │     │
         │     ├─ BusinessTable
         │     │  └─ Tabla/Tarjetas de negocios
         │     │     ├─ Nombre
         │     │     ├─ Contacto (teléfono, email)
         │     │     ├─ Estado (activo/inactivo)
         │     │     └─ Acciones (editar, eliminar)
         │     │
         │     ├─ BusinessForm (Modal)
         │     │  ├─ Campos:
         │     │  │  ├─ Nombre
         │     │  │  ├─ Teléfono
         │     │  │  ├─ Email
         │     │  │  ├─ Dirección
         │     │  │  └─ Estado
         │     │  └─ Botones (Cancelar, Guardar)
         │     │
         │     └─ AlertDialog (Confirmación de eliminación)
         │        └─ "¿Estás seguro?"
         │
         ├─ /users
         │  └─ [UsersManagement]
         │     └─ "En construcción"
         │
         └─ /reports
            └─ [Reports]
               └─ "En construcción"
```

---

## 📍 URLs Exactas

### Rutas Públicas (Existentes)
| URL | Componente | Descripción |
|-----|-----------|-------------|
| `/` | BarberPage | Página principal |
| `/login` | Login | Login de usuario |
| `/dashboard` | UserDashboard | Panel de usuario |
| `/forgot-password` | ForgotPassword | Recuperar contraseña |
| `/register` | Register | Registro de usuario |
| `/*` | PageNotFound | Página 404 |

### Rutas Admin (Nuevas) ⭐
| URL | Componente | Descripción |
|-----|-----------|-------------|
| `/superadmin/dashboard` | DashboardHome | Dashboard principal con estadísticas |
| `/superadmin/dashboard/businesses` | BusinessManagement | CRUD de negocios |
| `/superadmin/dashboard/users` | UsersManagement | Gestión de usuarios (pronto) |
| `/superadmin/dashboard/reports` | Reports | Reportes (pronto) |

---

## 🔗 Flujos de Navegación

### Flujo 1: Login → Dashboard Admin
```
1. Usuario abre http://localhost:5173/login
   └─ Ve formulario de login

2. Ingresa credenciales (role: 'superadmin')
   └─ POST /api/auth/login
   └─ Recibe token y user (role: 'superadmin')
   └─ Guarda en localStorage
   └─ Redirige a /superadmin/dashboard

3. Llega a /superadmin/dashboard
   └─ ProtectedAdminRoute valida token y rol
   └─ Si OK → muestra SuperAdminDashboard
   └─ Si NO → redirige a /login
```

### Flujo 2: Navegar entre secciones
```
1. Usuario está en /superadmin/dashboard
   └─ Sidebar visible

2. Click en "Negocios" en sidebar
   └─ Navigate to /superadmin/dashboard/businesses
   └─ SuperAdminDashboard se mantiene
   └─ Outlet cambia a BusinessManagement
   └─ Sidebar actualiza active state

3. Click en "Dashboard" en sidebar
   └─ Navigate to /superadmin/dashboard
   └─ Outlet cambia a DashboardHome
```

### Flujo 3: CRUD de Negocio
```
1. En /superadmin/dashboard/businesses
   └─ Ve tabla de negocios

2. Click "+ Nuevo Negocio"
   └─ BusinessForm modal abre
   └─ Campos vacíos

3. Llena campos
   └─ Valida con Zod
   └─ Muestra errores si hay

4. Click "Crear Negocio"
   └─ POST /api/admin/businesses
   └─ Backend retorna 201 con negocio creado
   └─ Toast: "Negocio creado"
   └─ Modal cierra
   └─ React Query revalida 'businesses'
   └─ Tabla se actualiza

5. Click lápiz en negocio
   └─ BusinessForm modal abre
   └─ Campos pre-cargados con datos

6. Modifica campo
   └─ Click "Actualizar"
   └─ PUT /api/admin/businesses/:id
   └─ Toast: "Negocio actualizado"
   └─ Tabla se actualiza

7. Click papelera
   └─ AlertDialog aparece
   └─ Confirma eliminación
   └─ DELETE /api/admin/businesses/:id
   └─ Toast: "Negocio eliminado"
   └─ Tabla se actualiza
```

### Flujo 4: Logout
```
1. Click menú usuario en AdminHeader
   └─ DropdownMenu abre

2. Click "Cerrar sesión"
   └─ logout() en AuthContext
   └─ Limpia localStorage
   └─ Redirige a /login
```

---

## 📡 API Calls Esperadas

### Request Headers (Todas)
```
Authorization: Bearer <token>
Content-Type: application/json
```

### 1. Obtener Estadísticas
```
GET /api/admin/stats
└─ Response: {
     "businesses_total": 15,
     "businesses_active": 13,
     "users_total": 45,
     "pending_appointments": 28
   }
```
**Dónde se usa:** DashboardHome.jsx - useQuery('admin-stats')

### 2. Listar Negocios
```
GET /api/admin/businesses?page=1&limit=10&search=&status=
└─ Response: {
     "data": [...],
     "total": 15,
     "page": 1,
     "pages": 2
   }
```
**Dónde se usa:** BusinessManagement.jsx - useQuery('businesses', filters)

### 3. Crear Negocio
```
POST /api/admin/businesses
Body: {
  "name": "Barbería Test",
  "phone": "+52 81 1234 5678",
  "email": "test@barberia.mx",
  "address": "Calle Principal 100",
  "status": "active"
}
└─ Response (201): {id, name, phone, email, address, status}
```
**Dónde se usa:** BusinessForm.jsx - createMutation

### 4. Actualizar Negocio
```
PUT /api/admin/businesses/:id
Body: {
  "name": "Barbería Actualizada",
  "status": "inactive"
}
└─ Response: {id, name, phone, email, address, status}
```
**Dónde se usa:** BusinessForm.jsx - updateMutation

### 5. Eliminar Negocio
```
DELETE /api/admin/businesses/:id
└─ Response: {"message": "Negocio eliminado"}
```
**Dónde se usa:** BusinessManagement.jsx - deleteMutation

---

## 🛡️ Seguridad en Rutas

### ProtectedAdminRoute.jsx
```
Verifica:
1. Token en localStorage → ✓ o redirige a /login
2. isAuthenticated === true → ✓ o redirige a /login
3. user.role === 'superadmin' → ✓ o redirige a /
```

### Si falla alguna verificación
```
├─ Sin token → Redirige a /login
├─ No autenticado → Redirige a /login
└─ No es superadmin → Redirige a / (home)
```

---

## 📱 Responsive Routes

### Mobile (< 768px)
```
/superadmin/dashboard
├─ Sidebar: modal collapsible (overlay)
├─ AdminHeader: ☰ menu button
└─ Content: full width
```

### Tablet (768px - 1024px)
```
/superadmin/dashboard
├─ Sidebar: collapsible
├─ Content: adapta a disponible
└─ Tabla: scrollable
```

### Desktop (≥ 1024px)
```
/superadmin/dashboard
├─ Sidebar: sticky vertical
├─ Content: fixed width
└─ Tabla: fully visible
```

---

## 🔀 Condicionales de Rutas

### App.jsx Routes Config

```jsx
<Routes>
  {/* Rutas públicas */}
  <Route path="/" element={<BarberPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<UserDashboard />} />
  
  {/* Rutas admin */}
  <Route 
    path="/superadmin/dashboard" 
    element={<SuperAdminDashboard />}
  >
    <Route index element={<DashboardHome />} />
    <Route path="businesses" element={<BusinessManagement />} />
    <Route path="users" element={<UsersManagement />} />
    <Route path="reports" element={<Reports />} />
  </Route>
  
  {/* Fallback */}
  <Route path="*" element={<PageNotFound />} />
</Routes>
```

---

## 🧭 Menú de Sidebar

```
ADMIN
Barbería Premium
─────────────────────
✓ Dashboard    [active]
  Negocios
  Usuarios
  Reportes
─────────────────────
Conectado como:
  admin@example.com
  
[Cerrar sesión]
```

### Comportamiento
- Click en item → Navigate a ruta
- Item con matching pathname → Mostrar "active"
- Mobile: click → cierra sidebar
- Desktop: menú siempre visible

---

## 📊 Datos que Fluyen

### Login → localStorage
```javascript
localStorage.setItem('authToken', data.token)
localStorage.setItem('user', JSON.stringify(data.user))
```

### adminApi.js → Componentes
```javascript
// DashboardHome
const stats = await getStats()
// → Muestra en StatCards

// BusinessManagement
const { data } = await getBusinesses(filters)
// → Muestra en BusinessTable
```

### Componentes → API
```javascript
// BusinessManagement
createMutation.mutate(formData)
// → POST /api/admin/businesses

updateMutation.mutate({ id, data })
// → PUT /api/admin/businesses/:id

deleteMutation.mutate(id)
// → DELETE /api/admin/businesses/:id
```

---

## ⚡ Query Revalidation

### Cuando se Revalida 'businesses'
```
✓ Crear negocio exitosamente
✓ Actualizar negocio exitosamente
✓ Eliminar negocio exitosamente
✓ Usuario cambia filtros/búsqueda
✓ Usuario cambia página
```

### Stale Time: 5 minutos
```
- Si data < 5 min → usa cache
- Si data > 5 min → marca como stale
- Si usuario interactúa → revalida
```

---

## 🚨 Manejo de Errores

### Por Nivel

**API Level**
```
→ adminApi.js catch
→ Error object con status y data
→ Lanza Exception
```

**Mutation Level**
```
→ useMutation.onError
→ toast.error(error.message)
→ Actualiza UI state
```

**Component Level**
```
→ isError flag
→ Error message banner
→ Retry button (opcional)
```

---

## 📌 Puntos de Entrada

### URLs para Probar

```
http://localhost:5173/
└─ Página principal

http://localhost:5173/login
└─ Login

http://localhost:5173/dashboard
└─ Panel usuario (requiere login)

http://localhost:5173/superadmin/dashboard
└─ Dashboard admin (requiere login + role: superadmin)

http://localhost:5173/superadmin/dashboard/businesses
└─ Gestión negocios

http://localhost:5173/superadmin/dashboard/users
└─ Usuarios (en construcción)

http://localhost:5173/superadmin/dashboard/reports
└─ Reportes (en construcción)
```

---

## ✅ Verificación de Rutas

```bash
# Verificar que /superadmin/dashboard redirige si no autenticado
✓ Abrir /superadmin/dashboard sin login
✓ Debe redirigir a /login

# Verificar que /superadmin/dashboard funciona si autenticado
✓ Login con role: 'superadmin'
✓ Navegar a /superadmin/dashboard
✓ Debe mostrar DashboardHome

# Verificar navegación entre secciones
✓ Click en "Negocios"
✓ URL cambia a /superadmin/dashboard/businesses
✓ Componente cambia a BusinessManagement

# Verificar responsive
✓ DevTools mobile
✓ Sidebar debe ser modal
✓ Click hamburguesa debe abrir/cerrar
```

---

**Documentación Relacionada:**
- [DASHBOARD_SUPERADMIN.md](./DASHBOARD_SUPERADMIN.md)
- [GUIA_RAPIDA_DASHBOARD.md](./GUIA_RAPIDA_DASHBOARD.md)
- [BACKEND_INTEGRACION.md](./BACKEND_INTEGRACION.md)

**Última actualización:** 2026-10-20
