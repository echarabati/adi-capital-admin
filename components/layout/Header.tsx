'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import { Sun, Moon, Monitor, UserCircle, LogOut, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils/cn';
import { MobileDrawer } from './MobileDrawer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { usePwaInstall } from '@/lib/pwa/usePwaInstall';
import { Avatar } from '@/components/ui/Avatar';
import { useMounted } from '@/lib/hooks/useMounted';

import { NavigationControls } from './NavigationControls';

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  userRole?: string;
}

type Theme = 'light' | 'midnight' | 'dark';

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'midnight', label: 'Medianoche', icon: Moon },
  { value: 'dark', label: 'Oscuro', icon: Monitor },
];

export function Header({ user, userRole }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const { canInstall, isInstalled, promptInstall } = usePwaInstall();

  const currentTheme = (theme as Theme) || 'midnight';

  return (
    <header
      className="bg-card fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:left-60 lg:px-6"
      style={{
        borderColor: 'var(--header-border)',
        backgroundColor: 'var(--header-bg)',
      }}
    >
      {/* Left: Mobile menu + Nav Controls + Breadcrumb */}
      <div className="flex flex-1 items-center gap-1 overflow-hidden lg:gap-4">
        {/* Mobile drawer (hidden on desktop) */}
        <div className="shrink-0 lg:hidden">
          <MobileDrawer userRole={userRole} />
        </div>

        {/* Navigation Controls (Always visible) */}
        <NavigationControls />

        {/* Breadcrumb (Always visible, smart truncated) */}
        <div className="flex-1 overflow-hidden">
          <Breadcrumb className="whitespace-nowrap" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-2 pl-2">
        {/* Desktop Theme Toggle (hidden on mobile) */}
        {mounted && (
          <Menu as="div" className="relative hidden md:block">
            <Menu.Button className="text-foreground hover:bg-secondary flex items-center gap-2 rounded-full p-2 transition-colors">
              {(() => {
                const CurrentIcon = themes.find((t) => t.value === currentTheme)?.icon || Moon;
                return <CurrentIcon className="h-5 w-5" />;
              })()}
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
              <Menu.Items className="bg-card absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-white/10 py-1 shadow-xl ring-1 shadow-black/20 ring-black/5 backdrop-blur-sm focus:outline-none">
                {themes.map(({ value, label, icon: Icon }) => (
                  <Menu.Item key={value}>
                    {({ active }) => (
                      <button
                        onClick={() => setTheme(value)}
                        className={cn(
                          'flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors',
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
              <Menu.Items className="bg-card absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/10 py-1 shadow-xl ring-1 shadow-black/20 ring-black/5 backdrop-blur-sm focus:outline-none">
                {/* User info */}
                <div className="border-card-border border-b px-4 py-3">
                  <p className="text-foreground truncate text-sm font-medium">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                </div>

                <div className="p-1">
                  {/* Profile link */}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings/profile"
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                          active ? 'bg-secondary text-primary' : 'text-foreground'
                        )}
                      >
                        <UserCircle className="h-4 w-4 opacity-70" />
                        Editar perfil
                      </Link>
                    )}
                  </Menu.Item>

                  {/* Theme Submenu (Mobile only - desktop has toggle in header) */}
                  <div className="border-card-border mt-1 border-t pt-1 md:hidden">
                    <div className="text-muted-foreground px-3 py-1.5 text-xs font-semibold tracking-wider uppercase">
                      Tema
                    </div>
                    {themes.map(({ value, label, icon: Icon }) => (
                      <Menu.Item key={value}>
                        {({ active }) => (
                          <button
                            onClick={() => setTheme(value)}
                            className={cn(
                              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                              active ? 'bg-secondary' : '',
                              currentTheme === value
                                ? 'text-primary font-medium'
                                : 'text-foreground'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-4 w-4',
                                currentTheme === value ? 'opacity-100' : 'opacity-70'
                              )}
                            />
                            {label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>

                  {/* Install App (PWA) */}
                  {canInstall && !isInstalled && (
                    <div className="border-card-border mt-1 border-t pt-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => promptInstall()}
                            className={cn(
                              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                              active ? 'bg-secondary text-primary' : 'text-foreground'
                            )}
                          >
                            <Download className="h-4 w-4 opacity-70" />
                            Instalar app
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  )}

                  {/* Logout */}
                  <div className="border-card-border mt-1 border-t pt-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut({ callbackUrl: '/login' })}
                          className={cn(
                            'text-error flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                            active ? 'bg-error/10' : ''
                          )}
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar sesión
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <div className="flex items-center gap-2 rounded-full p-1">
            <Avatar src={user?.image} name={user?.name || user?.email || 'Usuario'} size="sm" />
          </div>
        )}
      </div>
    </header>
  );
}
