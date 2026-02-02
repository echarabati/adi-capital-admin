/**
 * Breadcrumb Component
 *
 * Displays the current navigation path based on the URL.
 * Automatically generates breadcrumbs from the path segments.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useBreadcrumbLabels } from '@/lib/contexts/BreadcrumbContext';

// Route labels for friendly names
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  settings: 'Configuración',
  general: 'General',
  users: 'Usuarios',
  profile: 'Perfil',
};

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const { labels } = useBreadcrumbLabels();

  // Split path and filter empty segments
  const segments = pathname.split('/').filter(Boolean);

  // If no segments (root) or only dashboard, show just Dashboard
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
    return (
      <nav className={cn('flex items-center gap-1 text-sm', className)}>
        <Home className="text-muted-foreground h-4 w-4" />
        <ChevronRight className="text-muted-foreground h-3 w-3" />
        <span className="text-foreground font-medium">Dashboard</span>
      </nav>
    );
  }

  // Build breadcrumb items
  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    // Priority: context labels > static routeLabels > formatted segment
    const label =
      labels[segment] || routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav className={cn('flex items-center gap-1 text-sm', className)}>
      {/* Home link */}
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Breadcrumb items */}
      {items.map((item) => (
        <div key={item.href} className="flex items-center gap-1">
          <ChevronRight className="text-muted-foreground h-3 w-3" />
          {item.isLast ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
