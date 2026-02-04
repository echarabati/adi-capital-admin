/**
 * Proyecto Overview Tab
 *
 * Shows project financial position summary (placeholder for PROJ-004).
 *
 * @see PROJ-003
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProyectoById } from '@/lib/actions/proyectos/proyectos-queries';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

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

  const stats = [
    {
      label: 'Inversión Recibida',
      value: `$${Number(proyecto.inversionRecibida).toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
    },
    {
      label: 'Retornos',
      value: `$${Number(proyecto.retornos).toLocaleString()}`,
      icon: TrendingUp,
      color: '#3b82f6',
    },
    {
      label: 'Gastos',
      value: `$${Number(proyecto.gastos).toLocaleString()}`,
      icon: TrendingDown,
      color: '#f59e0b',
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

      {/* Placeholder for PROJ-004 */}
      <div
        className="rounded-xl border p-8 text-center"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <p className="text-muted-foreground text-sm">
          📊 Posición financiera detallada disponible en PROJ-004
        </p>
      </div>
    </div>
  );
}
