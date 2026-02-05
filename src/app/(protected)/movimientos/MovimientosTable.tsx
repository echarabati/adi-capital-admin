'use client';

/**
 * MovimientosTable Component
 *
 * Client component for displaying the list of financial movements.
 * Uses DataTable with multiple filters: concepto, estado, fecha, fondo.
 *
 * @see MOV-001
 */

import { useState, useMemo } from 'react';
import { Plus, Filter, X } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableSearch } from '@/components/ui/TableExtras';
import { MovimientoListItem } from '@/lib/actions/movimientos/movimientos-queries';
import {
  CONCEPTO_LABELS,
  ESTADO_LABELS,
  CONCEPTO_GROUPS,
} from '@/lib/validations/movimientos/movimientos-validation';
import { MovimientoFormSheet } from './_components/MovimientoFormSheet';
import type { InversionSelectorItem } from '@/lib/actions/inversiones/inversiones-queries';

// =============================================================================
// Types
// =============================================================================

interface MovimientosTableProps {
  movimientos: MovimientoListItem[];
  fondos: { id: string; nombre: string }[];
  inversiones: InversionSelectorItem[];
  initialFilters?: {
    fondoId?: string;
    concepto?: string;
    estado?: string;
  };
}

// =============================================================================
// Helpers
// =============================================================================

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function formatMonto(monto: string, moneda: string): string {
  const num = parseFloat(monto);
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda === 'MXN' ? 'MXN' : moneda === 'USD' ? 'USD' : moneda,
    minimumFractionDigits: 2,
  });
  return formatter.format(num);
}

function getConceptoBadgeColor(concepto: string): string {
  // Ingresos (green)
  if (['APO', 'APO-D', 'APS', 'RET'].includes(concepto)) {
    return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
  }
  // Egresos (red)
  if (['DIS', 'DEV', 'FEE', 'INV', 'GAS', 'GASP', 'RPS'].includes(concepto)) {
    return 'bg-rose-500/20 text-rose-600 dark:text-rose-400';
  }
  // Admin/neutral (gray)
  return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
}

function getEstadoBadgeColor(estado: string): string {
  if (estado === 'confirmado') return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
  if (estado === 'cancelado') return 'bg-rose-500/20 text-rose-600 dark:text-rose-400';
  return 'bg-amber-500/20 text-amber-600 dark:text-amber-400'; // borrador
}

// =============================================================================
// Component
// =============================================================================

