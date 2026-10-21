import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, Clock, CheckCircle } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { getStats } from '@/api/adminApi';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      const errorMsg = queryError?.message || 'Error al cargar estadísticas';
      setError(errorMsg);
      console.error('Stats error:', queryError);
    }
  }, [isError, queryError]);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold text-white font-display mb-2">
          Bienvenido al Panel de Control
        </h2>
        <p className="text-muted-foreground">
          Aquí puedes gestionar todos los aspectos de tu negocio
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600/10 border border-red-600/30 text-red-400 rounded-lg p-4 text-sm">
          <p className="font-medium mb-1">Error al cargar estadísticas</p>
          <p className="text-xs">{error}</p>
          <p className="text-xs mt-2 text-red-400/70">
            Verifica que tu API esté disponible en: https://api.floresmarketing.com.mx/api/admin/stats
          </p>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Negocios Registrados"
          value={stats?.businesses_total || 0}
          description="Total en el sistema"
          icon={Building2}
          isLoading={isLoading}
        />
        <StatCard
          title="Negocios Activos"
          value={stats?.businesses_active || 0}
          description="Operando actualmente"
          icon={CheckCircle}
          isLoading={isLoading}
        />
        <StatCard
          title="Usuarios"
          value={stats?.users_total || 0}
          description="Registrados en el sistema"
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title="Citas Pendientes"
          value={stats?.pending_appointments || 0}
          description="Por confirmar"
          icon={Clock}
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions / Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Panel de información */}
        <div className="bg-gradient-to-br from-champagne/10 to-transparent border border-champagne/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white font-display mb-4">
            Información Importante
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-champagne mt-1">•</span>
              <span>
                Accede al módulo de <strong>Negocios</strong> para crear, editar o eliminar establecimientos
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-champagne mt-1">•</span>
              <span>
                Monitorea el estado de todos tus negocios en tiempo real
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-champagne mt-1">•</span>
              <span>
                Gestiona usuarios y sus permisos en el módulo de Usuarios
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-champagne mt-1">•</span>
              <span>
                Consulta reportes detallados en el módulo de Reportes
              </span>
            </li>
          </ul>
        </div>

        {/* Instrucciones de desarrollo */}
        <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white font-display mb-4">
            Integración de API
          </h3>
          <div className="space-y-3 text-xs text-muted-foreground font-mono bg-black/30 p-4 rounded">
            <p className="text-blue-400">
              <span className="text-champagne"># Endpoint esperado:</span>
            </p>
            <p className="text-white/70">
              GET /api/admin/stats
            </p>
            <p className="text-blue-400 mt-3">
              <span className="text-champagne"># Respuesta esperada:</span>
            </p>
            <p className="text-white/70 break-all">
              {`{`}
              <br />
              {`  "businesses_total": 15,`}
              <br />
              {`  "businesses_active": 13,`}
              <br />
              {`  "users_total": 45,`}
              <br />
              {`  "pending_appointments": 28`}
              <br />
              {`}`}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            El token se envía automáticamente en el header Authorization
          </p>
        </div>
      </div>
    </div>
  );
}
