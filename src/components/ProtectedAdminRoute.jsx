import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

/**
 * Componente que protege rutas administrativas
 * Verifica autenticación y permisos de superadmin
 */
export default function ProtectedAdminRoute({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth, user, authChecked } = useAuth();

  useEffect(() => {
    console.log('[ProtectedAdminRoute] Estado:', {
      authChecked,
      isAuthenticated,
      userRole: user?.role,
      isLoadingAuth,
    });

    // No hacer nada hasta que la autenticación haya sido verificada
    if (!authChecked) {
      console.log('[ProtectedAdminRoute] Esperando authChecked...');
      return;
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      console.log('[ProtectedAdminRoute] No autenticado, redirigiendo a login');
      toast.error('Debes iniciar sesión');
      navigate('/login', { replace: true });
      return;
    }

    // Verificar si el usuario es superadmin
    // El backend es la autoridad definitiva, pero hacemos validación en frontend como primera capa
    if (user && user.role !== 'superadmin' && user.role !== 'admin') {
      console.log('[ProtectedAdminRoute] Rol inválido:', user.role);
      toast.error('No tienes permisos para acceder a esta sección');
      navigate('/', { replace: true });
      return;
    }

    console.log('[ProtectedAdminRoute] Acceso permitido');
  }, [isAuthenticated, authChecked, user, navigate]);

  // Mostrar loading mientras se verifica autenticación
  if (!authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080808]">
        <div className="w-8 h-8 border border-champagne/30 border-t-champagne rounded-full animate-spin"></div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  // Verificar permisos
  if (user && user.role !== 'superadmin' && user.role !== 'admin') {
    return null;
  }

  return children;
}
