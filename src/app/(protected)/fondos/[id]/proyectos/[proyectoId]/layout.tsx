/**
 * Proyecto Detail Layout
 *
 * Layout with header and tabs for project detail pages.
 *
 * @see PROJ-003, PROJ-005
 */

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getProyectoById } from '@/lib/actions/proyectos/proyectos-queries';
import { FolderOpen, LayoutGrid, DollarSign, ArrowLeftRight, FileText } from 'lucide-react';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';
import { EstadoSelector } from './EstadoSelector';
import { BreadcrumbSetter } from '@/components/common/BreadcrumbSetter';

// Tab definitions
const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, href: '' },
  { id: 'inversiones', label: 'Inversiones', icon: DollarSign, href: '/inversiones' },
  { id: 'movimientos', label: 'Movimientos', icon: ArrowLeftRight, href: '/movimientos' },
  { id: 'documentos', label: 'Documentos', icon: FileText, href: '/documentos' },
];

interface ProyectoLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string; proyectoId: string }>;
}

export default async function ProyectoLayout({ children, params }: ProyectoLayoutProps) {
  const { id: fondoId, proyectoId } = await params;

  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch proyecto with RBAC
  const proyecto = await getProyectoById(proyectoId);
  if (!proyecto) {
    notFound();
  }

  const userRole = session.user.role;
  const canManage =
    isSuperAdmin(userRole ?? '') || hasRoleOrHigher(userRole ?? '', ROLES.ADMIN_FONDO);

  return (
    <div className="space-y-6">
      {/* Register proyecto name for breadcrumb */}
      <BreadcrumbSetter segment={proyectoId} label={proyecto.nombre} />
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-primary/20 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
          <FolderOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-foreground text-xl font-semibold">{proyecto.nombre}</h1>
          <div className="flex items-center gap-2">
            <EstadoSelector
              proyectoId={proyectoId}
              currentEstado={proyecto.estado}
              canManage={canManage}
            />
            <span className="text-muted-foreground text-sm">
              {proyecto.inversionistasCount} inversionista
              {proyecto.inversionistasCount !== 1 ? 's' : ''}
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
            href={`/fondos/${fondoId}/proyectos/${proyectoId}${tab.href}`}
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
