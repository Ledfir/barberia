# 🔍 Verificación en DevTools Console - Paso a Paso

## 📱 Acceder a DevTools

**Opción 1:** Presiona `F12`
**Opción 2:** Click derecho en la página → "Inspeccionar" → Tab "Console"
**Opción 3:** Ctrl+Shift+I (Windows) o Cmd+Option+I (Mac)

---

## ✅ Test 1: Verificar que Login guarda en localStorage

### Antes de hacer login:
1. Abre DevTools (F12)
2. Ve a la pestaña "Application" (o "Storage" en Firefox)
3. Expande "localStorage"
4. Busca `http://localhost:5174`
5. **Verificación:** No debe haber `authToken` ni `user`

### Después de hacer login:
1. En la página de Login, ingresa credenciales válidas
2. Presiona "Ingresar"
3. Espera a que se complete la petición
4. **Verificación:** DevTools → localStorage debe mostrar:
   ```
   authToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   user: {"id":1,"name":"Admin","email":"admin@example.com","role":"superadmin",...}
   ```

---

## ✅ Test 2: Verificar que AuthContext lee de localStorage

### En la consola (pestaña "Console"):

Ejecuta esto en la consola:
```javascript
// Ver si el token existe
localStorage.getItem('authToken')
// Debe devolver: "eyJhbGc..." (el JWT)

// Ver si el usuario existe
JSON.parse(localStorage.getItem('user'))
// Debe devolver: {id: 1, name: "...", role: "superadmin", ...}

// Ver específicamente el role
JSON.parse(localStorage.getItem('user')).role
// Debe devolver: "superadmin" o "admin"
```

### Resultado Esperado:
```javascript
> localStorage.getItem('authToken')
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTcwNDI3MzAwMH0.xyz..."

> JSON.parse(localStorage.getItem('user'))
{id: 1, name: "Admin User", email: "admin@example.com", role: "superadmin", phone: "+1234567890"}

> JSON.parse(localStorage.getItem('user')).role
"superadmin"
```

---

## ✅ Test 3: Verificar flujo SIN redirección al recargar

### Paso 1: Estar logueado en /dashboard
```
URL: http://localhost:5174/dashboard
Estado: Deberías ver el dashboard
localStorage: Debe tener authToken y user
```

### Paso 2: Recargar página (F5)
```javascript
// En la consola, ejecuta:
localStorage.getItem('authToken')
// Debe seguir existiendo (≠ null)
```

### Paso 3: Verificar visualmente
```
URL: Debe seguir siendo http://localhost:5174/dashboard
Vista: Dashboard visible (NO redirección a /login)
Comportamiento: Página recarga normalmente sin cambiar de ruta
```

**✅ Si esto ocurre:** El fix funcionó

---

## ✅ Test 4: Verificar que ProtectedAdminRoute funciona

### Paso 1: Navega a /superadmin/dashboard
```
URL: http://localhost:5174/superadmin/dashboard
```

### Paso 2: Verifica en consola
```javascript
// Ver el role actual
JSON.parse(localStorage.getItem('user')).role

// Debe ser "superadmin" o "admin" para acceder
```

### Resultado:
- **Si role = "superadmin":** Dashboard carga ✅
- **Si role ≠ "superadmin":** Redirige a "/" con toast ✅

### Verifica el toast en consola:
```javascript
// Busca en la pestaña "Console" mensajes como:
"No tienes permisos para acceder a esta sección"
```

---

## ✅ Test 5: Verificar logout

### Paso 1: Haz logout (busca el botón en AdminHeader)

### Paso 2: En la consola, después de logout:
```javascript
localStorage.getItem('authToken')
// Debe devolver: null

localStorage.getItem('user')
// Debe devolver: null
```

### Paso 3: Verifica visualmente
```
URL: Debe ser http://localhost:5174/login
localStorage: Completamente vacío (sin authToken ni user)
```

---

## 🔴 Troubleshooting - Errores Comunes en Console

