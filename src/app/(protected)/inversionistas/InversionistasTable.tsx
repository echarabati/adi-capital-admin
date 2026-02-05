'use client';

/**
 * InversionistasTable Component
 *
 * Client component for displaying the list of investors.
 * Uses DataTable with search and fondo filter.
 *
 * @see INV-001
 */

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableSearch } from '@/components/ui/TableExtras';
import { InversionistaListItem } from '@/lib/actions/inversionistas/inversionistas-queries';

// =============================================================================
// Types
// =============================================================================

interface InversionistasTableProps {
  inversionistas: InversionistaListItem[];
  fondos: { id: string; nombre: string }[];
  initialFondoId?: string;
}

// =============================================================================
// Component
// =============================================================================

export function InversionistasTable({
  inversionistas,
  fondos,
  initialFondoId,
}: InversionistasTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedFondoId, setSelectedFondoId] = useState(initialFondoId || '');

  // Apply client-side filters
  const filteredInversionistas = useMemo(() => {
    let result = inversionistas;

    // Filter by fondo
    if (selectedFondoId) {
      result = result.filter((inv) => inv.fondos.some((f) => f.id === selectedFondoId));
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.nombre.toLowerCase().includes(searchLower) ||
          (inv.email && inv.email.toLowerCase().includes(searchLower))
      );
    }

    return result;
  }, [inversionistas, selectedFondoId, search]);

  // Handle row click - navigate to detail
  function handleRowClick(inv: InversionistaListItem) {
    router.push(`/inversionistas/${inv.id}`);
  }

  // Table columns
  const columns: TableColumn<InversionistaListItem>[] = [
    {
      id: 'nombre',
      header: 'Nombre',
      sortable: true,
      accessor: (inv) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate font-medium">{inv.nombre}</p>
            {inv.email && <p className="text-muted-foreground truncate text-xs">{inv.email}</p>}
          </div>
        </div>
      ),
    },
    {
      id: 'fondos',
      header: 'Fondos',
      className: 'hidden md:table-cell',
      accessor: (inv) => (
        <div className="flex flex-wrap gap-1">
          {inv.fondos.slice(0, 3).map((fondo) => (
            <span
              key={fondo.id}
              className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs"
            >
              {fondo.nombre}
            </span>
          ))}
          {inv.fondos.length > 3 && (
            <span className="text-muted-foreground text-xs">+{inv.fondos.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      id: 'esFundador',
      header: 'Fundador',
      className: 'hidden lg:table-cell text-center',
      accessor: (inv) =>
        inv.esFundador ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            Fundador
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-lg font-semibold">Inversionistas</h2>
        <p className="text-muted-foreground text-sm">Gestión de inversionistas del fondo</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        <div className="min-w-48 flex-1 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Buscar
          </label>
          <TableSearch value={search} onChange={setSearch} placeholder="Nombre, email..." />
        </div>

        {/* Fondo Filter */}
        <div className="min-w-40 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Fondo
          </label>
          <select
            value={selectedFondoId}
            onChange={(e) => setSelectedFondoId(e.target.value)}
            className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <option value="">Todos los fondos</option>
            {fondos.map((fondo) => (
              <option key={fondo.id} value={fondo.id}>
                {fondo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1" />
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
          data={filteredInversionistas}
          columns={columns}
          keyExtractor={(inv) => inv.id}
          pageSize={20}
          showSearch={false}
          showPagination={true}
          alwaysShowPagination={true}
          emptyMessage="No hay inversionistas registrados"
          className="rounded-none border-0 shadow-none"
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}
