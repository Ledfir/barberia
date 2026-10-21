import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/superadmin/dashboard',
  },
  {
    id: 'businesses',
    label: 'Negocios',
    icon: Building2,
    path: '/superadmin/dashboard/businesses',
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: Users,
    path: '/superadmin/dashboard/users',
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: BarChart3,
    path: '/superadmin/dashboard/reports',
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sidebarRef.current) return;

    if (isOpen) {
      gsap.to(sidebarRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(sidebarRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: 'power2.in',
      });
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout(true);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed lg:sticky left-0 top-0 h-screen w-64 bg-black/40 border-r border-champagne/10 backdrop-blur-sm z-50 lg:z-0 lg:opacity-100 lg:translate-x-0 flex flex-col ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        } lg:translate-x-0 transition-transform lg:transition-none`}
      >
        {/* Header */}
        <div className="p-6 border-b border-champagne/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white font-display">ADMIN</h1>
              <p className="text-xs text-champagne/60">Barbería Premium</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-champagne hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-champagne/20 text-champagne border border-champagne/30'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-champagne/10 p-4 space-y-3">
          <div className="px-4 py-3 bg-white/5 rounded-lg">
            <p className="text-xs text-champagne/60 mb-1">Conectado como</p>
            <p className="text-sm text-white truncate font-medium">
              {user?.name || user?.email || 'Usuario Admin'}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
}
