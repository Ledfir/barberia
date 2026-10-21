import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Post-login destination (e.g. the MCP OAuth consent page sends users here
  // with returnTo so the grant flow can resume). Same-origin paths only.
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("https://api.floresmarketing.com.mx/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      
      console.log('[Login] API Response:', data);
      
      // Guardar el token en localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      
      // La API devuelve "usuario" no "user", transformamos la estructura
      if (data.usuario) {
        // Transformar la estructura de la API a nuestro formato interno
        const userData = {
          id: data.usuario.id,
          name: data.usuario.nombre,
          email: data.usuario.email,
          phone: data.usuario.phone || '', // Si la API no devuelve phone, dejamos vacío
          role: data.usuario.es_superadmin ? 'superadmin' : 'user', // Convertir es_superadmin a role
        };
        localStorage.setItem("user", JSON.stringify(userData));
        console.log('[Login] Usuario guardado en localStorage:', userData);
      } else {
        console.log('[Login] No hay data.usuario en la respuesta:', Object.keys(data));
      }

      // Redirigir al dashboard o la página de retorno usando React Router
      const destination = returnTo === "/" ? "/dashboard" : returnTo;
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Correo o contraseña inválidos");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // Por ahora, solo deshabilitamos Google Sign-In
    // Puedes implementarlo más adelante si la API lo soporta
    setError("Google Sign-In no está disponible en este momento");
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión en tu cuenta"
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Crear una
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
