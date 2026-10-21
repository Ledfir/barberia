import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import BusinessTable from '@/components/admin/BusinessTable';
import BusinessForm from '@/components/admin/BusinessForm';
import {
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from '@/api/adminApi';

export default function BusinessManagement() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Fetch negocios
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['businesses', { search: searchQuery, status: statusFilter, page }],
    queryFn: () =>
      getBusinesses({
        search: searchQuery,
        status: statusFilter,
        page,
        limit: 10,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Crear negocio
  const createMutation = useMutation({
    mutationFn: (data) => createBusiness(data),
    onSuccess: () => {
      toast.success('Negocio creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      setFormOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear negocio');
    },
  });

  // Actualizar negocio
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateBusiness(id, data),
    onSuccess: () => {
      toast.success('Negocio actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      setFormOpen(false);
      setSelectedBusiness(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar negocio');
    },
  });

  // Eliminar negocio
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBusiness(id),
    onSuccess: () => {
      toast.success('Negocio eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      setDeleteDialogOpen(false);
      setSelectedBusiness(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar negocio');
    },
  });

  const handleAddNew = () => {
    setSelectedBusiness(null);
    setFormOpen(true);
  };

  const handleEdit = (business) => {
    setSelectedBusiness(business);
    setFormOpen(true);
  };

  const handleDelete = (business) => {
    setSelectedBusiness(business);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (selectedBusiness) {
      // Editar
      updateMutation.mutate({
        id: selectedBusiness.id,
        data: formData,
      });
    } else {
      // Crear
      createMutation.mutate(formData);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBusiness) {
      deleteMutation.mutate(selectedBusiness.id);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold text-white font-display mb-2">
          Administración de Negocios
        </h2>
        <p className="text-muted-foreground">
          Gestiona todos tus negocios y establecimientos
        </p>
      </div>

      {/* Error Message */}
      {isError && (
        <div className="bg-red-600/10 border border-red-600/30 text-red-400 rounded-lg p-4 text-sm">
          <p className="font-medium mb-1">Error al cargar negocios</p>
          <p className="text-xs">{error?.message}</p>
        </div>
      )}

      {/* Filters & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-white/5 border-champagne/20 text-white placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter by Status */}
        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}>
          <SelectTrigger className="bg-white/5 border-champagne/20 text-white">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent className="bg-black border-champagne/20">
            <SelectItem value="" className="text-white hover:bg-champagne/10">
              Todos los estados
            </SelectItem>
            <SelectItem value="active" className="text-white hover:bg-champagne/10">
              ✓ Activos
            </SelectItem>
            <SelectItem value="inactive" className="text-white hover:bg-champagne/10">
              ✗ Inactivos
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Add New Button */}
        <Button
          onClick={handleAddNew}
          className="bg-champagne/20 hover:bg-champagne/30 text-champagne justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Negocio
        </Button>
      </div>

      {/* Table */}
      <BusinessTable
        businesses={data?.data || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination Info */}
      {data && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Mostrando {data.data?.length || 0} de {data.total || 0} negocios
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              variant="ghost"
              size="sm"
              className="text-champagne hover:bg-champagne/10 disabled:opacity-50"
            >
              Anterior
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= (data.pages || 1)}
              variant="ghost"
              size="sm"
              className="text-champagne hover:bg-champagne/10 disabled:opacity-50"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Business Form Modal */}
      <BusinessForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedBusiness(null);
        }}
        onSubmit={handleFormSubmit}
        business={selectedBusiness}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border-champagne/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              ¿Eliminar negocio?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              ¿Estás seguro de que deseas eliminar "{selectedBusiness?.name}"?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel className="bg-white/5 border-champagne/20 text-white hover:bg-white/10">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-400"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
