'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { Menu as MenuIcon, Home, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils/cn';
import { branding } from '@/config/branding';
import { useMounted } from '@/lib/hooks/useMounted';

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: { name: string; href: string }[];
}

// Same navigation as Sidebar
const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  {
    name: 'Configuración',
    icon: Settings,
    children: [
      { name: 'General', href: '/settings/general' },
      { name: 'Usuarios', href: '/settings/users' },
    ],
  },
];

export function MobileMenuDropdown() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // Get theme-aware TimeKast logo
  const timeKastLogo = branding.getTimeKastLogo('full', mounted ? resolvedTheme : 'light');

  // Don't render Menu until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button className="hover:bg-secondary rounded-lg p-2 lg:hidden" aria-label="Abrir menú">
        <MenuIcon className="text-foreground h-6 w-6" />
      </button>
    );
  }

  return (
    <Menu as="div" className="relative lg:hidden">
      <Menu.Button className="hover:bg-secondary rounded-lg p-2" aria-label="Abrir menú">
        <MenuIcon className="text-foreground h-6 w-6" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-card absolute left-0 mt-2 w-56 origin-top-left rounded-xl border border-white/10 py-1 shadow-xl ring-1 shadow-black/20 ring-black/5 backdrop-blur-sm">
          {navigation.map((item) => (
            <div key={item.name}>
              {/* Regular link item */}
              {item.href ? (
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={item.href!}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                        active && 'bg-secondary/80',
                        isActive(item.href!) && 'text-primary font-medium'
                      )}
                    >
                      <item.icon className="h-4 w-4 opacity-70" />
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ) : (
                /* Section with children (non-clickable header) */
                <>
                  <div className="text-muted-foreground flex items-center gap-3 px-4 py-2 text-xs font-semibold tracking-wide uppercase">
                    <item.icon className="h-4 w-4 opacity-50" />
                    {item.name}
                  </div>
                  {item.children?.map((child) => (
                    <Menu.Item key={child.name}>
                      {({ active }) => (
                        <Link
                          href={child.href}
                          className={cn(
                            'flex items-center gap-2 py-2 pr-4 pl-11 text-sm transition-colors',
                            active && 'bg-secondary/80',
                            isActive(child.href) && 'text-primary font-medium'
                          )}
                        >
                          {child.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
            </div>
          ))}

          {/* TimeKast Branding */}
          <div className="mt-2 border-t border-white/10 px-4 pt-3 pb-2">
            <div className="flex justify-center">
              <div className="relative h-6 w-full max-w-[80px]">
                <Image
                  src={timeKastLogo}
                  alt="TimeKast"
                  fill
                  className="object-contain opacity-50"
                  sizes="80px"
                />
              </div>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
