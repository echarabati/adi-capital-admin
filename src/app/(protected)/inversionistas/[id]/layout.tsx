/**
 * Inversionista Detail Layout
 *
 * Layout with header and tabs for inversionista detail pages.
 *
 * @see INV-003
 */

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getInversionistaById } from '@/lib/actions/inversionistas/inversionistas-queries';
import { User, Wallet, ArrowLeftRight, FileText } from 'lucide-react';
import { BreadcrumbSetter } from '@/components/common/BreadcrumbSetter';

// Tab definitions
const tabs = [
  { id: 'inversiones', label: 'Inversiones', icon: Wallet, href: '' },
  { id: 'movimientos', label: 'Movimientos', icon: ArrowLeftRight, href: '/movimientos' },
  { id: 'documentos', label: 'Documentos', icon: FileText, href: '/documentos' },
];

interface InversionistaLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function InversionistaLayout({ children, params }: InversionistaLayoutProps) {
  const { id } = await params;

  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch inversionista with RBAC
  const inversionista = await getInversionistaById(id);
  if (!inversionista) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Register inversionista name for breadcrumb */}
      <BreadcrumbSetter segment={id} label={inversionista.nombre} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-primary/20 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
          <User className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-xl font-semibold">{inversionista.nombre}</h1>
            {inversionista.esFundador && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                Fundador
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {inversionista.email && (
              <span className="text-muted-foreground text-sm">{inversionista.email}</span>
            )}
            {inversionista.fondos.length > 0 && (
              <>
                <span className="text-muted-foreground text-sm">·</span>
                <span className="text-muted-foreground text-sm">
                  {inversionista.fondos.length} fondo{inversionista.fondos.length !== 1 ? 's' : ''}
                </span>
              </>
            )}
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
            href={`/inversionistas/${id}${tab.href}`}
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
