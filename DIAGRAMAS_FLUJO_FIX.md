# 🔄 Diagramas de Flujo: Autenticación (Antes vs Después)

---

## ❌ ANTES DEL FIX (Problema: Bucle Infinito)

### Login con API Externa + AuthContext con Base44

```
┌─────────────────────────────────────────────────────────────────┐
│                     USUARIO INGRESA CREDENCIALES                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  POST a API Externa        │
        │ (credentials validas)      │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  API devuelve:                             │
        │  {                                         │
        │    "token": "JWT_AQUI",                   │
        │    "user": {id, name, role, ...}          │
        │  }                                         │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  Login.jsx guarda en localStorage ✅       │
        │  • localStorage.authToken = "JWT_AQUI"    │
        │  • localStorage.user = {...}              │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  window.location.href = "/dashboard"       │
        │  (Page reload/recarga completa)            │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  AuthContext.useEffect() se ejecuta        │
        │  (AQUI ESTA EL PROBLEMA)                  │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  AuthContext intenta:                      │
        │  const me = base44.auth.me()  ❌           │
        │  (Busca en Base44 SDK)                     │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  Base44 NO encuentra login ❌              │
        │  (El login fue con API EXTERNA)            │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  AuthContext: isAuthenticated = false      │
        │  (Aunque localStorage tiene token)         │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  Dashboard se renderiza pero              │
        │  ProtectedAdminRoute ve:                   │
        │  isAuthenticated = false                   │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  ProtectedAdminRoute redirige a /login    │
        │  navigate('/login')                        │
        └────────────┬───────────────────────────────┘
                     │
                     ▼ REGRESA AL INICIO
        ┌────────────────────────────────────────────┐
        │  Login.jsx se renderiza nuevamente         │
        │  localStorage sigue teniendo token         │
        │  BUCLE INFINITO 🔄                        │
        └────────────────────────────────────────────┘

═════════════════════════════════════════════════════════════════
PROBLEMA: Dos sistemas de autenticación desconectados
  • Login.jsx → localStorage (API externa)
  • AuthContext → Base44 SDK (no conoce API externa)
═════════════════════════════════════════════════════════════════
```

---

## ✅ DESPUÉS DEL FIX (Solución: localStorage es fuente única)

### Login con API Externa + AuthContext con localStorage

```
┌─────────────────────────────────────────────────────────────────┐
│                     USUARIO INGRESA CREDENCIALES                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  POST a API Externa            │
        │ (credentials validas)          │
        └────────────┬──────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  API devuelve:                             │
        │  {                                         │
        │    "token": "JWT_AQUI",                   │
        │    "user": {id, name, role, ...}          │
        │  }                                         │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  Login.jsx guarda en localStorage ✅       │
        │  • localStorage.authToken = "JWT_AQUI"    │
        │  • localStorage.user = {...}              │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  window.location.href = "/dashboard"       │
        │  (Page reload/recarga completa)            │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  AuthContext.useEffect() se ejecuta        │
        │  (AQUI ESTA EL FIX)                       │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  AuthContext lee de localStorage ✅        │
        │  const token = localStorage.getItem(      │
        │    'authToken'                             │
        │  )                                         │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  Token encontrado ✅                       │
        │  localStorage.authToken !== null           │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  AuthContext: isAuthenticated = true ✅   │
        │  setUser(userData)                         │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  Dashboard se renderiza                    │
        │  ProtectedAdminRoute ve:                   │
        │  isAuthenticated = true ✅                │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  Verifica role del usuario:                │
        │  user.role = "superadmin" ✅              │
        └────────────┬───────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────────────┐
        │  ✅ Dashboard Admin carga correctamente   │
        │  Sin redirecciones                         │
        │  Flujo completo                            │
        └────────────────────────────────────────────┘

═════════════════════════════════════════════════════════════════
SOLUCIÓN: Un único sistema (localStorage)
  • Login.jsx → localStorage ✅
  • AuthContext → localStorage ✅
  • Ambos hablan el mismo idioma
═════════════════════════════════════════════════════════════════
```

