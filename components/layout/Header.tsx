'use client';

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import { Sun, Moon, Monitor, UserCircle, LogOut, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { branding } from '@/config/branding';
import { cn } from '@/lib/utils/cn';
import { MobileMenuDropdown } from './MobileMenu';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { usePwaInstall } from '@/lib/pwa/usePwaInstall';

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
  const [mounted, setMounted] = useState(false);
  const { canInstall, isInstalled, promptInstall } = usePwaInstall();

  // eslint-disable-next-line -- intentional SSR pattern
  useEffect(() => void setMounted(true), []);

  const currentTheme = (theme as Theme) || 'midnight';
  const CurrentIcon = themes.find((t) => t.value === currentTheme)?.icon || Moon;

  // Get user initials
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header
      className="bg-card fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 lg:px-6"
      style={{
        borderColor: 'var(--header-border)',
        backgroundColor: 'var(--header-bg)',
      }}
    >
      {/* Left: Sidebar area (app name) - matches sidebar width */}
      <div className="flex items-center gap-3 lg:w-60 lg:shrink-0">
        {/* Mobile menu dropdown */}
        <MobileMenuDropdown />

        {/* App name or logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          {branding.clientLogoPath ? (
            <Image
              src={branding.clientLogoPath}
              alt={branding.appName}
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          ) : (
            <span className="text-foreground text-lg font-bold">{branding.appName}</span>
          )}
        </Link>
      </div>

      {/* Center: Breadcrumb (starts after sidebar, hidden on mobile) */}
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
              <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                {userInitials}
              </span>
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
            <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
              {userInitials}
            </span>
            <span className="text-foreground hidden text-sm font-medium lg:block">
              {user?.name || 'Usuario'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
