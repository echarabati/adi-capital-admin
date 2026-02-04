'use client';

/**
 * CuentasBancariasTable Component
 *
 * Client component for displaying bank accounts with create/edit actions.
 *
 * @see FOND-004
 */

import { useState, useMemo } from 'react';
import { CreditCard, Plus, Pencil } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableSearch } from '@/components/ui/TableExtras';
import { CuentaBancariaListItem } from '@/lib/actions/cuentas-bancarias/cuentas-bancarias-queries';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';
import { CuentaBancariaFormDialog } from './CuentaBancariaFormDialog';

// =============================================================================
// Types
// =============================================================================

interface CuentasBancariasTableProps {
  cuentas: CuentaBancariaListItem[];
  fondoId: string;
  userRole?: string;
}

type CuentaForEdit = Pick<CuentaBancariaListItem, 'id' | 'banco' | 'numero' | 'clabe' | 'moneda'>;

// Currency badge colors
const currencyColors: Record<string, string> = {
  MXN: '#10b981',
  USD: '#3b82f6',
  EUR: '#8b5cf6',
  ILS: '#f59e0b',
};

// Format currency
function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency === 'ILS' ? 'ILS' : currency,
    minimumFractionDigits: 2,
  }).format(num);
}

// =============================================================================
// Component
// =============================================================================

export function CuentasBancariasTable({ cuentas, fondoId, userRole }: CuentasBancariasTableProps) {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCuenta, setEditCuenta] = useState<CuentaForEdit | null>(null);

  const canManage =
    isSuperAdmin(userRole ?? '') || hasRoleOrHigher(userRole ?? '', ROLES.ADMIN_FONDO);

  // Apply search filter
  const filteredCuentas = useMemo(() => {
    if (!search) return cuentas;
    const searchLower = search.toLowerCase();
    return cuentas.filter(
      (cuenta) =>
        cuenta.banco.toLowerCase().includes(searchLower) ||
        cuenta.numero.toLowerCase().includes(searchLower) ||
        (cuenta.clabe && cuenta.clabe.toLowerCase().includes(searchLower))
    );
  }, [cuentas, search]);

  // Table columns
  const columns: TableColumn<CuentaBancariaListItem>[] = [
    {
      id: 'banco',
      header: 'Banco',
      sortable: true,
      accessor: (cuenta) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate font-medium">{cuenta.banco}</p>
            <p className="text-muted-foreground truncate text-xs">{cuenta.numero}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'clabe',
      header: 'CLABE',
      className: 'hidden lg:table-cell',
      accessor: (cuenta) => (
        <span className="text-muted-foreground font-mono text-sm">{cuenta.clabe || '—'}</span>
      ),
    },
    {
      id: 'moneda',
      header: 'Moneda',
      className: 'hidden md:table-cell',
      accessor: (cuenta) => {
        const color = currencyColors[cuenta.moneda] || '#6b7280';
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {cuenta.moneda}
          </span>
        );
      },
    },
    {
      id: 'saldo',
      header: 'Saldo',
      sortable: true,
      className: 'text-right',
      accessor: (cuenta) => (
        <span className="text-foreground font-medium">
          {formatCurrency(cuenta.saldo, cuenta.moneda)}
        </span>
      ),
    },
    // Actions column
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            className: 'w-12',
            accessor: (cuenta: CuentaBancariaListItem) => (
              <button
                className="hover:bg-secondary rounded-lg p-1.5 transition-colors"
                title="Editar"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditCuenta({
                    id: cuenta.id,
                    banco: cuenta.banco,
                    numero: cuenta.numero,
                    clabe: cuenta.clabe,
                    moneda: cuenta.moneda,
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
        <h2 className="text-foreground text-lg font-semibold">Cuentas Bancarias</h2>
        <p className="text-muted-foreground text-sm">Gestión de cuentas del fondo</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Buscar
          </label>
          <TableSearch value={search} onChange={setSearch} placeholder="Banco, número..." />
        </div>
        <div className="flex-1" />

        {/* Create Button */}
        {canManage && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva Cuenta
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
          data={filteredCuentas}
          columns={columns}
          keyExtractor={(cuenta) => cuenta.id}
          pageSize={20}
          showSearch={false}
          showPagination={true}
          alwaysShowPagination={true}
          emptyMessage="No hay cuentas bancarias registradas"
          className="rounded-none border-0 shadow-none"
        />
      </div>

      {/* Create Dialog */}
      <CuentaBancariaFormDialog
        mode="create"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        fondoId={fondoId}
      />

      {/* Edit Dialog */}
      {editCuenta && (
        <CuentaBancariaFormDialog
          mode="edit"
          open={true}
          onOpenChange={(open) => !open && setEditCuenta(null)}
          fondoId={fondoId}
          cuenta={editCuenta}
        />
      )}
    </div>
  );
}
