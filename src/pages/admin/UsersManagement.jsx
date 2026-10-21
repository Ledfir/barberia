import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function UsersManagement() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-display mb-2">
          Gestión de Usuarios
        </h2>
        <p className="text-muted-foreground">
          Administra usuarios y permisos del sistema
        </p>
      </div>

      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">
          En Construcción
        </h3>
        <p className="text-muted-foreground max-w-md">
          Este módulo está siendo desarrollado. Próximamente podrás gestionar usuarios, 
          roles y permisos desde aquí.
        </p>
      </div>

      {/* Información de desarrollo */}
      <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white font-display mb-4">
          Endpoints Esperados
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground font-mono bg-black/30 p-4 rounded">
          <p className="text-blue-400">GET /api/admin/users</p>
          <p className="text-blue-400">POST /api/admin/users</p>
          <p className="text-blue-400">PUT /api/admin/users/:id</p>
          <p className="text-blue-400">DELETE /api/admin/users/:id</p>
        </div>
      </div>
    </div>
  );
}
