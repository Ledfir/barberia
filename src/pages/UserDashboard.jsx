import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Home, LogOut, Calendar, Settings } from 'lucide-react';

export default function UserDashboard() {
  const { user, isAuthenticated, logout, isLoadingAuth, authChecked } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    console.log('[UserDashboard] Estado:', {
      authChecked,
      isAuthenticated,
      userName: user?.name,
      isLoadingAuth,
    });

    // Solo redirigir si la autenticación ha sido verificada y no está autenticado
    if (authChecked && !isAuthenticated) {
      console.log('[UserDashboard] No autenticado, redirigiendo a login');
      navigate('/login');
    }
  }, [isAuthenticated, authChecked, navigate]);

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080808]">
        <div className="w-8 h-8 border border-champagne/30 border-t-champagne rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout(true);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
      {/* Header */}
      <header className="border-b border-champagne/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-champagne/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Usuario</h1>
              <p className="text-xs text-champagne/60">Barbería Premium</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoHome}
              className="text-champagne hover:text-white hover:bg-champagne/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2 bg-black/30 border border-champagne/10 rounded-lg p-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'profile'
                    ? 'bg-champagne/20 text-champagne border border-champagne/30'
                    : 'text-champagne/60 hover:text-champagne hover:bg-champagne/10'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Mi Perfil</span>
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'reservations'
                    ? 'bg-champagne/20 text-champagne border border-champagne/30'
                    : 'text-champagne/60 hover:text-champagne hover:bg-champagne/10'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Mis Reservaciones</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'settings'
                    ? 'bg-champagne/20 text-champagne border border-champagne/30'
                    : 'text-champagne/60 hover:text-champagne hover:bg-champagne/10'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Configuración</span>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-black/30 border border-champagne/10 rounded-lg p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Mi Perfil</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-champagne/30 to-champagne/10 rounded-full flex items-center justify-center border-2 border-champagne/30">
                        <User className="w-12 h-12 text-champagne" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-champagne/60 text-sm">Nombre:</p>
                        <p className="text-xl font-semibold text-white">{user?.name || 'Usuario'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-champagne/10">
                      <p className="text-champagne/60 text-sm mb-2">Email:</p>
                      <p className="text-white font-medium">{user?.email || 'correo@ejemplo.com'}</p>
                    </div>

                    {user?.phone && (
                      <div className="border-t border-champagne/10 pt-4">
                        <p className="text-champagne/60 text-sm mb-2">Teléfono:</p>
                        <p className="text-white font-medium">{user.phone}</p>
                      </div>
                    )}

                    <div className="border-t border-champagne/10 pt-4">
                      <p className="text-champagne/60 text-sm mb-2">Miembro desde:</p>
                      <p className="text-white font-medium">
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'No disponible'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-champagne/10">
                  <Button
                    className="bg-champagne text-black hover:bg-champagne/90 font-semibold"
                  >
                    Editar Perfil
                  </Button>
                </div>
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div className="bg-black/30 border border-champagne/10 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Mis Reservaciones</h2>
                <div className="space-y-4">
                  <div className="bg-black/40 border border-champagne/10 rounded-lg p-6 text-center">
                    <Calendar className="w-12 h-12 text-champagne/40 mx-auto mb-4" />
                    <p className="text-champagne/60 mb-2">No tienes reservaciones aún</p>
                    <p className="text-champagne/40 text-sm mb-4">
                      Reserva tu próxima cita en nuestra barbería premium
                    </p>
                    <Button
                      onClick={handleGoHome}
                      className="bg-champagne text-black hover:bg-champagne/90 font-semibold"
                    >
                      Hacer una Reservación
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-black/30 border border-champagne/10 rounded-lg p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Configuración</h2>
                  <div className="space-y-4">
                    <div className="bg-black/40 border border-champagne/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Notificaciones por Email</p>
                          <p className="text-champagne/60 text-sm mt-1">
                            Recibe recordatorios de tus reservaciones
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 rounded border-champagne/30"
                        />
                      </div>
                    </div>

                    <div className="bg-black/40 border border-champagne/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Notificaciones SMS</p>
                          <p className="text-champagne/60 text-sm mt-1">
                            Recibe recordatorios por mensaje de texto
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 rounded border-champagne/30"
                        />
                      </div>
                    </div>

                    <div className="border-t border-champagne/10 pt-4 mt-4">
                      <Button
                        className="bg-champagne text-black hover:bg-champagne/90 font-semibold"
                      >
                        Cambiar Contraseña
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