---

## 📊 Comparación Visual: Flujos en Paralelo

### ANTES (❌ Falla)

```
TIMELINE DE EVENTOS:
═══════════════════════════════════════════════════════════════

T0:  [Login] →(credenciales)→ [API Externa]
T1:  [API Externa] →(token + user)→ [Login]
T2:  [Login] →(guarda)→ [localStorage]
T3:  [Login] →(redirect)→ /dashboard
T4:  [/dashboard] →(carga)→ [AuthContext.useEffect]
T5:  [AuthContext] →(busca)→ [Base44 SDK]
T6:  [Base44] →(respuesta)→ "No hay autenticación"
T7:  [AuthContext] →(isAuth=false)→ [ProtectedAdminRoute]
T8:  [ProtectedAdminRoute] →(redirige)→ /login
T9:  [/login] →(carga)→ (localStorage aún tiene token)
T10: [Login] →(guarda nuevamente)→ [localStorage] (redundante)
T11: Vuelve a T4 → BUCLE INFINITO 🔄

EL PROBLEMA: En T5, AuthContext busca en el lugar EQUIVOCADO
            (Base44 en lugar de localStorage)
```

### DESPUÉS (✅ Funciona)

```
TIMELINE DE EVENTOS:
═══════════════════════════════════════════════════════════════

T0:  [Login] →(credenciales)→ [API Externa]
T1:  [API Externa] →(token + user)→ [Login]
T2:  [Login] →(guarda)→ [localStorage] ✅
T3:  [Login] →(redirect)→ /dashboard
T4:  [/dashboard] →(carga)→ [AuthContext.useEffect]
T5:  [AuthContext] →(busca)→ [localStorage] ✅ (FIX!)
T6:  [localStorage] →(respuesta)→ "Token encontrado"
T7:  [AuthContext] →(isAuth=true)→ [ProtectedAdminRoute]
T8:  [ProtectedAdminRoute] →(verifica role)→ "superadmin"
T9:  [ProtectedAdminRoute] →(permite entrada)→ [Dashboard Admin]
T10: [Dashboard Admin] →(renderiza)→ Componentes visibles ✅

TERMINADO ✅ - Sin bucles, sin redirecciones adicionales
```

---

## 🔀 Diagrama de Componentes: Interconexiones

### ANTES (❌ Desconectado)

```
┌─────────────┐
│  API Externa │─────────────┐
│ (credentials)│             │
└─────────────┘             │
                             ▼
                       ┌──────────────┐
                       │  Login.jsx   │
                       │  (Component) │
                       └──────┬───────┘
                              │
                ┌─────────────┤
                │             │
                ▼             ▼
         ┌─────────────┐  ┌──────────────────┐
         │ localStorage│  │  window.location  │
         │ (Token aquí)│  │ (redirect)        │
         └─────────────┘  └─────────┬────────┘
                                    │
                                    ▼
                         ┌──────────────────┐
                         │  /dashboard      │
                         │  (Page reloads)  │
                         └────────┬─────────┘
                                  │
                                  ▼
                      ┌───────────────────────┐
                      │ AuthContext.jsx       │
                      │ (useEffect)           │
                      └────────┬──────────────┘
                               │
                   ┌───────────┴──────────────┐
                   │                          │
                   ▼                          ✗ NO MIRA AQUÍ
            ┌──────────────┐           ┌──────────────────┐
            │ Base44 SDK   │           │ localStorage     │
            │ (Sin token)  │           │ (Token SÍ existe)│
            └──────────────┘           └──────────────────┘
                   │
                   ▼
            "No autenticado" ✗
                   │
                   ▼
         ┌─────────────────────┐
         │ Redirect a /login   │
         │ (BUCLE)             │
         └─────────────────────┘

═══════════════════════════════════════════════════════════════
PROBLEMA: AuthContext no mira a localStorage
                   ↓
          Login y AuthContext no se comunican
═══════════════════════════════════════════════════════════════
```

### DESPUÉS (✅ Conectado)