### Error 1: "Unexpected token <"
```
Uncaught SyntaxError: Unexpected token < in JSON at position 0
```
**Causa:** El servidor devolvió HTML en lugar de JSON
**Solución:** 
```javascript
// En console, verifica:
fetch('https://api.floresmarketing.com.mx/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'test@example.com', password: 'test'})
})
.then(r => r.json())
.then(d => console.log(d))
```

### Error 2: "Cannot read property 'role' of null"
```
TypeError: Cannot read property 'role' of null
```
**Causa:** user no existe en localStorage o no tiene role
**Solución:**
```javascript
// Verifica qué hay en localStorage
console.log('authToken:', localStorage.getItem('authToken'))
console.log('user:', localStorage.getItem('user'))

// Si user es null, backend no devolvió datos
// Si user no tiene role, backend no incluye ese campo
```

### Error 3: CORS error
```
Access to XMLHttpRequest at 'https://api.floresmarketing.com.mx...' 
from origin 'http://localhost:5174' has been blocked by CORS policy
```
**Causa:** Backend no está configurado para permitir CORS desde localhost
**Solución:** Contactar al backend para agregar `http://localhost:5174` a CORS whitelist

### Error 4: 401 Unauthorized
```
Response status: 401
```
**Causa:** Credenciales incorrectas o token expirado
**Solución:** Verificar credenciales o hacer login nuevamente

---

## 📊 Verificación Completa en Una Sola Ejecución

Copia y pega esto en la Console de DevTools:

```javascript
console.group('🔐 Verificación de Autenticación');

// 1. Check localStorage
console.log('1️⃣ localStorage.authToken:', localStorage.getItem('authToken') ? '✅ Existe' : '❌ Falta');
console.log('2️⃣ localStorage.user:', localStorage.getItem('user') ? '✅ Existe' : '❌ Falta');

// 2. Parse user data
try {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('3️⃣ User data:', user);
  console.log('4️⃣ User role:', user.role || '❌ Sin role');
} catch (e) {
  console.error('❌ Error parsing user:', e.message);
}

// 3. Check current URL
console.log('5️⃣ Current URL:', window.location.href);

// 4. Check AuthContext state
const authElement = document.querySelector('[data-auth]');
console.log('6️⃣ Auth context loaded:', authElement ? '✅' : '❌');

console.groupEnd();
```

**Resultado esperado:**
```
🔐 Verificación de Autenticación
1️⃣ localStorage.authToken: ✅ Existe
2️⃣ localStorage.user: ✅ Existe
3️⃣ User data: {id: 1, name: "...", role: "superadmin", ...}
4️⃣ User role: superadmin
5️⃣ Current URL: http://localhost:5174/dashboard
6️⃣ Auth context loaded: ✅
```

---

## 📋 Checklist de Verificación

```
ANTES DE LOGIN:
[ ] localStorage está vacío
[ ] URL es /login
[ ] Página muestra formulario

DESPUÉS DE LOGIN:
[ ] URL es /dashboard
[ ] localStorage.authToken existe
[ ] localStorage.user existe
[ ] localStorage.user.role = "superadmin" o "admin"

DESPUÉS DE F5 (RECARGA):
[ ] URL sigue siendo /dashboard
[ ] localStorage.authToken sigue existiendo
[ ] localStorage.user sigue existiendo
[ ] Dashboard se ve (sin redirigir a /login)

INTENTO DE ADMIN DASHBOARD:
[ ] Si role="superadmin": /superadmin/dashboard carga
[ ] Si role≠"superadmin": Redirige a /

DESPUÉS DE LOGOUT:
[ ] URL es /login
[ ] localStorage.authToken es null
[ ] localStorage.user es null
[ ] Siguiente intento de /dashboard redirige a /login
```

---

## 🎯 Resumen

Si todos estos tests pasan, el fix de autenticación está funcionando correctamente ✅

Los tests verifican:
1. ✅ Login guarda token en localStorage
2. ✅ AuthContext lee del localStorage
3. ✅ Sesión persiste después de recargar (F5)
4. ✅ Rutas protegidas funcionan según role
5. ✅ Logout limpia todo correctamente

**Si algo falla:** Consulta la sección "Troubleshooting" arriba
