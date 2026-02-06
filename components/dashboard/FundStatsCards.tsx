/**
 * FundStatsCards Component
 *
 * Dashboard stats cards showing key fund metrics:
 * - Capital total (sum of all contributions)
 * - Proyectos activos (open projects count)
 * - Inversionistas (distinct investors count)
 * - Movimientos pendientes (draft movements count)
 *
 * Server component that fetches real data.
 * @see DASH-001
 */

import { Wallet, Briefcase, Users, Clock } from 'lucide-react';
import { getDashboardStats } from '@/lib/actions/dashboard/dashboard-queries';

interface StatCard {
  name: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

/**
 * Format number as currency (MXN)
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format number with compact notation for large values
 */
function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

export async function FundStatsCards({ fondoId }: { fondoId?: string }) {
  const stats = await getDashboardStats(fondoId);

  const cards: StatCard[] = [
    {
      name: 'Capital Total',
      value: formatCurrency(stats.capitalTotal),
      icon: Wallet,
      color: 'text-emerald-500',
    },
    {
      name: 'Proyectos Activos',
      value: formatNumber(stats.proyectosActivos),
      icon: Briefcase,
      color: 'text-blue-500',
    },
    {
      name: 'Inversionistas',
      value: formatNumber(stats.inversionistasCount),
      icon: Users,
      color: 'text-purple-500',
    },
    {
      name: 'Movimientos Pendientes',
      value: formatNumber(stats.movimientosPendientes),
      icon: Clock,
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((stat) => (
        <div
          key={stat.name}
          className="bg-card rounded-xl border border-white/10 p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="bg-primary/10 rounded-lg p-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-muted-foreground text-sm">{stat.name}</p>
            <p className="text-foreground text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
