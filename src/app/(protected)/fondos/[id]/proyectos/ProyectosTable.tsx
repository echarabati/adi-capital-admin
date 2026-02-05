'use client';

/**
 * ProyectosTable Component
 *
 * Client component for displaying projects with filters, navigation, and CRUD.
 *
 * @see PROJ-001, PROJ-002
 */

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen, Users, Plus, Pencil } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableSearch } from '@/components/ui/TableExtras';
import { ProyectoListItem } from '@/lib/actions/proyectos/proyectos-queries';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';
import { ProyectoFormDialog } from './ProyectoFormDialog';

// =============================================================================
// Types
// =============================================================================

interface ProyectosTableProps {
  proyectos: ProyectoListItem[];
  fondoId: string;
  userRole?: string;
}

type EstadoFilter = 'all' | 'inversion_abierta' | 'inversion_cerrada' | 'concluido';

type ProyectoForEdit = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  tasaPref: string | null;
  successFeePct: string | null;
  metodoCascada: string | null;
};

// Estado badge colors
const estadoConfig: Record<string, { label: string; color: string }> = {
  inversion_abierta: { label: 'Inversión Abierta', color: '#10b981' },
  inversion_cerrada: { label: 'Inversión Cerrada', color: '#f59e0b' },
  concluido: { label: 'Concluido', color: '#6b7280' },
};

// =============================================================================
// Component
// =============================================================================

export function ProyectosTable({ proyectos, fondoId, userRole }: ProyectosTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProyecto, setEditProyecto] = useState<ProyectoForEdit | null>(null);

  const canManage =
    isSuperAdmin(userRole ?? '') || hasRoleOrHigher(userRole ?? '', ROLES.ADMIN_FONDO);

  // Apply filters
  const filteredProyectos = useMemo(() => {
    let filtered = proyectos;

    // Estado filter
    if (estadoFilter !== 'all') {
      filtered = filtered.filter((p) => p.estado === estadoFilter);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((p) => p.nombre.toLowerCase().includes(searchLower));
    }

    return filtered;
  }, [proyectos, estadoFilter, search]);

  // Navigate to project detail
  const handleRowClick = (proyecto: ProyectoListItem) => {
    router.push(`/fondos/${fondoId}/proyectos/${proyecto.id}`);
  };

  // Table columns
  const columns: TableColumn<ProyectoListItem>[] = [
    {
      id: 'nombre',
      header: 'Proyecto',
      sortable: true,
      accessor: (proyecto) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate font-medium">{proyecto.nombre}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'estado',
      header: 'Estado',
      sortable: true,
      accessor: (proyecto) => {
        const config = estadoConfig[proyecto.estado] || estadoConfig.inversion_abierta;
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      id: 'successFeePct',
      header: 'Success Fee',
      className: 'hidden md:table-cell',
      accessor: (proyecto) => (
        <span className="text-muted-foreground text-sm">
          {proyecto.successFeePct ? `${proyecto.successFeePct}%` : '—'}
        </span>
      ),
    },
    {
      id: 'inversionistasCount',
      header: 'Inversionistas',
      className: 'hidden lg:table-cell',
      accessor: (proyecto) => (
        <div className="flex items-center gap-1.5">
          <Users className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{proyecto.inversionistasCount}</span>
        </div>
      ),
    },
    // Actions column
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            className: 'w-12',
            accessor: (proyecto: ProyectoListItem) => (
              <button
                className="hover:bg-secondary rounded-lg p-1.5 transition-colors"
                title="Editar"
                onClick={(e) => {
                  e.stopPropagation();
                  // Cast to access full proyecto with new fields
                  const p = proyecto as ProyectoListItem & {
                    codigo?: string;
                    tasaPref?: string | null;
                  };
                  setEditProyecto({
                    id: proyecto.id,
                    codigo: p.codigo || '',
                    nombre: proyecto.nombre,
                    descripcion: null, // Will be fetched from full data
                    tasaPref: p.tasaPref || '12.00',
                    successFeePct: proyecto.successFeePct,
                    metodoCascada: null,
                  });
                }}
              >
                <Pencil className="text-muted-foreground h-4 w-4" />
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-lg font-semibold">Proyectos</h2>
        <p className="text-muted-foreground text-sm">Proyectos de inversión del fondo</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        <div className="min-w-48 flex-1 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Buscar
          </label>
          <TableSearch value={search} onChange={setSearch} placeholder="Nombre del proyecto..." />
        </div>

        {/* Estado Filter */}
        <div className="min-w-32">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Estado
          </label>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value as EstadoFilter)}
            className="border-input bg-background text-foreground focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2"
          >
            <option value="all">Todos</option>
            <option value="inversion_abierta">Inversión Abierta</option>
            <option value="inversion_cerrada">Inversión Cerrada</option>
            <option value="concluido">Concluido</option>
          </select>
        </div>

        <div className="flex-1" />

        {/* Create Button */}
        {canManage && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </button>
        )}
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <DataTable
          data={filteredProyectos}
          columns={columns}
          keyExtractor={(proyecto) => proyecto.id}
          pageSize={20}
          showSearch={false}
          showPagination={true}
          alwaysShowPagination={true}
          emptyMessage="No hay proyectos registrados"
          className="rounded-none border-0 shadow-none"
          onRowClick={handleRowClick}
        />
      </div>

      {/* Create Dialog */}
      <ProyectoFormDialog
        mode="create"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        fondoId={fondoId}
      />

      {/* Edit Dialog */}
      {editProyecto && (
        <ProyectoFormDialog
          mode="edit"
          open={true}
          onOpenChange={(open) => !open && setEditProyecto(null)}
          fondoId={fondoId}
          proyecto={editProyecto}
        />
      )}
    </div>
  );
}
