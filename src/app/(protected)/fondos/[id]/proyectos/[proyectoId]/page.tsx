/**
 * Proyecto Overview Tab
 *
 * Shows project financial position with Utilidad calculation.
 *
 * @see PROJ-003, PROJ-004
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProyectoById } from '@/lib/actions/proyectos/proyectos-queries';
import { TrendingUp, TrendingDown, DollarSign, Users, Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Overview | Proyecto',
  description: 'Resumen del proyecto',
};

interface OverviewPageProps {
  params: Promise<{ id: string; proyectoId: string }>;
}

export default async function ProyectoOverviewPage({ params }: OverviewPageProps) {
  const { proyectoId } = await params;

  const proyecto = await getProyectoById(proyectoId);
  if (!proyecto) {
    notFound();
  }

  // BR-009: Utilidad = Retornos - Inversión - Gastos
  const inversionRecibida = Number(proyecto.inversionRecibida);
  const gastos = Number(proyecto.gastos);
  const retornos = Number(proyecto.retornos);
  const utilidad = retornos - inversionRecibida - gastos;
  const isPositive = utilidad >= 0;

  const stats = [
    {
      label: 'Inversión Recibida',
      value: `$${inversionRecibida.toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
    },
    {
      label: 'Gastos',
      value: `$${gastos.toLocaleString()}`,
      icon: TrendingDown,
      color: '#f59e0b',
    },
    {
      label: 'Retornos',
      value: `$${retornos.toLocaleString()}`,
      icon: TrendingUp,
      color: '#3b82f6',
    },
    {
      label: 'Inversionistas',
      value: proyecto.inversionistasCount.toString(),
      icon: Users,
      color: '#8b5cf6',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-4"
            style={{
              backgroundColor: 'var(--sidebar-bg)',
              borderColor: 'var(--sidebar-border)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">{stat.label}</p>
                <p className="text-foreground text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Utilidad Card - PROJ-004 */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: isPositive ? '#10b98120' : '#ef444420' }}
            >
              <Calculator
                className="h-6 w-6"
                style={{ color: isPositive ? '#10b981' : '#ef4444' }}
              />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Utilidad / Pérdida</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Retornos - Inversión - Gastos
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: isPositive ? '#10b981' : '#ef4444' }}>
              {isPositive ? '+' : ''}${utilidad.toLocaleString()}
            </p>
            <p className="text-muted-foreground text-xs">{isPositive ? 'Ganancia' : 'Pérdida'}</p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <h2 className="text-foreground mb-4 text-lg font-semibold">Información del Proyecto</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">Success Fee</p>
            <p className="text-foreground font-medium">
              {proyecto.successFeePct ? `${proyecto.successFeePct}%` : 'No definido'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Método Cascada</p>
            <p className="text-foreground font-medium">
              {proyecto.metodoCascada === 'pref_primero'
                ? 'Pref Primero'
                : proyecto.metodoCascada === 'capital_primero'
                  ? 'Capital Primero'
                  : 'Hereda del fondo'}
            </p>
          </div>
          {proyecto.descripcion && (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-sm">Descripción</p>
              <p className="text-foreground">{proyecto.descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
