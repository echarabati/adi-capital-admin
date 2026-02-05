/**
 * Inversion Detail Layout
 *
 * Layout with header, stat cards, and tabs for inversion detail pages.
 *
 * @see INVE-003
 */

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getInversionById } from '@/lib/actions/inversiones/inversiones-queries';
import { Wallet, LayoutDashboard, ArrowLeftRight, Calendar } from 'lucide-react';
import { BreadcrumbSetter } from '@/components/common/BreadcrumbSetter';

// Tab definitions
const tabs = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard, href: '' },
  { id: 'movimientos', label: 'Movimientos', icon: ArrowLeftRight, href: '/movimientos' },
  { id: 'calendario', label: 'Calendario', icon: Calendar, href: '/calendario' },
];

// Estado badge configuration
const estadoConfig: Record<string, { label: string; color: string }> = {
  pendiente: { label: 'Pendiente', color: '#6b7280' },
  parcial: { label: 'Parcial', color: '#f59e0b' },
  completado: { label: 'Completado', color: '#10b981' },
  excedido: { label: 'Excedido', color: '#8b5cf6' },
};

interface InversionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

// Helper to format currency
function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export default async function InversionLayout({ children, params }: InversionLayoutProps) {
  const { id } = await params;

  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch inversion with RBAC
  const inversion = await getInversionById(id);
  if (!inversion) {
    notFound();
  }

  const estadoStyle = estadoConfig[inversion.estado] || estadoConfig.pendiente;

  return (
    <div className="space-y-6">
      {/* Register for breadcrumb */}
      <BreadcrumbSetter segment={id} label={inversion.inversionistaNombre} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-foreground text-xl font-semibold">
                {inversion.inversionistaNombre}
              </h1>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: `${estadoStyle.color}20`, color: estadoStyle.color }}
              >
                {estadoStyle.label}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {inversion.proyectoNombre} • {inversion.fondoNombre}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Compromiso */}
        <div
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Compromiso
          </p>
          <p className="text-foreground mt-1 text-xl font-semibold">
            {formatCurrency(inversion.compromiso)}
          </p>
        </div>

        {/* Capital Aportado */}
        <div
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Aportado
          </p>
          <p className="text-foreground mt-1 text-xl font-semibold">
            {formatCurrency(inversion.capitalAportado)}
          </p>
        </div>

        {/* Pref Acumulado */}
        <div
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Pref Acumulado
          </p>
          <p className="text-foreground mt-1 text-xl font-semibold">
            {formatCurrency(inversion.prefAcumulado)}
          </p>
        </div>

        {/* Pref Pagado */}
        <div
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Pref Pagado
          </p>
          <p className="text-foreground mt-1 text-xl font-semibold">
            {formatCurrency(inversion.prefPagado)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border p-1">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/inversiones/${id}${tab.href}`}
            className="hover:bg-secondary flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
}
