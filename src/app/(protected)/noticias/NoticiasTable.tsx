'use client';

/**
 * NoticiasTable
 *
 * Client component with DataTable for noticias list.
 * Includes filters by fondo and estado, plus create dialog.
 *
 * @see NEWS-001
 */

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Newspaper, Plus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { CreateNoticiaDialog } from '@/components/noticias/CreateNoticiaDialog';
import type { NoticiaListItem } from '@/lib/actions/noticias/noticias-queries';

interface NoticiasTableProps {
  noticias: NoticiaListItem[];
  fondos: { id: string; nombre: string }[];
  initialFondoId?: string;
  initialEstado?: string;
}

export function NoticiasTable({
  noticias,
  fondos,
  initialFondoId,
  initialEstado,
}: NoticiasTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFondo, setSelectedFondo] = useState<string | undefined>(initialFondoId);
  const [selectedEstado, setSelectedEstado] = useState<string | undefined>(initialEstado);

  // Update URL params when filters change
  const updateFilters = (fondoId?: string, estado?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (fondoId) {
      params.set('fondoId', fondoId);
    } else {
      params.delete('fondoId');
    }

    if (estado) {
      params.set('estado', estado);
    } else {
      params.delete('estado');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFondoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fondoId = e.target.value === 'all' ? undefined : e.target.value;
    setSelectedFondo(fondoId);
    updateFilters(fondoId, selectedEstado);
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const estado = e.target.value === 'all' ? undefined : e.target.value;
    setSelectedEstado(estado);
    updateFilters(selectedFondo, estado);
  };

  const columns: TableColumn<NoticiaListItem>[] = [
    {
      id: 'titulo',
      header: 'Título',
      sortable: true,
      accessor: (row: NoticiaListItem) => (
        <div className="flex items-center gap-2">
          <Newspaper className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="font-medium">{row.titulo}</span>
        </div>
      ),
    },
    {
      id: 'fondoNombre',
      header: 'Fondo',
      accessor: (row: NoticiaListItem) => (
        <Badge variant={row.fondoId ? 'info' : 'default'}>{row.fondoNombre}</Badge>
      ),
    },
    {
      id: 'estado',
      header: 'Estado',
      accessor: (row: NoticiaListItem) => {
        const isPublicado = row.estado === 'publicado';
        return (
          <Badge variant={isPublicado ? 'success' : 'warning'} className="gap-1">
            {isPublicado ? (
              <>
                <Eye className="h-3 w-3" /> Publicado
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3" /> Borrador
              </>
            )}
          </Badge>
        );
      },
    },
    {
      id: 'createdAt',
      header: 'Fecha',
      accessor: (row: NoticiaListItem) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '—',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Noticias</h1>
          <p className="text-muted-foreground text-sm">Gestiona las noticias y comunicados</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} data-testid="create-noticia-btn">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Noticia
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-fondo" className="text-sm font-medium">
            Fondo:
          </label>
          <select
            id="filter-fondo"
            value={selectedFondo || 'all'}
            onChange={handleFondoChange}
            className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
          >
            <option value="all">Todos</option>
            <option value="general">General</option>
            {fondos.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filter-estado" className="text-sm font-medium">
            Estado:
          </label>
          <select
            id="filter-estado"
            value={selectedEstado || 'all'}
            onChange={handleEstadoChange}
            className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
          >
            <option value="all">Todos</option>
            <option value="borrador">Borrador</option>
            <option value="publicado">Publicado</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={noticias}
        keyExtractor={(row) => row.id}
        searchableColumns={['titulo']}
        searchPlaceholder="Buscar por título..."
        emptyMessage="No hay noticias"
        emptyIcon={Newspaper}
      />

      {/* Create Dialog */}
      <CreateNoticiaDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} fondos={fondos} />
    </div>
  );
}
