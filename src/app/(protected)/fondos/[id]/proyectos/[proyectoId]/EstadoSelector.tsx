'use client';

/**
 * Estado Selector Component
 *
 * Dropdown for changing project state with confirmation dialog.
 *
 * @see PROJ-005
 */

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { updateProyectoEstado } from '@/lib/actions/proyectos/proyectos-mutations';

type EstadoProyecto = 'inversion_abierta' | 'inversion_cerrada' | 'concluido';

interface EstadoSelectorProps {
  proyectoId: string;
  currentEstado: EstadoProyecto;
  canManage: boolean;
}

const estadoConfig: Record<EstadoProyecto, { label: string; color: string }> = {
  inversion_abierta: { label: 'Inversión Abierta', color: '#10b981' },
  inversion_cerrada: { label: 'Inversión Cerrada', color: '#f59e0b' },
  concluido: { label: 'Concluido', color: '#6b7280' },
};

const VALID_TRANSITIONS: Record<EstadoProyecto, EstadoProyecto[]> = {
  inversion_abierta: ['inversion_cerrada'],
  inversion_cerrada: ['concluido', 'inversion_abierta'],
  concluido: [],
};

export function EstadoSelector({ proyectoId, currentEstado, canManage }: EstadoSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingEstado, setPendingEstado] = useState<EstadoProyecto | null>(null);

  const config = estadoConfig[currentEstado];
  const availableTransitions = VALID_TRANSITIONS[currentEstado] || [];

  const handleChange = (nuevoEstado: EstadoProyecto) => {
    if (nuevoEstado === 'concluido') {
      // Show confirmation for terminal state
      setPendingEstado(nuevoEstado);
      setShowConfirm(true);
    } else {
      executeChange(nuevoEstado);
    }
  };

  const executeChange = (nuevoEstado: EstadoProyecto) => {
    startTransition(async () => {
      const result = await updateProyectoEstado(proyectoId, nuevoEstado);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Estado cambiado a ${estadoConfig[nuevoEstado].label}`);
        router.refresh();
      }
      setShowConfirm(false);
      setPendingEstado(null);
    });
  };

  // If can't manage or no transitions available, show static badge
  if (!canManage || availableTransitions.length === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
        style={{ backgroundColor: `${config.color}20`, color: config.color }}
      >
        {config.label}
      </span>
    );
  }

  return (
    <>
      {/* Dropdown */}
      <div className="relative inline-block">
        <button
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: `${config.color}20`, color: config.color }}
          onClick={(e) => {
            const menu = e.currentTarget.nextElementSibling;
            menu?.classList.toggle('hidden');
          }}
        >
          {config.label}
          <ChevronDown className="h-3 w-3" />
        </button>
        <div
          className="absolute top-full left-0 z-50 mt-1 hidden min-w-[180px] rounded-lg border bg-white p-1 shadow-lg dark:bg-zinc-900"
          style={{ borderColor: 'var(--sidebar-border)' }}
        >
          {availableTransitions.map((estado) => {
            const targetConfig = estadoConfig[estado];
            return (
              <button
                key={estado}
                disabled={isPending}
                onClick={() => {
                  const menu = document.querySelector('.absolute.hidden');
                  menu?.classList.add('hidden');
                  handleChange(estado);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: targetConfig.color }}
                />
                {targetConfig.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog for Concluido */}
      {showConfirm && pendingEstado === 'concluido' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-full max-w-md rounded-xl border p-6"
            style={{
              backgroundColor: 'var(--sidebar-bg)',
              borderColor: 'var(--sidebar-border)',
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-foreground text-lg font-semibold">Confirmar Conclusión</h3>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              Al marcar el proyecto como <strong>Concluido</strong>, no se podrán crear más
              movimientos para este proyecto. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPendingEstado(null);
                }}
                className="border-input hover:bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => executeChange('concluido')}
                disabled={isPending}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
              >
                {isPending ? 'Procesando...' : 'Confirmar Conclusión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
