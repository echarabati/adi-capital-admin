'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import { Sun, Moon, Monitor, UserCircle, LogOut, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils/cn';
import { MobileMenuDropdown } from './MobileMenu';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { usePwaInstall } from '@/lib/pwa/usePwaInstall';
import { Avatar } from '@/components/ui/Avatar';
import { useMounted } from '@/lib/hooks/useMounted';

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

type Theme = 'light' | 'midnight' | 'dark';

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'midnight', label: 'Medianoche', icon: Moon },
  { value: 'dark', label: 'Oscuro', icon: Monitor },
];

export function Header({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const { canInstall, isInstalled, promptInstall } = usePwaInstall();

  const currentTheme = (theme as Theme) || 'midnight';
  const CurrentIcon = themes.find((t) => t.value === currentTheme)?.icon || Moon;

  return (
    <header
      className="bg-card fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:left-60 lg:px-6"
      style={{
        borderColor: 'var(--header-border)',
        backgroundColor: 'var(--header-bg)',
      }}
    >
      {/* Left: Mobile menu (hidden on desktop since sidebar is visible) */}
      <div className="flex items-center gap-3 lg:hidden">
        <MobileMenuDropdown />
      </div>

      {/* Center: Breadcrumb (hidden on mobile) */}
      <div className="hidden flex-1 lg:block">
        <Breadcrumb />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Selector Dropdown */}
        {mounted && (
          <Menu as="div" className="relative">
            <Menu.Button className="text-foreground hover:bg-secondary flex items-center gap-2 rounded-full p-2 transition-colors">
              <CurrentIcon className="h-5 w-5" />
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
              <Menu.Items className="bg-card absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-white/10 py-1 shadow-xl ring-1 shadow-black/20 ring-black/5 backdrop-blur-sm">
                {themes.map(({ value, label, icon: Icon }) => (
                  <Menu.Item key={value}>
                    {({ active }) => (
                      <button
                        onClick={() => setTheme(value)}
                        className={cn(
                          'flex w-full items-center gap-2 px-4 py-2 text-sm',
                          active && 'bg-secondary',
                          currentTheme === value && 'text-primary font-medium'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        )}

        {/* User Menu Dropdown */}
        {mounted ? (
          <Menu as="div" className="relative">
            <Menu.Button className="hover:bg-secondary/50 flex items-center gap-2 rounded-full p-1 transition-colors">
              <Avatar src={user?.image} name={user?.name || user?.email || 'Usuario'} size="sm" />
              {/* User name - hidden on mobile */}
              <span className="text-foreground hidden text-sm font-medium lg:block">
                {user?.name || 'Usuario'}
              </span>
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
              <Menu.Items className="bg-card absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-white/10 py-1 shadow-xl ring-1 shadow-black/20 ring-black/5 backdrop-blur-sm">
                {/* User info */}
                <div className="border-card-border border-b px-4 py-2">
                  <p className="text-foreground truncate text-sm font-medium">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                </div>

                {/* Profile link */}
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/settings/profile"
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-sm',
                        active && 'bg-secondary'
                      )}
                    >
                      <UserCircle className="h-4 w-4" />
                      Editar perfil
                    </Link>
                  )}
                </Menu.Item>

                {/* Install App (PWA) - only shows when installable */}
                {canInstall && !isInstalled && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => promptInstall()}
                        className={cn(
                          'flex w-full items-center gap-2 px-4 py-2 text-sm',
                          active && 'bg-secondary'
                        )}
                      >
                        <Download className="h-4 w-4" />
                        Instalar app
                      </button>
                    )}
                  </Menu.Item>
                )}

                {/* Logout */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className={cn(
                        'text-error flex w-full items-center gap-2 px-4 py-2 text-sm',
                        active && 'bg-secondary'
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <div className="flex items-center gap-2 rounded-full p-1">
            <Avatar src={user?.image} name={user?.name || user?.email || 'Usuario'} size="sm" />
            <span className="text-foreground hidden text-sm font-medium lg:block">
              {user?.name || 'Usuario'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
