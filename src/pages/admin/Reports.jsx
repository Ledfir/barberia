import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Reports() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-display mb-2">
          Reportes
        </h2>
        <p className="text-muted-foreground">
          Análisis y reportes de tu negocio
        </p>
      </div>

      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">
          En Construcción
        </h3>
        <p className="text-muted-foreground max-w-md">
          Este módulo está siendo desarrollado. Próximamente podrás ver reportes 
          detallados, gráficos y análisis de tu negocio.
        </p>
      </div>

      {/* Información de desarrollo */}
      <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white font-display mb-4">
          Funcionalidades Planeadas
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-champagne">•</span>
            <span>Gráficos de ingresos y citas</span>
          </li>
          <li className="flex gap-2">
            <span className="text-champagne">•</span>
            <span>Reportes por período de tiempo</span>
          </li>
          <li className="flex gap-2">
            <span className="text-champagne">•</span>
            <span>Exportación a PDF y CSV</span>
          </li>
          <li className="flex gap-2">
            <span className="text-champagne">•</span>
            <span>Análisis de desempeño por negocio</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
