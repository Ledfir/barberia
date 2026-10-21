# ⚡ Guía Rápida: Verificar que el Fix Funciona

**Tiempo:** 2-3 minutos  
**Requisito:** Navegador abierto en http://localhost:5174

---

## 🎬 Escenario 1: Test de Login Normal

```
1. Abre http://localhost:5174/login
2. Ingresa credenciales válidas
3. Presiona "Ingresar"

✅ ESPERADO:
   - Redirección a http://localhost:5174/dashboard
   - Página carga sin errores
   - Ves el dashboard

❌ ERROR:
   - Error de conexión
   - Redirige nuevamente a /login (bucle = problema no resuelto)
   - Mensajes de error en pantalla
```

---

## 🎬 Escenario 2: Verificar localStorage (F12)

```
1. Presiona F12 (DevTools)
2. Ve a "Application" → "Storage" → "localStorage"
3. Busca "http://localhost:5174"
4. Expande para ver las keys

✅ ESPERADO:
   - authToken: eyJhbGc... (texto largo)
   - user: {"id":..., "role":"superadmin", ...}

❌ ERROR:
   - authToken no existe
   - user no existe
   - user no tiene "role" dentro
```

---

## 🎬 Escenario 3: Probar Persistencia (F5)

```
1. Estando en /dashboard
2. Presiona F5 (recargar página)
3. Espera a que cargue

✅ ESPERADO:
   - Sigue en http://localhost:5174/dashboard
   - Dashboard visible
   - Sin redirecciones a /login
   - Sin Flash de página

❌ ERROR:
   - Redirige a /login
   - Pantalla en blanco
   - Flash antes de redirigir (significa que se detectó no autenticado)
```

---

## 🎬 Escenario 4: Test Admin Dashboard (si role=superadmin)

```
1. En el dashboard, navega a /superadmin/dashboard
   (o escribe directamente en la barra)
2. Espera a que cargue

✅ ESPERADO:
   - Carga el dashboard admin
   - Ves sidebar y header
   - Estadísticas visibles

❌ ERROR:
   - Redirige a /
   - Ves toast "No tienes permisos..."
   - Página en blanco
```

---

## 🎬 Escenario 5: Test Logout

```
1. En el dashboard, busca botón de logout
   (Generalmente en el header, esquina superior derecha)
2. Click en logout
3. Espera

✅ ESPERADO:
   - Redirige a /login
   - localStorage vacío (F12 → localStorage no muestra authToken)
   - Formulario de login visible

❌ ERROR:
   - No redirige a /login
   - Botón no existe
   - localStorage sigue teniendo authToken
```

---

## 🎬 Escenario 6: Verificar que no entra en bucle

```
1. Después de logout, estando en /login
2. Presiona F5 (recargar)

✅ ESPERADO:
   - Sigue en /login
   - Sin cambios de URL
   - Formulario visible

❌ ERROR:
   - Redirige a /dashboard (significa que localStorage aún tiene datos)
   - Redirige a otra página
```

---

## 📋 Checklist Final

```
[ ] Login redirige a /dashboard
[ ] Dashboard no redirige a /login (SIN bucle)
[ ] localStorage tiene authToken después de login
[ ] localStorage tiene user después de login
[ ] F5 en dashboard mantiene la sesión
[ ] /superadmin/dashboard accesible si role=superadmin
[ ] Logout redirige a /login
[ ] localStorage vacío después de logout
[ ] F5 en /login no redirige a /dashboard
```

**Si todos los items tienen ✅ → El fix funciona correctamente**

---

## 🚨 Si Algo Falla

### Falla: "Sigo siendo redirigido a /login después de login"

**Paso 1:** Verifica localStorage
```javascript
// En Console (F12):
localStorage.getItem('authToken')
// Debe devolver algo como: "eyJhbGc..."
// Si devuelve null → El login no guardó el token
```

**Paso 2:** Si localStorage está vacío
- La API no devolvió un token válido
- O hubo error en Login.jsx
- Verifica en Console si hay errores

**Paso 3:** Si localStorage tiene token pero aún redirige
- AuthContext.jsx no se actualizó correctamente
- Verifica que el archivo sea como se muestra en los docs

**Paso 4:** Limpia caché del navegador
```
F12 → Application → Clear site data
Luego F5 para recargar
```

---

### Falla: "/superadmin/dashboard redirige a /"

**Verificación:**
```javascript
// En Console:
JSON.parse(localStorage.getItem('user')).role
// Debe devolver: "superadmin" o "admin"
// Si devuelve otro valor → No tienes permisos
```

**Soluciones:**
- Cambiar usuario de prueba (que tenga role=superadmin)
- Contactar backend para cambiar rol del usuario

---

### Falla: "Console muestra errores JSON"

**Error típico:**
```
Uncaught SyntaxError: Unexpected token < in JSON
```

**Causa:** API devolvió HTML en lugar de JSON
**Solución:** Verificar que la URL de API es correcta en Login.jsx

---

## 💡 Tips Útiles

1. **Abrir DevTools sin interfaz:**
   ```
   F12 → Console (pestaña "Console")
   ```

2. **Ejecutar JavaScript en Console:**
   - Copia el código
   - Pega en Console (Ctrl+V)
   - Presiona Enter

3. **Ver toda la respuesta de localStorage:**
   ```javascript
   console.table({
     authToken: localStorage.getItem('authToken'),
     user: JSON.parse(localStorage.getItem('user'))
   })
   ```

4. **Forzar recarga sin caché:**
   ```
   Ctrl+Shift+R (o Cmd+Shift+R en Mac)
   ```

---

## 🎯 TL;DR (La Versión Ultra Rápida)

1. Login normal → ✅ Redirección a /dashboard
2. F5 en dashboard → ✅ Sigue en /dashboard
3. DevTools localStorage → ✅ authToken existe
4. Logout → ✅ Redirige a /login y localStorage vacío

**Todo esto funciona → Fix está OK ✅**

---

**Documentos relacionados:**
- `FIX_COMPLETADO.md` - Status general
- `RESUMEN_FIX_AUTENTICACION.md` - Explicación técnica
- `VERIFICACION_DEV_CONSOLE.md` - Tests detallados en console
