# 🔐 Login con API Externa - Cambios Realizados

## 📝 Resumen

Se modificó el formulario de login para enviar las credenciales por **POST** a tu API externa en lugar de usar Base44 Auth.

---

## 🔗 Endpoint de Login

**URL:** `https://api.floresmarketing.com.mx/api/auth/login`  
**Método:** `POST`  
**Content-Type:** `application/json`

### Datos que se envían:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

---

## ✅ Cambios Realizados

### 1. Actualización del `Login.jsx`

**Cambios:**
- ✅ Removidos imports de Base44 (`base44Client`, `GoogleIcon`)
- ✅ Implementado fetch nativo para POST a tu API
- ✅ Guardado de token en `localStorage`
- ✅ Guardado de datos del usuario en `localStorage`
- ✅ Redireccionamiento a `/dashboard` después del login

**Flujo del Login:**

```javascript
const handleSubmit = async (e) => {
  // 1. Hacer POST a la API
  const response = await fetch("https://api.floresmarketing.com.mx/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  // 2. Validar respuesta
  if (!response.ok) {
    throw new Error("Error al iniciar sesión");
  }

  // 3. Obtener datos
  const data = await response.json();

  // 4. Guardar token y usuario en localStorage
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  // 5. Redirigir al dashboard
  window.location.href = "/dashboard";
};
```

---

## 📦 Estructura de la Respuesta Esperada

Tu API debe retornar una respuesta JSON con la siguiente estructura:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "phone": "8112345678"
  }
}
```

### Campos obligatorios:
- `token` (string) - Token JWT o sesión
- `user` (object) - Datos del usuario

---

## 🛡️ Manejo de Errores

Si la API retorna un error, el componente mostrará el mensaje en la pantalla:

```javascript
if (!response.ok) {
  const data = await response.json();
  throw new Error(data.message || "Error al iniciar sesión");
}
```

**Ejemplo de respuesta de error esperada:**
```json
{
  "message": "Credenciales inválidas"
}
```

---

## 💾 Almacenamiento Local

Los datos se guardan en `localStorage`:

```javascript
// Token
localStorage.getItem("authToken")

// Datos del usuario
JSON.parse(localStorage.getItem("user"))
```

---

## 🔄 Próximos Pasos para Integración Completa

### 1. Actualizar AuthContext.jsx

Modifica `src/lib/AuthContext.jsx` para usar el token local en lugar de Base44:

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay token guardado
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Usar el Token en Requests

Para futuras llamadas a APIs, usa el token guardado:

```javascript
const token = localStorage.getItem("authToken");

const response = await fetch("https://api.floresmarketing.com.mx/api/...", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
```

### 3. Validar Token en Requests Protegidos

```javascript
// src/lib/apiClient.js
export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    // Redirigir a login si no hay token
    window.location.href = "/login";
    return;
  }

  const response = await fetch(`https://api.floresmarketing.com.mx${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  return response.json();
}
```

---

## 🧪 Prueba Manual

### 1. Inicia el servidor
```bash
npm run dev
```

### 2. Abre el navegador
```
http://localhost:5173/login
```

### 3. Ingresa credenciales
- Email: `test@ejemplo.com`
- Contraseña: `password123`

### 4. Verifica en la consola
```javascript
// Abre DevTools (F12)
// Pestaña Console

// Verificar token
localStorage.getItem("authToken")

// Verificar usuario
JSON.parse(localStorage.getItem("user"))
```

### 5. Resultado esperado
- ✅ Si es correcto: Redirige a `/dashboard`
- ❌ Si hay error: Muestra el mensaje en la pantalla

---

## 🐛 Troubleshooting

### Problema: "CORS Error"
**Causa:** Tu API no permite requests desde `localhost:5173`

**Solución:** Configura CORS en tu backend (CodeIgniter 4):

```php
// app/Config/CORS.php
public $allowedOrigins = ['http://localhost:5173', 'https://tudominio.com'];
public $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
public $allowedHeaders = ['Content-Type', 'Authorization'];
```

### Problema: "Network Error" o "Failed to fetch"
**Causa:** La URL es incorrecta o la API está offline

**Solución:**
1. Verifica que la URL sea correcta
2. Prueba la API con Postman o cURL
3. Verifica que tu servidor esté corriendo

### Problema: "Error al iniciar sesión"
**Causa:** Credenciales incorrectas o respuesta inválida

**Solución:**
1. Verifica las credenciales
2. Asegúrate de que tu API retorna `token` y `user`
3. Revisa el Network tab en DevTools para ver la respuesta exacta

---

## 📋 Checklist de Implementación

- [x] Login modificado para usar API externa
- [x] Token guardado en localStorage
- [x] Datos del usuario guardados
- [x] Redirección a dashboard funciona
- [x] Manejo de errores implementado
- [x] Compilación exitosa
- [ ] AuthContext actualizado (próximo paso)
- [ ] CORS configurado en el backend (si es necesario)
- [ ] Endpoints adicionales integrados (futuro)

---

## 📚 Archivos Modificados

```
src/pages/Login.jsx
├── Removidos: imports de Base44
├── Agregados: fetch nativo a API
├── Agregados: guardado en localStorage
└── Agregados: manejo de errores mejorado
```

---

## 🚀 Compilación

```bash
✓ built in 1.43s
✓ 1845 módulos transformados
✓ Sin errores
```

---

## 📞 Notas Importantes

1. **Token Expiration:** Implementa lógica para refrescar el token antes de que expire
2. **Seguridad:** El token se guarda en `localStorage`, considera usar `httpOnly` cookies en el futuro
3. **Base44 Removal:** Si no usas más Base44, puedes remover sus dependencias del `package.json`

---

**Integración completada: Login conectado a tu API externa ✅**
