import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/AuthContext';
import { Menu, User, Settings, LogOut } from 'lucide-react';

const ROUTE_LABELS = {
  '/superadmin/dashboard': 'Dashboard Principal',
  '/superadmin/dashboard/businesses': 'Administración de Negocios',
  '/superadmin/dashboard/users': 'Gestión de Usuarios',
  '/superadmin/dashboard/reports': 'Reportes',
};

export default function AdminHeader({ onMenuToggle }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const pageTitle = ROUTE_LABELS[location.pathname] || 'Administración';

  return (
    <header className="sticky top-0 z-40 border-b border-champagne/10 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu Toggle + Breadcrumb */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onMenuToggle}
            variant="ghost"
            size="icon"
            className="lg:hidden text-champagne hover:bg-champagne/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white font-display">{pageTitle}</h1>
            <p className="text-xs text-champagne/60 mt-0.5">
              {new Date().toLocaleDateString('es-MX', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right: User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 text-white hover:bg-champagne/10"
            >
              <div className="w-8 h-8 bg-champagne/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-champagne" />
              </div>
              <span className="hidden sm:inline text-sm">
                {user?.name?.split(' ')[0] || 'Admin'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black border-champagne/20">
            <div className="px-3 py-2 text-xs text-champagne/60">
              {user?.email || 'no-email@example.com'}
            </div>
            <DropdownMenuSeparator className="bg-champagne/10" />
            <DropdownMenuItem className="cursor-pointer text-white hover:bg-champagne/10 hover:text-champagne">
              <Settings className="w-4 h-4 mr-2" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-champagne/10" />
            <DropdownMenuItem
              onClick={() => logout(true)}
              className="cursor-pointer text-red-400 hover:bg-red-600/20 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
