# Arquitectura del Panel de Usuario

## 🏗️ Estructura de Rutas

```
/
├── /                    → BarberPage (Página principal)
├── /login              → Login (Autenticación) ✨ DISPONIBLE
├── /dashboard          → UserDashboard (Panel de usuario) ✨ NUEVO
└── /*                  → PageNotFound (404)
```

## 🔐 Flujo de Autenticación

```
Usuario No Autenticado
    ↓
    ├─→ Intenta acceder a /dashboard
    │   ↓
    │   Redirección a /login
    │   ↓
    │   Ingresa email y contraseña
    │   ↓
    │   ✅ Autenticación exitosa
    ↓
Usuario Autenticado
    ↓
    ├─→ Puede acceder a /dashboard
    ├─→ Ve botón "Panel" en Navbar
    ├─→ Puede cerrar sesión
```

## 📊 Componentes Implementados

### 1. UserDashboard.jsx (NUEVO)
```
UserDashboard
├── Header (Navbar interno)
│   ├── Logo del Panel
│   ├── Botón "Inicio"
│   └── Botón "Cerrar sesión"
├── Sidebar (Navegación)
│   ├── Mi Perfil
│   ├── Mis Reservaciones
│   └── Configuración
└── Content Area
    ├── Profile Tab
    │   ├── Avatar del usuario
    │   ├── Información personal
    │   ├── Email
    │   ├── Teléfono
    │   └── Fecha de inscripción
    ├── Reservations Tab
    │   ├── Lista de reservaciones
    │   └── Botón "Hacer una Reservación"
    └── Settings Tab
        ├── Notificaciones por Email
        ├── Notificaciones SMS
        └── Cambiar Contraseña
```

### 2. App.jsx (MODIFICADO)
```
App
├── AuthProvider
├── QueryClientProvider
├── Router
│   ├── ScrollToTop
│   └── AuthenticatedApp
│       ├── Routes
│       │   ├── / → BarberPage
│       │   ├── /login → Login ✨
│       │   ├── /dashboard → UserDashboard ✨ NUEVO
│       │   └── /* → PageNotFound
```

### 3. Navbar.jsx (MODIFICADO)
```
Navbar
├── Logo (clickeable)
├── Nav Links (desktop)
├── CTA Dinámico
│   ├── Si autenticado → Botón "Panel"
│   └── Si no autenticado → Botón "Reservar Cita"
└── Mobile Menu
    ├── Nav Links
    └── CTA Dinámico (igual que desktop)
```

## 🎨 Paleta de Colores

```
Fondo Principal:     #0f0f0f - #1a1a1a
Fondo Secundario:    #000000 / #111111
Texto Principal:     #FFFFFF
Acentos (Champagne): #D4AF37 (o variable CSS)
Bordes:              champagne/10 (transparencia)
Acciones:            Hover efecto con champagne/20
```

## 🔧 Integración de AuthContext

```javascript
// En cualquier componente:
const { 
  user,                  // Datos del usuario autenticado
  isAuthenticated,       // boolean
  logout,               // Función para cerrar sesión
  isLoadingAuth,        // boolean
  authError,            // Objeto de error si existe
  checkUserAuth,        // Función para verificar autenticación
} = useAuth();
```

## 📱 Responsividad

```
Desktop (lg):
┌─────────────────────────────────────┐
│ Navbar con botón "Panel"            │
├──────────────┬──────────────────────┤
│   Sidebar    │   Content Area       │
│   (1/4)      │   (3/4)              │
│              │                      │
│ Mi Perfil    │   [Perfil del user]  │
│ Reserv.      │                      │
│ Config       │                      │
└──────────────┴──────────────────────┘

Mobile (< lg):
┌─────────────────────────────────────┐
│ Navbar (hamburguesa)                │
├─────────────────────────────────────┤
│   Sidebar (full width)              │
├─────────────────────────────────────┤
│   Content Area (full width)         │
└─────────────────────────────────────┘
```

## 🔄 Estado Compartido

```
App
├── AuthProvider (Contexto Global)
│   ├── user
│   ├── isAuthenticated
│   ├── isLoadingAuth
│   └── authError
├── QueryClientProvider
└── Router
    ├── BarberPage (acceso a useAuth)
    ├── Login (acceso a useAuth)
    └── UserDashboard (acceso a useAuth)
```

## 🚀 Flujo de Usuario Típico

### Caso 1: Usuario Nuevo
```
1. Visita sitio (/)
2. Ve opción "Reservar Cita" en Navbar
3. Hace clic → Scroll a sección Reservaciones
4. O hace clic en /login
5. Crea cuenta o inicia sesión
6. Automáticamente redirige a dashboard
7. Puede ver su perfil y hacer reservaciones
```

### Caso 2: Usuario Existente
```
1. Visita sitio (/)
2. Ve botón "Panel" en Navbar (está autenticado)
3. Hace clic → Va a /dashboard
4. Ve sus datos y reservaciones
5. Puede gestionar su cuenta
6. Opción de cerrar sesión
```

## 💾 Persistencia

```
Base44 SDK
├── Token JWT (almacenado de forma segura)
├── Datos del usuario (caché)
├── Sesión (verificada en cada carga)
└── Logout (limpia todo)
```

## 🛡️ Protecciones

```
/dashboard
    ↓
useAuth() → isAuthenticated?
    ↓
NO → Redirige a /login
    ↓
SÍ → Muestra contenido del dashboard
```

## 📈 Escalabilidad

Para agregar nuevas funcionalidades:

```
1. Nueva Pestaña en Dashboard
   UserDashboard.jsx:
   - Agregar botón en sidebar
   - Agregar contenido condicional

2. Nuevo Dato de Usuario
   AuthContext.jsx:
   - Extender objeto 'user'
   - Actualizar obtención de datos

3. Nueva Ruta Privada
   App.jsx:
   - Agregar <Route>
   - Envolver con protección AuthContext
```

---

**Diagrama creado:** 2026-10-20
**Última actualización:** Implementación inicial completa ✅
