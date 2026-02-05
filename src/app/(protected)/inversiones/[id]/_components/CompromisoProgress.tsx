/**
 * CompromisoProgress Component
 *
 * Displays the investment commitment progress with visual bar,
 * status badge, and tooltip showing exact amounts.
 *
 * States:
 * - pendiente (0%): gray
 * - parcial (1-99%): blue
 * - completado (100%): green
 * - excedido (>100%): yellow with warning
 *
 * @see INVE-004
 */

import { cn } from '@/lib/utils/cn';
import { AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CompromisoProgressProps {
  /** Total commitment amount */
  compromiso: string;
  /** Amount contributed so far */
  capitalAportado: string;
}

type EstadoCompromiso = 'pendiente' | 'parcial' | 'completado' | 'excedido';

/**
 * Calculate the commitment status based on amounts.
 */
function getEstado(compromiso: number, aportado: number): EstadoCompromiso {
  if (compromiso === 0) return 'pendiente';
  if (aportado === 0) return 'pendiente';
  if (aportado >= compromiso) {
    return aportado > compromiso ? 'excedido' : 'completado';
  }
  return 'parcial';
}

/**
 * Get visual configuration for each state.
 */
function getEstadoConfig(estado: EstadoCompromiso) {
  const configs: Record<EstadoCompromiso, { barColor: string; badgeColor: string; label: string }> =
    {
      pendiente: {
        barColor: 'bg-gray-400',
        badgeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        label: 'Pendiente',
      },
      parcial: {
        barColor: 'bg-blue-500',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        label: 'Parcial',
      },
      completado: {
        barColor: 'bg-green-500',
        badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        label: 'Completado',
      },
      excedido: {
        barColor: 'bg-yellow-500',
        badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
        label: 'Excedido',
      },
    };
  return configs[estado];
}

/**
 * Format currency for display.
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CompromisoProgress({ compromiso, capitalAportado }: CompromisoProgressProps) {
  const compromisoNum = Number(compromiso) || 0;
  const aportadoNum = Number(capitalAportado) || 0;

  const estado = getEstado(compromisoNum, aportadoNum);
  const config = getEstadoConfig(estado);

  // Calculate percentage (capped at 100 for visual)
  const percentage = compromisoNum > 0 ? Math.round((aportadoNum / compromisoNum) * 100) : 0;
  const visualPercentage = Math.min(percentage, 100);

  // Calculate excess amount if applicable
  const excessAmount = estado === 'excedido' ? aportadoNum - compromisoNum : 0;

  return (
    <div
      className="rounded-xl border p-6"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <h3 className="text-foreground mb-4 font-semibold">Estado del Compromiso</h3>

      <div className="space-y-4">
        {/* Badge and Percentage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                config.badgeColor
              )}
            >
              {estado === 'excedido' && <AlertTriangle className="h-3 w-3" />}
              {config.label}
              {estado === 'excedido' && ` +${formatCurrency(excessAmount)}`}
            </span>
          </div>
          <span className="text-foreground text-sm font-semibold">{percentage}%</span>
        </div>

        {/* Progress Bar */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-secondary h-3 w-full cursor-help overflow-hidden rounded-full">
                <div
                  className={cn('h-full rounded-full transition-all duration-300', config.barColor)}
                  style={{ width: `${visualPercentage}%` }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Aportado: {formatCurrency(aportadoNum)} / Compromiso:{' '}
                {formatCurrency(compromisoNum)}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Amount Summary */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Capital Aportado</span>
          <span className="text-foreground font-medium">{formatCurrency(aportadoNum)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Compromiso Total</span>
          <span className="text-foreground font-medium">{formatCurrency(compromisoNum)}</span>
        </div>
      </div>
    </div>
  );
}
