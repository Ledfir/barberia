import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, AlertCircle } from 'lucide-react';

// Validación con Zod - Según estructura de API de CodeIgniter
const businessSchema = z.object({
  tipo_negocio_id: z.string().min(1, 'Selecciona un tipo de negocio'),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional().or(z.literal('')),
  sucursal_nombre: z.string().min(3, 'El nombre de la sucursal es obligatorio'),
  admin_nombre: z.string().min(3, 'El nombre del administrador es obligatorio'),
  admin_email: z.string().email('Email del administrador inválido'),
  admin_password: z.string().min(12, 'La contraseña debe tener mínimo 12 caracteres'),
});

// Tipos de negocio por defecto (ajusta según tu API)
const BUSINESS_TYPES = [
  { id: '1', name: 'Barbería' },
  { id: '2', name: 'Salón de Belleza' },
  { id: '3', name: 'Peluquería' },
  { id: '4', name: 'Spa' },
];

export default function BusinessForm({
  isOpen,
  onClose,
  onSubmit,
  business = null,
  isLoading = false,
}) {
  const isEditMode = !!business;
  const [apiError, setApiError] = useState(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      tipo_negocio_id: '',
      nombre: '',
      email: '',
      telefono: '',
      sucursal_nombre: '',
      admin_nombre: '',
      admin_email: '',
      admin_password: '',
    },
  });

  useEffect(() => {
    if (isOpen && business) {
      // En modo edición (aunque la API aún no lo soporta)
      setValue('tipo_negocio_id', String(business.tipo_negocio_id || ''));
      setValue('nombre', business.nombre || '');
      setValue('email', business.email || '');
      setValue('telefono', business.telefono || '');
      setValue('sucursal_nombre', business.sucursal_nombre || '');
      setValue('admin_nombre', business.admin_nombre || '');
      setValue('admin_email', business.admin_email || '');
    } else if (isOpen && !business) {
      // Limpiar formulario para crear nuevo
      reset();
    }
    setApiError(null);
  }, [isOpen, business, setValue, reset]);

  const handleFormSubmit = async (data) => {
    setApiError(null);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Manejar errores de validación de la API
      if (error.data?.errors) {
        // Si hay errores de validación del backend
        const errorMessages = Object.entries(error.data.errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        setApiError(errorMessages);
      } else {
        setApiError(error.message || 'Error al guardar el negocio');
      }
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-champagne/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white font-display">
            {isEditMode ? 'Editar Negocio (No disponible)' : 'Registrar Nuevo Negocio'}
          </DialogTitle>
        </DialogHeader>

        {/* Error de API */}
        {apiError && (
          <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-400 whitespace-pre-wrap">{apiError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Tipo de Negocio */}
          <div className="space-y-2">
            <Label htmlFor="tipo_negocio_id" className="text-champagne">
              Tipo de Negocio *
            </Label>
            <Controller
              name="tipo_negocio_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white/5 border-champagne/20 text-white">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-champagne/20">
                    {BUSINESS_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id} className="text-white hover:bg-champagne/10">
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo_negocio_id && (
              <p className="text-xs text-red-400">{errors.tipo_negocio_id.message}</p>
            )}
          </div>

          {/* Nombre del Negocio */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-champagne">
              Nombre del Negocio *
            </Label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Ej: Barbería Centro"
              className="bg-white/5 border-champagne/20 text-white placeholder:text-muted-foreground"
            />
            {errors.nombre && (
              <p className="text-xs text-red-400">{errors.nombre.message}</p>
            )}
          </div>

          {/* Email del Negocio */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-champagne">
              Email del Negocio
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Ej: info@barberia.mx"
              className="bg-white/5 border-champagne/20 text-white placeholder:text-muted-foreground"
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Teléfono del Negocio */}
          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-champagne">
              Teléfono del Negocio
            </Label>
            <Input
              id="telefono"
              {...register('telefono')}
              placeholder="Ej: +52 81 1234 5678"
              className="bg-white/5 border-champagne/20 text-white placeholder:text-muted-foreground"
            />
            {errors.telefono && (
              <p className="text-xs text-red-400">{errors.telefono.message}</p>
            )}
          </div>

          {/* Nombre de la Sucursal */}
          <div className="space-y-2">
            <Label htmlFor="sucursal_nombre" className="text-champagne">
              Nombre de la Sucursal *
            </Label>
            <Input
              id="sucursal_nombre"
              {...register('sucursal_nombre')}
              placeholder="Ej: Sucursal Centro"
              className="bg-white/5 border-champagne/20 text-white placeholder:text-muted-foreground"
            />
            {errors.sucursal_nombre && (
              <p className="text-xs text-red-400">{errors.sucursal_nombre.message}</p>
            )}
          </div>

          {/* Datos del Administrador */}
          <div className="pt-4 border-t border-champagne/10">
            <h3 className="text-sm font-semibold text-champagne mb-4">Datos del Administrador</h3>

            {/* Nombre del Admin */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="admin_nombre" className="text-champagne">
                Nombre del Administrador *
              </Label>
              <Input
                id="admin_nombre"
                {...register('admin_nombre')}
                placeholder="Ej: Juan Pérez"
                className="bg-white/5 border-champagne/20 text-white placeholder:text-muted-foreground"
              />
              {errors.admin_nombre && (
                <p className="text-xs text-red-400">{errors.admin_nombre.message}</p>
              )}
            </div>

            {/* Email del Admin */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="admin_email" className="text-champagne">
                Email del Administrador *
              </Label>
              <Input
                id="admin_email"
                type="email"
                {...register('admin_email')}
                placeholder="Ej: admin@barberia.mx"
                className="bg-white/5 border-champagne/20 text-white placeholder:text-muted-foreground"
              />
              {errors.admin_email && (
                <p className="text-xs text-red-400">{errors.admin_email.message}</p>
              )}
            </div>

            {/* Contraseña del Admin */}
            <div className="space-y-2">
              <Label htmlFor="admin_password" className="text-champagne">
                Contraseña Temporal (mín. 12 caracteres) *
              </Label>
              <Input
                id="admin_password"
                type="password"
                {...register('admin_password')}
                placeholder="Contraseña segura..."
                className="bg-white/5 border-champagne/20 text-white placeholder:text-muted-foreground"
              />
              {errors.admin_password && (
                <p className="text-xs text-red-400">{errors.admin_password.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                El administrador podrá cambiarla después de iniciar sesión por primera vez
              </p>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-4 border-t border-champagne/10">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground hover:bg-white/5"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isEditMode}
              className="bg-champagne/20 hover:bg-champagne/30 text-champagne disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrar Negocio'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
