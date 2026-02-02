'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { branding } from '@/config/branding';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils/cn';

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

export function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Configuración']);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch - standard Next.js pattern for theme-aware components
  useEffect(() => {
    setMounted(true); // eslint-disable-line
  }, []);

  // Use resolvedTheme for accurate theme detection, fallback to 'light' for SSR to prevent flash
  const logoSrc = branding.getTimeKastLogo('full', mounted ? resolvedTheme : 'light');

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
      className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-60 overflow-y-auto border-r"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      {/* TimeKast Logo */}
      <div className="px-2 pt-5 pb-2" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center justify-center">
          <Image
            src={logoSrc}
            alt="TimeKast"
            width={220}
            height={60}
            priority
            className="h-auto w-full max-w-52"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-3 py-4">
        {navigation.map((item) => (
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
                {expandedSections.includes(item.name) && item.children && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => (
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
        ))}
      </nav>
    </aside>
  );
}
