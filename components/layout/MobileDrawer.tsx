'use client';

/**
 * MobileDrawer Component
 *
 * Slide-out drawer for mobile navigation that mirrors the desktop Sidebar.
 * Uses Sheet from Radix UI for accessible sliding panel.
 *
 * @see Mobile Drawer Migration
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { branding } from '@/config/branding';
import { navigation, filterNavigationByRole } from '@/src/config/navigation';
import { cn } from '@/lib/utils/cn';
import { useMounted } from '@/lib/hooks/useMounted';

interface MobileDrawerProps {
  userRole?: string;
}

export function MobileDrawer({ userRole }: MobileDrawerProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Configuración']);
  const mounted = useMounted();

  // Return null during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <button className="hover:bg-secondary rounded-lg p-2 lg:hidden" aria-label="Abrir menú">
        <MenuIcon className="text-foreground h-6 w-6" />
      </button>
    );
  }

  // Get theme-aware logos
  const clientLogo = branding.getClientLogo(resolvedTheme);
  const timeKastLogo = branding.getTimeKastLogo('full', resolvedTheme);

  // Filter navigation by role
  const filteredNav = filterNavigationByRole(navigation, userRole);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const toggleSection = (name: string) => {
    setExpandedSections((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir menú de navegación"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0" showCloseButton={false}>
        {/* Required for accessibility - visually hidden */}
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <SheetDescription className="sr-only">
          Navegación principal de la aplicación
        </SheetDescription>

        {/* Header with client branding */}
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

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filteredNav.map((item) => (
            <div key={item.name}>
              {item.collapsible ? (
                <>
                  {/* Collapsible section */}
                  <button
                    onClick={() => toggleSection(item.name)}
                    className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
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
                          onClick={handleNavClick}
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
                  onClick={handleNavClick}
                  className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
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

        {/* Footer with TimeKast branding */}
        <div
          className="shrink-0 border-t px-4 py-3"
          style={{ borderColor: 'var(--sidebar-border)' }}
        >
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
      </SheetContent>
    </Sheet>
  );
}
