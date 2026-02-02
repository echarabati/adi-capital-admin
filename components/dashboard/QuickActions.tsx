/**
 * Quick Actions Component
 *
 * Shows user info and quick action buttons.
 */

'use client';

import { signOut } from 'next-auth/react';
import { UserCircle, Settings, LogOut, FileText } from 'lucide-react';
import { getRoleDisplayName } from '@/config/roles';
import Link from 'next/link';

interface QuickActionsProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const actions = [
  {
    name: 'Editar perfil',
    href: '/profile',
    icon: UserCircle,
    description: 'Actualiza tu información',
  },
  {
    name: 'Configuración',
    href: '/settings/general',
    icon: Settings,
    description: 'Ajustes del sistema',
  },
  {
    name: 'Documentación',
    href: '/docs',
    icon: FileText,
    description: 'Guías y tutoriales',
  },
];

export function QuickActions({ user }: QuickActionsProps) {
  return (
    <div className="bg-card rounded-xl border border-white/10 p-4 shadow-sm">
      {/* User Info */}
      <div className="mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
            {user.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate font-semibold">{user.name || 'Usuario'}</p>
            <p className="text-muted-foreground truncate text-sm">{user.email}</p>
            <span className="bg-primary/10 text-primary mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium">
              {getRoleDisplayName(user.role || 'user')}
            </span>
          </div>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-1">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Acciones rápidas
        </p>
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="hover:bg-secondary/80 flex items-center gap-3 rounded-lg p-2 transition-colors"
          >
            <action.icon className="text-muted-foreground h-5 w-5" />
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">{action.name}</p>
              <p className="text-muted-foreground text-xs">{action.description}</p>
            </div>
          </Link>
        ))}

        {/* Logout button */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="hover:bg-destructive/10 text-destructive flex w-full items-center gap-3 rounded-lg p-2 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">Cerrar sesión</p>
            <p className="text-destructive/70 text-xs">Salir de tu cuenta</p>
          </div>
        </button>
      </div>
    </div>
  );
}
