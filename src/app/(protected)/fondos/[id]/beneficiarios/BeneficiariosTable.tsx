'use client';

/**
 * BeneficiariosTable Component
 *
 * Client component for displaying beneficiaries with create/edit actions.
 *
 * @see FOND-005
 */

import { useState, useMemo } from 'react';
import { Users, Plus, Pencil } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableSearch } from '@/components/ui/TableExtras';
import { BeneficiarioListItem } from '@/lib/actions/beneficiarios/beneficiarios-queries';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';
import { BeneficiarioFormDialog } from './BeneficiarioFormDialog';

// =============================================================================
// Types
// =============================================================================

interface BeneficiariosTableProps {
  beneficiarios: BeneficiarioListItem[];
  fondoId: string;
  userRole?: string;
}

type BeneficiarioForEdit = BeneficiarioListItem;

// =============================================================================
// Component
// =============================================================================

export function BeneficiariosTable({ beneficiarios, fondoId, userRole }: BeneficiariosTableProps) {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editBeneficiario, setEditBeneficiario] = useState<BeneficiarioForEdit | null>(null);

  const canManage =
    isSuperAdmin(userRole ?? '') || hasRoleOrHigher(userRole ?? '', ROLES.ADMIN_FONDO);

  // Apply search filter
  const filteredBeneficiarios = useMemo(() => {
    if (!search) return beneficiarios;
    const searchLower = search.toLowerCase();
    return beneficiarios.filter(
      (b) =>
        b.nombre.toLowerCase().includes(searchLower) ||
        (b.banco && b.banco.toLowerCase().includes(searchLower)) ||
        (b.numeroCuenta && b.numeroCuenta.toLowerCase().includes(searchLower))
    );
  }, [beneficiarios, search]);

  // Table columns
  const columns: TableColumn<BeneficiarioListItem>[] = [
    {
      id: 'nombre',
      header: 'Nombre',
      sortable: true,
      accessor: (b) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate font-medium">{b.nombre}</p>
            {b.notas && <p className="text-muted-foreground truncate text-xs">{b.notas}</p>}
          </div>
        </div>
      ),
    },
    {
      id: 'banco',
      header: 'Banco',
      className: 'hidden md:table-cell',
      accessor: (b) => <span className="text-muted-foreground">{b.banco || '—'}</span>,
    },
    {
      id: 'numeroCuenta',
      header: 'Cuenta',
      className: 'hidden lg:table-cell',
      accessor: (b) => (
        <span className="text-muted-foreground font-mono text-sm">{b.numeroCuenta || '—'}</span>
      ),
    },
    {
      id: 'clabe',
      header: 'CLABE',
      className: 'hidden xl:table-cell',
      accessor: (b) => (
        <span className="text-muted-foreground font-mono text-sm">{b.clabe || '—'}</span>
      ),
    },
    // Actions column
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            className: 'w-12',
            accessor: (b: BeneficiarioListItem) => (
              <button
                className="hover:bg-secondary rounded-lg p-1.5 transition-colors"
                title="Editar"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditBeneficiario(b);
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
        <h2 className="text-foreground text-lg font-semibold">Beneficiarios</h2>
        <p className="text-muted-foreground text-sm">Destinatarios de pagos de gastos</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Buscar
          </label>
          <TableSearch value={search} onChange={setSearch} placeholder="Nombre, banco..." />
        </div>
        <div className="flex-1" />

        {/* Create Button */}
        {canManage && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo Beneficiario
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
          data={filteredBeneficiarios}
          columns={columns}
          keyExtractor={(b) => b.id}
          pageSize={20}
          showSearch={false}
          showPagination={true}
          alwaysShowPagination={true}
          emptyMessage="No hay beneficiarios registrados"
          className="rounded-none border-0 shadow-none"
        />
      </div>

      {/* Create Dialog */}
      <BeneficiarioFormDialog
        mode="create"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        fondoId={fondoId}
      />

      {/* Edit Dialog */}
      {editBeneficiario && (
        <BeneficiarioFormDialog
          mode="edit"
          open={true}
          onOpenChange={(open) => !open && setEditBeneficiario(null)}
          fondoId={fondoId}
          beneficiario={editBeneficiario}
        />
      )}
    </div>
  );
}
