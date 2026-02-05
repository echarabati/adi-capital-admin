/**
 * Fondo Detail Layout
 *
 * Layout with header and tabs for fund detail pages.
 *
 * @see FOND-003
 */

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getFondoById } from '@/lib/actions/fondos/fondos-queries';
import { Building2, FolderOpen, CreditCard, Users } from 'lucide-react';
import { BreadcrumbSetter } from '@/components/common/BreadcrumbSetter';

// Currency badge colors
const currencyColors: Record<string, string> = {
  MXN: '#10b981',
  USD: '#3b82f6',
  EUR: '#8b5cf6',
  ILS: '#f59e0b',
};

// Tab definitions
const tabs = [
  { id: 'proyectos', label: 'Proyectos', icon: FolderOpen, href: '' },
  { id: 'cuentas', label: 'Cuentas Bancarias', icon: CreditCard, href: '/cuentas' },
  { id: 'beneficiarios', label: 'Beneficiarios', icon: Users, href: '/beneficiarios' },
];

interface FondoLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function FondoLayout({ children, params }: FondoLayoutProps) {
  const { id } = await params;

  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch fondo with RBAC
  const fondo = await getFondoById(id);
  if (!fondo) {
    notFound();
  }

  const currencyColor = currencyColors[fondo.monedaBase] || '#6b7280';

  return (
    <div className="space-y-6">
      {/* Register fondo name for breadcrumb */}
      <BreadcrumbSetter segment={id} label={fondo.nombre} />
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-primary/20 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-foreground text-xl font-semibold">{fondo.nombre}</h1>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${currencyColor}20`, color: currencyColor }}
            >
              {fondo.monedaBase}
            </span>
            <span className="text-muted-foreground text-sm">
              {fondo.proyectosCount} proyecto{fondo.proyectosCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        className="flex gap-1 overflow-x-auto rounded-lg border p-1"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/fondos/${id}${tab.href}`}
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
