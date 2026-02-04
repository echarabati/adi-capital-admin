'use client';

/**
 * FondosTable Component
 *
 * Client component for displaying the list of funds.
 * Uses DataTable with search filter and navigation.
 * Super Admin can create and edit fondos.
 *
 * @see FOND-001, FOND-002
 */

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Pencil } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableSearch } from '@/components/ui/TableExtras';
import { FondoListItem } from '@/lib/actions/fondos/fondos-queries';
import { isSuperAdmin } from '@/src/config/roles';
import { FondoFormDialog } from './FondoFormDialog';

// =============================================================================
// Types
// =============================================================================

interface FondosTableProps {
  fondos: FondoListItem[];
  userRole?: string;
}

type FondoForEdit = Pick<FondoListItem, 'id' | 'nombre' | 'monedaBase'> & {
  metodoCascada?: string;
};

// Currency badge colors
const currencyColors: Record<string, string> = {
  MXN: '#10b981',
  USD: '#3b82f6',
  EUR: '#8b5cf6',
  ILS: '#f59e0b',
};

// =============================================================================
// Component
// =============================================================================

export function FondosTable({ fondos, userRole }: FondosTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editFondo, setEditFondo] = useState<FondoForEdit | null>(null);

  const canManage = isSuperAdmin(userRole ?? '');

  // Apply search filter
  const filteredFondos = useMemo(() => {
    if (!search) return fondos;
    const searchLower = search.toLowerCase();
    return fondos.filter(
      (fondo) =>
        fondo.nombre.toLowerCase().includes(searchLower) ||
        fondo.slug.toLowerCase().includes(searchLower)
    );
  }, [fondos, search]);

  // Handle row click
  function handleRowClick(fondo: FondoListItem) {
    router.push(`/fondos/${fondo.id}`);
  }

  // Table columns
  const columns: TableColumn<FondoListItem>[] = [
    {
      id: 'nombre',
      header: 'Nombre',
      sortable: true,
      accessor: (fondo) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate font-medium">{fondo.nombre}</p>
            <p className="text-muted-foreground truncate text-xs">{fondo.slug}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'monedaBase',
      header: 'Moneda',
      className: 'hidden md:table-cell',
      accessor: (fondo) => {
        const color = currencyColors[fondo.monedaBase] || '#6b7280';
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {fondo.monedaBase}
          </span>
        );
      },
    },
    {
      id: 'proyectosCount',
      header: 'Proyectos',
      sortable: true,
      className: 'hidden lg:table-cell text-center',
      accessor: (fondo) => <span className="text-muted-foreground">{fondo.proyectosCount}</span>,
    },
    // Actions column (super_admin only)
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            className: 'w-12',
            accessor: (fondo: FondoListItem) => (
              <button
                className="hover:bg-secondary rounded-lg p-1.5 transition-colors"
                title="Editar"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditFondo({
                    id: fondo.id,
                    nombre: fondo.nombre,
                    monedaBase: fondo.monedaBase,
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
        <h2 className="text-foreground text-lg font-semibold">Fondos</h2>
        <p className="text-muted-foreground text-sm">Gestión de fondos de inversión</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Buscar
          </label>
          <TableSearch value={search} onChange={setSearch} placeholder="Nombre del fondo..." />
        </div>
        <div className="flex-1" />

        {/* Create Button (super_admin only) */}
        {canManage && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo Fondo
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
          data={filteredFondos}
          columns={columns}
          keyExtractor={(fondo) => fondo.id}
          pageSize={20}
          showSearch={false}
          showPagination={true}
          alwaysShowPagination={true}
          emptyMessage="No tienes fondos asignados"
          className="rounded-none border-0 shadow-none"
          onRowClick={handleRowClick}
        />
      </div>

      {/* Create Dialog */}
      <FondoFormDialog mode="create" open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {/* Edit Dialog */}
      {editFondo && (
        <FondoFormDialog
          mode="edit"
          open={true}
          onOpenChange={(open) => !open && setEditFondo(null)}
          fondo={editFondo}
        />
      )}
    </div>
  );
}
