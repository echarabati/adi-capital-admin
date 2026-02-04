'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Settings, ChevronDown, ChevronRight, Building2 } from 'lucide-react';
import { branding } from '@/config/branding';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils/cn';
import { useMounted } from '@/lib/hooks/useMounted';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
  collapsible?: boolean;
}

// Default navigation - can be overridden per project
const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Fondos',
    href: '/fondos',
    icon: Building2,
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    collapsible: true,
    children: [
      { name: 'General', href: '/settings/general', icon: Settings },
      { name: 'Usuarios', href: '/settings/users', icon: Settings },
    ],
  },
];

// import { useSession } from 'next-auth/react';

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  // const { data: session } = useSession(); // Removed to fix SessionProvider error
  const { resolvedTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Configuración']);
  const mounted = useMounted();

  // Get theme-aware logos
  const currentTheme = mounted ? resolvedTheme : 'light';
  const clientLogo = branding.getClientLogo(currentTheme);
  const timeKastLogo = branding.getTimeKastLogo('full', currentTheme);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const toggleSection = (name: string) => {
    setExpandedSections((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <aside
      className="fixed top-0 left-0 z-40 flex h-screen w-60 flex-col border-r"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      {/* Top: Client Branding (matches header height) */}
      <div
        className="flex h-16 shrink-0 items-center justify-center border-b px-4"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        {clientLogo ? (
          <div className="relative h-12 w-full max-w-[180px]">
            <Image
              src={clientLogo}
              alt={branding.appName}
              fill
              priority
              className="object-contain"
              sizes="180px"
            />
          </div>
        ) : (
          <span className="text-lg font-bold" style={{ color: 'var(--sidebar-foreground)' }}>
            {branding.appName}
          </span>
        )}
      </div>

      {/* Middle: Navigation (scrollable) */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          // Check visual permission (if item has a required permission, check it)
          // For now, hardcode logic based on item names matching PERMISSIONS resource names
          // Or better: filter based on specific logic.
          // Since nav is static, we can add a check here.

          // Logic: "Configuración" -> requires Admin or Super Admin
          // "Usuarios" -> requires Admin or Super Admin
          // We can use helper:

          // const userRole = session?.user?.role; // Uses prop now

          // Role-based filtering for sidebar items
          // Filter out Configuración if not admin_fondo or super_admin
          if (
            item.name === 'Configuración' &&
            userRole !== 'admin_fondo' &&
            userRole !== 'super_admin'
          ) {
            return null;
          }

          // For children - filter based on role
          const filteredChildren = item.children?.filter((child) => {
            if (
              child.name === 'Usuarios' &&
              userRole !== 'admin_fondo' &&
              userRole !== 'super_admin'
            )
              return false;
            if (
              child.name === 'General' &&
              userRole !== 'admin_fondo' &&
              userRole !== 'super_admin'
            )
              return false;
            return true;
          });

          if (item.collapsible && (!filteredChildren || filteredChildren.length === 0)) {
            return null;
          }

          return (
            <div key={item.name}>
              {item.collapsible ? (
                <>
                  {/* Collapsible section */}
                  <button
                    onClick={() => toggleSection(item.name)}
                    className={cn(
                      'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                    )}
                    style={{ color: 'var(--sidebar-foreground)' }}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5 shrink-0" />
                      {item.name}
                    </div>
                    {expandedSections.includes(item.name) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {/* Submenu items */}
                  {expandedSections.includes(item.name) && filteredChildren && (
                    <div className="mt-1 ml-8 space-y-1">
                      {filteredChildren.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors',
                            isActive(child.href) ? 'font-medium' : ''
                          )}
                          style={{
                            backgroundColor: isActive(child.href)
                              ? 'var(--sidebar-active)'
                              : 'transparent',
                            color: isActive(child.href)
                              ? 'var(--sidebar-active-foreground)'
                              : 'var(--sidebar-foreground)',
                          }}
                        >
                          <child.icon className="mr-2 h-4 w-4 shrink-0" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Regular link */
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                  )}
                  style={{
                    backgroundColor: isActive(item.href) ? 'var(--sidebar-active)' : 'transparent',
                    color: isActive(item.href)
                      ? 'var(--sidebar-active-foreground)'
                      : 'var(--sidebar-foreground)',
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 border-t px-4 py-3" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex justify-center">
          <div className="relative h-7 w-full max-w-[100px]">
            <Image
              src={timeKastLogo}
              alt="TimeKast"
              fill
              className="object-contain opacity-70"
              sizes="100px"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
