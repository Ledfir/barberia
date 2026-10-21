# Ejemplos de Integración - Panel de Usuario

Este archivo contiene ejemplos de código para extender y personalizar el panel de usuario.

## 📋 Tabla de Contenidos
1. [Mostrar Reservaciones Reales](#mostrar-reservaciones-reales)
2. [Editar Perfil del Usuario](#editar-perfil-del-usuario)
3. [Agregar Nueva Pestaña](#agregar-nueva-pestaña)
4. [Cancelar Reservaciones](#cancelar-reservaciones)
5. [Descargar Recibo en PDF](#descargar-recibo-en-pdf)

---

## Mostrar Reservaciones Reales

### Paso 1: Crear un servicio para obtener reservaciones

```javascript
// src/services/reservacionesUsuario.js

import { base44 } from '@/api/base44Client';

export async function obtenerMisReservaciones() {
  try {
    const response = await base44.api.call({
      method: 'GET',
      endpoint: '/reservaciones/usuario',
    });
    return response;
  } catch (error) {
    console.error('Error al obtener reservaciones:', error);
    throw error;
  }
}

export async function cancelarReservacion(reservacionId) {
  try {
    const response = await base44.api.call({
      method: 'DELETE',
      endpoint: `/reservaciones/${reservacionId}`,
    });
    return response;
  } catch (error) {
    console.error('Error al cancelar reservación:', error);
    throw error;
  }
}
```

### Paso 2: Integrar en UserDashboard.jsx

```jsx
import { useQuery } from '@tanstack/react-query';
import { obtenerMisReservaciones } from '@/services/reservacionesUsuario';

// Dentro del componente UserDashboard:

{activeTab === 'reservations' && (
  <div className="bg-black/30 border border-champagne/10 rounded-lg p-8">
    <h2 className="text-2xl font-bold text-white mb-6">Mis Reservaciones</h2>
    <MisReservaciones />
  </div>
)}

// Componente nuevo:
function MisReservaciones() {
  const { data: reservaciones, isLoading, error } = useQuery({
    queryKey: ['mis-reservaciones'],
    queryFn: obtenerMisReservaciones,
  });

  if (isLoading) return <div className="text-champagne">Cargando...</div>;
  if (error) return <div className="text-red-400">Error al cargar</div>;
  if (!reservaciones?.length) {
    return (
      <div className="bg-black/40 border border-champagne/10 rounded-lg p-6 text-center">
        <Calendar className="w-12 h-12 text-champagne/40 mx-auto mb-4" />
        <p className="text-champagne/60">No tienes reservaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservaciones.map((reserva) => (
        <div key={reserva.id} className="bg-black/40 border border-champagne/10 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-semibold">{reserva.servicio}</h3>
              <p className="text-champagne/60 text-sm">
                Con: {reserva.barbero || 'Barbero disponible'}
              </p>
              <p className="text-champagne/60 text-sm">
                📅 {new Date(reserva.fecha).toLocaleDateString('es-MX')} a las {reserva.hora}
              </p>
            </div>
            <button className="text-red-400 hover:text-red-300 text-sm">
              Cancelar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Editar Perfil del Usuario

### Crear componente de edición de perfil

```jsx
// src/components/EditProfileForm.jsx

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function EditProfileForm() {
  const { user, checkUserAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.updateProfile(formData);
      await checkUserAuth(); // Recargar datos del usuario
      setMessage('✅ Perfil actualizado exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al actualizar perfil');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-champagne/60 text-sm">Nombre</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 bg-black/40 border-champagne/20"
        />
      </div>
      <div>
        <label className="text-champagne/60 text-sm">Teléfono</label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 bg-black/40 border-champagne/20"
        />
      </div>
      <div>
        <label className="text-champagne/60 text-sm">Email</label>
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled
          className="mt-1 bg-black/40 border-champagne/20 opacity-60"
        />
        <p className="text-champagne/40 text-xs mt-1">El email no puede ser modificado</p>
      </div>
      {message && (
        <div className={`p-2 rounded text-sm ${message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message}
        </div>
      )}
      <Button 
        type="submit" 
        disabled={loading}
        className="bg-champagne text-black hover:bg-champagne/90"
      >
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  );
}
```

### Usar en UserDashboard

```jsx
import EditProfileForm from '@/components/EditProfileForm';

{activeTab === 'profile' && (
  <div className="bg-black/30 border border-champagne/10 rounded-lg p-8">
    {/* ... datos del usuario ... */}
    <div className="pt-6 border-t border-champagne/10">
      <h3 className="text-lg font-semibold text-white mb-4">Editar Información</h3>
      <EditProfileForm />
    </div>
  </div>
)}
```

---

## Agregar Nueva Pestaña

### Ejemplo: Historial de Citas

```jsx
// En UserDashboard.jsx, en el sidebar:

<button
  onClick={() => setActiveTab('history')}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
    activeTab === 'history'
      ? 'bg-champagne/20 text-champagne border border-champagne/30'
      : 'text-champagne/60 hover:text-champagne hover:bg-champagne/10'
  }`}
>
  <Clock className="w-4 h-4" />
  <span className="font-medium">Historial</span>
</button>

// En el área de contenido:

{activeTab === 'history' && (
  <div className="bg-black/30 border border-champagne/10 rounded-lg p-8">
    <h2 className="text-2xl font-bold text-white mb-6">Historial de Citas</h2>
    <div className="space-y-3">
      <div className="bg-black/40 border border-champagne/10 rounded-lg p-4">
        <p className="text-champagne/60 text-sm">15 Oct 2026</p>
        <p className="text-white font-semibold">Corte Premium</p>
        <p className="text-champagne/60 text-sm">Realizado con: Juan López</p>
      </div>
      {/* Más citas... */}
    </div>
  </div>
)}
```

---

## Cancelar Reservaciones

```jsx
// En el componente de reservaciones

function ReservationCard({ reserva }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCancel = async () => {
    if (!window.confirm('¿Deseas cancelar esta reservación?')) return;
    
    setLoading(true);
    try {
      await cancelarReservacion(reserva.id);
      queryClient.invalidateQueries({ queryKey: ['mis-reservaciones'] });
      // Mostrar toast de éxito
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-champagne/10 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-semibold">{reserva.servicio}</h3>
          <p className="text-champagne/60 text-sm">
            {new Date(reserva.fecha).toLocaleDateString('es-MX')} a las {reserva.hora}
          </p>
        </div>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
        >
          {loading ? 'Cancelando...' : 'Cancelar'}
        </button>
      </div>
    </div>
  );
}
```

---

## Descargar Recibo en PDF

### Instalar dependencias

```bash
npm install jspdf html2canvas
```

### Crear función de descarga

```jsx
// src/utils/generarReciboPDF.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function descargarReciboPDF(reservacionId, datos) {
  const pdf = new jsPDF();
  
  // Configurar fuente y colores
  pdf.setFont('helvetica');
  pdf.setTextColor(212, 175, 55); // Color champagne
  
  // Título
  pdf.setFontSize(16);
  pdf.text('CONFIRMACIÓN DE RESERVACIÓN', 20, 20);
  
  // Número de reservación
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Número: ${datos.numeroReservacion}`, 20, 30);
  
  // Información del cliente
  pdf.setTextColor(0, 0, 0);
  pdf.text('DATOS DEL CLIENTE', 20, 45);
  pdf.text(`Nombre: ${datos.cliente.nombre}`, 20, 55);
  pdf.text(`Email: ${datos.cliente.email}`, 20, 65);
  pdf.text(`Teléfono: ${datos.cliente.telefono}`, 20, 75);
  
  // Información de la cita
  pdf.setTextColor(212, 175, 55);
  pdf.text('INFORMACIÓN DE LA CITA', 20, 95);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Servicio: ${datos.servicio}`, 20, 105);
  pdf.text(`Barbero: ${datos.barbero || 'Por asignar'}`, 20, 115);
  pdf.text(`Fecha: ${datos.fecha}`, 20, 125);
  pdf.text(`Hora: ${datos.hora}`, 20, 135);
  
  // Guardar PDF
  pdf.save(`recibo-${reservacionId}.pdf`);
}
```

### Usar en el componente

```jsx
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { descargarReciboPDF } from '@/utils/generarReciboPDF';

function ReservationCard({ reserva }) {
  const handleDescargar = () => {
    descargarReciboPDF(reserva.id, {
      numeroReservacion: reserva.numero,
      cliente: {
        nombre: user.name,
        email: user.email,
        telefono: user.phone,
      },
      servicio: reserva.servicio,
      barbero: reserva.barbero,
      fecha: new Date(reserva.fecha).toLocaleDateString('es-MX'),
      hora: reserva.hora,
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleDescargar}
        className="gap-2 bg-champagne text-black hover:bg-champagne/90"
      >
        <Download size={16} />
        Descargar Recibo
      </Button>
    </div>
  );
}
```

---

## Hooks Útiles

### useUserReservations
```jsx
function useUserReservations() {
  return useQuery({
    queryKey: ['reservaciones-usuario'],
    queryFn: obtenerMisReservaciones,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
```

### useUpdateProfile
```jsx
function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { checkUserAuth } = useAuth();

  return useMutation({
    mutationFn: async (data) => {
      await base44.auth.updateProfile(data);
    },
    onSuccess: async () => {
      await checkUserAuth();
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
```

---

## Validación de Formularios

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().regex(/^\d{10}$/, 'Teléfono inválido'),
  email: z.string().email('Email inválido'),
});

function EditProfileForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

---

**¡Usa estos ejemplos para extender tu panel! 🚀**