export function MovimientosTable({
  movimientos,
  fondos,
  inversiones,
  initialFilters = {},
}: MovimientosTableProps) {
  const [search, setSearch] = useState('');
  const [selectedFondoId, setSelectedFondoId] = useState(initialFilters.fondoId || '');
  const [selectedConcepto, setSelectedConcepto] = useState(initialFilters.concepto || '');
  const [selectedEstado, setSelectedEstado] = useState(initialFilters.estado || '');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Apply client-side filters
  const filteredMovimientos = useMemo(() => {
    let result = movimientos;

    // Filter by fondo
    if (selectedFondoId) {
      result = result.filter((mov) => mov.fondo?.id === selectedFondoId);
    }

    // Filter by concepto
    if (selectedConcepto) {
      result = result.filter((mov) => mov.concepto === selectedConcepto);
    }

    // Filter by estado
    if (selectedEstado) {
      result = result.filter((mov) => mov.estado === selectedEstado);
    }

    // Filter by search (descripcion, inversionista, proyecto)
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (mov) =>
          mov.descripcion?.toLowerCase().includes(searchLower) ||
          mov.inversionista?.nombre.toLowerCase().includes(searchLower) ||
          mov.proyecto?.nombre.toLowerCase().includes(searchLower) ||
          mov.fondo?.nombre.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [movimientos, selectedFondoId, selectedConcepto, selectedEstado, search]);

  const hasActiveFilters = selectedFondoId || selectedConcepto || selectedEstado;

  function clearFilters() {
    setSelectedFondoId('');
    setSelectedConcepto('');
    setSelectedEstado('');
    setSearch('');
  }

  // Table columns
  const columns: TableColumn<MovimientoListItem>[] = [
    {
      id: 'fecha',
      header: 'Fecha',
      className: 'w-28',
      sortable: true,
      accessor: (mov) => (
        <span className="text-muted-foreground text-sm">{formatDate(mov.fechaMovimiento)}</span>
      ),
    },
    {
      id: 'concepto',
      header: 'Concepto',
      className: 'w-40',
      accessor: (mov) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getConceptoBadgeColor(mov.concepto)}`}
        >
          {CONCEPTO_LABELS[mov.concepto] || mov.concepto}
        </span>
      ),
    },
    {
      id: 'monto',
      header: 'Monto',
      className: 'text-right w-32',
      sortable: true,
      accessor: (mov) => (
        <span className="text-foreground font-medium tabular-nums">
          {formatMonto(mov.monto, mov.moneda)}
        </span>
      ),
    },
    {
      id: 'moneda',
      header: 'Moneda',
      className: 'w-16 hidden md:table-cell',
      accessor: (mov) => <span className="text-muted-foreground text-xs">{mov.moneda}</span>,
    },
    {
      id: 'estado',
      header: 'Estado',
      className: 'w-28',
      accessor: (mov) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEstadoBadgeColor(mov.estado)}`}
        >
          {ESTADO_LABELS[mov.estado] || mov.estado}
        </span>
      ),
    },
    {
      id: 'fondo',
      header: 'Fondo',
      className: 'hidden lg:table-cell',
      accessor: (mov) => (
        <span className="text-muted-foreground text-sm">{mov.fondo?.nombre || '—'}</span>
      ),
    },
    {
      id: 'referencia',
      header: 'Referencia',
      className: 'hidden xl:table-cell',
      accessor: (mov) => (
        <div className="text-muted-foreground text-sm">
          {mov.inversionista && <span>{mov.inversionista.nombre}</span>}
          {mov.proyecto && !mov.inversionista && <span>{mov.proyecto.nombre}</span>}
          {!mov.inversionista && !mov.proyecto && <span>—</span>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-lg font-semibold">Movimientos</h2>
        <p className="text-muted-foreground text-sm">Transacciones financieras de los fondos</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        <div className="min-w-48 flex-1 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Buscar
          </label>
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Descripción, referencia..."
          />
        </div>

        {/* Toggle Filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
            hasActiveFilters
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-input hover:bg-secondary'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
              {[selectedFondoId, selectedConcepto, selectedEstado].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
          >
            <X className="h-4 w-4" />
            Limpiar
          </button>
        )}

        <div className="flex-1" />

        {/* Create Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Nuevo Movimiento
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-secondary/50 flex flex-wrap gap-4 rounded-lg border p-4">
          {/* Fondo Filter */}
          <div className="min-w-40">
            <label className="text-muted-foreground mb-1 block text-xs font-medium">Fondo</label>
            <select
              value={selectedFondoId}
              onChange={(e) => setSelectedFondoId(e.target.value)}
              className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="">Todos</option>
              {fondos.map((fondo) => (
                <option key={fondo.id} value={fondo.id}>
                  {fondo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Concepto Filter */}
          <div className="min-w-40">
            <label className="text-muted-foreground mb-1 block text-xs font-medium">Concepto</label>
            <select
              value={selectedConcepto}
              onChange={(e) => setSelectedConcepto(e.target.value)}
              className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="">Todos</option>
              {Object.entries(CONCEPTO_GROUPS).map(([group, conceptos]) => (
                <optgroup key={group} label={group}>
                  {conceptos.map((c) => (
                    <option key={c} value={c}>
                      {CONCEPTO_LABELS[c]}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Estado Filter */}
          <div className="min-w-32">
            <label className="text-muted-foreground mb-1 block text-xs font-medium">Estado</label>
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="">Todos</option>
              {Object.entries(ESTADO_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <DataTable
          data={filteredMovimientos}
          columns={columns}
          keyExtractor={(mov) => mov.id}
          pageSize={25}
          showSearch={false}
          showPagination={true}
          alwaysShowPagination={true}
          emptyMessage="No hay movimientos registrados"
          className="rounded-none border-0 shadow-none"
        />
      </div>

      {/* Stats */}
      <div className="text-muted-foreground flex gap-4 text-sm">
        <span>
          Mostrando {filteredMovimientos.length} de {movimientos.length} movimientos
        </span>
      </div>

      {/* Form Sheet */}
      <MovimientoFormSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        fondos={fondos}
        inversiones={inversiones}
        defaultFondoId={selectedFondoId || undefined}
      />
    </div>
  );
}
