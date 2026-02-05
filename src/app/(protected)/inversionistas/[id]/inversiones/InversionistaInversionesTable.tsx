'use client';

/**
 * InversionistaInversionesTable Component
 *
 * Table for displaying investments in an inversionista context.
 * Shows project name, commitment, contributed, and status.
 *
 * @see INVE-001
 */

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableSearch } from '@/components/ui/TableExtras';
import { InversionListItem, InversionEstado } from '@/lib/actions/inversiones/inversiones-queries';

// =============================================================================
// Types
// =============================================================================

interface InversionistaInversionesTableProps {
  inversiones: InversionListItem[];
}

// Estado badge configuration
const estadoConfig: Record<InversionEstado, { label: string; color: string }> = {
  pendiente: { label: 'Pendiente', color: '#6b7280' },
  parcial: { label: 'Parcial', color: '#f59e0b' },
  completado: { label: 'Completado', color: '#10b981' },
  excedido: { label: 'Excedido', color: '#8b5cf6' },
};

// =============================================================================
// Helpers
// =============================================================================

function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// =============================================================================
// Component
// =============================================================================

export function InversionistaInversionesTable({ inversiones }: InversionistaInversionesTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  // Filter by proyecto name
  const filteredInversiones = useMemo(() => {
    if (!search) return inversiones;
    const searchLower = search.toLowerCase();
    return inversiones.filter((inv) => inv.proyectoNombre.toLowerCase().includes(searchLower));
  }, [inversiones, search]);

  // Navigate to investment detail (placeholder for INVE-003)
  const handleRowClick = (inversion: InversionListItem) => {
    // TODO: Update route when INVE-003 is implemented
    router.push(`/inversiones/${inversion.id}`);
  };

  // Table columns
  const columns: TableColumn<InversionListItem>[] = [
    {
      id: 'proyecto',
      header: 'Proyecto',
      sortable: true,
      accessor: (inversion) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate font-medium">{inversion.proyectoNombre}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'compromiso',
      header: 'Compromiso',
      className: 'text-right',
      accessor: (inversion) => (
        <span className="text-foreground font-medium">{formatCurrency(inversion.compromiso)}</span>
      ),
    },
    {
      id: 'aportado',
      header: 'Aportado',
      className: 'text-right hidden md:table-cell',
      accessor: (inversion) => (
        <span className="text-muted-foreground">{formatCurrency(inversion.capitalAportado)}</span>
      ),
    },
    {
      id: 'estado',
      header: 'Estado',
      sortable: true,
      accessor: (inversion) => {
        const config = estadoConfig[inversion.estado];
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
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-lg font-semibold">Inversiones</h2>
        <p className="text-muted-foreground text-sm">
          Proyectos en los que participa este inversionista
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Buscar
          </label>
          <TableSearch value={search} onChange={setSearch} placeholder="Nombre del proyecto..." />
        </div>
        <div className="flex-1" />
        {/* Add button will be added in INVE-002 */}
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
          data={filteredInversiones}
          columns={columns}
          keyExtractor={(inversion) => inversion.id}
          pageSize={20}
          showSearch={false}
          showPagination={true}
          alwaysShowPagination={true}
          emptyMessage="No hay inversiones registradas"
          className="rounded-none border-0 shadow-none"
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}
