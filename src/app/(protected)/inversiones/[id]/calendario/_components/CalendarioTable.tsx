/**
 * Calendario Table Component
 *
 * Displays capital calls for an investment with edit and payment functionality.
 *
 * @see INVE-005, INVE-006
 */

'use client';

import { useState } from 'react';
import { DollarSign, Pencil, Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { CalendarioFormDialog } from './CalendarioFormDialog';
import { PagoDialog } from './PagoDialog';
import type { CalendarioPagoListItem } from '@/lib/actions/calendario-pagos/calendario-pagos-queries';

interface CalendarioTableProps {
  inversionId: string;
  inversionistaId: string;
  items: CalendarioPagoListItem[];
}

/**
 * Format currency for display.
 */
function formatCurrency(value: string): string {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format date for display.
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Get status badge configuration.
 */
function getEstadoConfig(estado: 'pendiente' | 'parcial' | 'completo') {
  const configs = {
    pendiente: {
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      label: 'Pendiente',
    },
    parcial: {
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      label: 'Parcial',
    },
    completo: {
      className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      label: 'Completo',
    },
  };
  return configs[estado];
}

export function CalendarioTable({ inversionId, inversionistaId, items }: CalendarioTableProps) {
  // Form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarioPagoListItem | null>(null);

  // Pago dialog state
  const [pagoDialogOpen, setPagoDialogOpen] = useState(false);
  const [payingItem, setPayingItem] = useState<CalendarioPagoListItem | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (item: CalendarioPagoListItem) => {
    setEditingItem(item);
    setFormDialogOpen(true);
  };

  const handleCloseForm = () => {
    setFormDialogOpen(false);
    setEditingItem(null);
  };

  const handlePay = (item: CalendarioPagoListItem) => {
    setPayingItem(item);
    setPagoDialogOpen(true);
  };

  const handleClosePago = () => {
    setPagoDialogOpen(false);
    setPayingItem(null);
  };

  // Table columns
  const columns: TableColumn<CalendarioPagoListItem>[] = [
    {
      id: 'numero',
      header: '#',
      className: 'w-16 text-center',
      accessor: (item) => <span className="font-medium">{item.numero}</span>,
    },
    {
      id: 'fechaProgramada',
      header: 'Fecha Programada',
      sortable: true,
      accessor: (item) => formatDate(item.fechaProgramada),
    },
    {
      id: 'montoEsperado',
      header: 'Monto Esperado',
      className: 'text-right',
      accessor: (item) => <span className="font-mono">{formatCurrency(item.montoEsperado)}</span>,
    },
    {
      id: 'montoPagado',
      header: 'Monto Pagado',
      className: 'text-right',
      accessor: (item) => <span className="font-mono">{formatCurrency(item.montoPagado)}</span>,
    },
    {
      id: 'estado',
      header: 'Estado',
      className: 'w-28',
      accessor: (item) => {
        const config = getEstadoConfig(item.estado);
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      className: 'w-24',
      accessor: (item) => {
        const canPay = item.estado !== 'completo';
        return (
          <div className="flex items-center gap-1">
            {canPay && (
              <button
                className="rounded-lg p-1.5 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30"
                title="Registrar Pago"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePay(item);
                }}
              >
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </button>
            )}
            <button
              className="hover:bg-secondary rounded-lg p-1.5 transition-colors"
              title="Editar"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item);
              }}
            >
              <Pencil className="text-muted-foreground h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div
      className="rounded-xl border"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b p-4"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        <h3 className="text-foreground font-semibold">Calendario de Pagos</h3>
        <button
          onClick={handleCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      {/* Table */}
      <DataTable
        data={items}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={10}
        showSearch={false}
        showPagination={true}
        emptyMessage="No hay capital calls programados"
        className="rounded-none border-0 shadow-none"
      />

      {/* Form Dialog */}
      <CalendarioFormDialog
        open={formDialogOpen}
        onClose={handleCloseForm}
        inversionId={inversionId}
        editingItem={editingItem}
      />

      {/* Pago Dialog */}
      <PagoDialog
        open={pagoDialogOpen}
        onClose={handleClosePago}
        inversionId={inversionId}
        inversionistaId={inversionistaId}
        item={payingItem}
      />
    </div>
  );
}