```
┌─────────────┐
│  API Externa │─────────────┐
│ (credentials)│             │
└─────────────┘             │
                             ▼
                       ┌──────────────┐
                       │  Login.jsx   │
                       │  (Component) │
                       └──────┬───────┘
                              │
                ┌─────────────┤
                │             │
                ▼             ▼
         ┌─────────────┐  ┌──────────────────┐
         │ localStorage│  │  window.location  │
         │ (Token aquí)│  │ (redirect)        │
         └────────┬────┘  └─────────┬────────┘
                  │                 │
                  └────┬────────────┘
                       │
                       ▼
            ┌──────────────────┐
            │  /dashboard      │
            │  (Page reloads)  │
            └────────┬─────────┘
                     │
                     ▼
        ┌───────────────────────┐
        │ AuthContext.jsx       │
        │ (useEffect)           │
        └────────┬──────────────┘
                 │
                 ▼ FIX: Ahora SÍ mira localStorage
         ┌──────────────────┐
         │ localStorage     │
         │ (Token EXISTS) ✅ │
         └────────┬─────────┘
                  │
                  ▼
         "Autenticado" ✅
                  │
                  ▼
        ┌────────────────────────┐
        │ Dashboard carga ✅     │
        │ Sin redirecciones      │
        │ Flujo completado       │
        └────────────────────────┘

═══════════════════════════════════════════════════════════════
SOLUCIÓN: AuthContext ahora SÍ mira localStorage
                   ↓
          Login y AuthContext se comunican perfectamente
═══════════════════════════════════════════════════════════════
```

---

## 🎯 Estado de Variables en Cada Paso

### ANTES del FIX:

```javascript
// T2: Después de Login.jsx guardar
localStorage.authToken     = "JWT..."     ✓ Existe
localStorage.user          = "{...}"      ✓ Existe
isAuthenticated            = false        ✗ Incorrecto!

// T7: AuthContext busca en Base44
base44.auth.token          = undefined    ✗ No existe
base44.auth.user           = undefined    ✗ No existe
isAuthenticated            = false        (por eso)

DESCUADRE: localStorage tiene datos pero isAuthenticated=false
```

### DESPUÉS del FIX:

```javascript
// T2: Después de Login.jsx guardar
localStorage.authToken     = "JWT..."     ✓ Existe
localStorage.user          = "{...}"      ✓ Existe
isAuthenticated            = false        ✓ Correctamente false (aún no verificado)

// T6: AuthContext busca en localStorage
localStorage.authToken     = "JWT..."     ✓ ENCONTRADO!
localStorage.user          = "{...}"      ✓ ENCONTRADO!
isAuthenticated            = true         ✓ Correcto!

CONCORDANCIA: localStorage tiene datos E isAuthenticated=true
```

---

## 📍 La Línea Crítica del Fix

```javascript
// ❌ ANTES (src/lib/AuthContext.jsx línea ~30)
const me = await base44.auth.me();  // ← PROBLEMA

// ✅ DESPUÉS (src/lib/AuthContext.jsx línea ~30)
const token = localStorage.getItem('authToken');  // ← SOLUCIÓN
const userJson = localStorage.getItem('user');    // ← SOLUCIÓN
```

**Una sola línea de diferencia, pero resuelve el bucle infinito completo.**

---

## 🎓 Lección de Arquitectura

```
PRINCIPIO: Single Source of Truth
════════════════════════════════════════════

INCORRECTO (Antes):
  Login → localStorage
  AuthContext → Base44 SDK
  Resultado: CONFLICTO ✗

CORRECTO (Después):
  Login → localStorage
  AuthContext → localStorage
  Resultado: HARMONY ✓

REGLA DE ORO:
  Todos los sistemas deben leer/escribir EN EL MISMO LUGAR
```

---

## 🔗 Ver También

- `RESUMEN_FIX_AUTENTICACION.md` - Explicación en texto
- `VERIFICACION_AUTH_FIX.md` - Pasos de verificación
- `FIX_COMPLETADO.md` - Estado y próximos pasos
