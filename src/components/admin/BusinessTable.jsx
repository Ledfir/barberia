import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Building2 } from 'lucide-react';

export default function BusinessTable({
  businesses = [],
  isLoading = false,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-champagne/30 mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">No hay negocios registrados</p>
      </div>
    );
  }

  return (
    <div className="border border-champagne/10 rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-champagne/10 bg-white/5">
              <th className="px-6 py-3 text-left text-xs font-semibold text-champagne uppercase tracking-[0.3em]">
                Negocio
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-champagne uppercase tracking-[0.3em]">
                Sucursal
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-champagne uppercase tracking-[0.3em]">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-champagne uppercase tracking-[0.3em]">
                Administrador
              </th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr
                key={business.id}
                className="border-b border-champagne/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{business.nombre || business.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{business.sucursal_nombre}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {business.telefono && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {business.telefono}
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {business.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-white">{business.admin_nombre}</p>
                    {business.admin_email && (
                      <p className="text-xs text-muted-foreground">{business.admin_email}</p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {businesses.map((business) => (
          <div
            key={business.id}
            className="bg-white/5 border border-champagne/10 rounded-lg p-4 space-y-3"
          >
            <div>
              <p className="text-white font-medium">{business.nombre || business.name}</p>
              <p className="text-xs text-muted-foreground">{business.sucursal_nombre}</p>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              {business.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {business.telefono}
                </div>
              )}
              {business.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {business.email}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-champagne/10">
              <p className="text-xs text-champagne font-semibold mb-1">Administrador:</p>
              <p className="text-sm text-white">{business.admin_nombre}</p>
              {business.admin_email && (
                <p className="text-xs text-muted-foreground">{business.admin_email}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
