'use client';

/**
 * Dashboard Shell
 *
 * Client component wrapper for protected pages.
 * Includes Header, Sidebar, and FundProvider for global fund selection.
 *
 * @see DASH-002
 */

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { PwaInstallToast, IosA2hsHint } from '@/components/pwa';
import { FundProvider, FondoOption } from '@/lib/contexts/FundContext';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: User;
  fondos: FondoOption[];
  initialFondoId?: string | null;
}

export function DashboardShell({ children, user, fondos, initialFondoId }: DashboardShellProps) {
  return (
    <FundProvider fondos={fondos} initialFondoId={initialFondoId}>
      <div className="bg-background min-h-screen">
        <Header user={user} userRole={user.role} />

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar userRole={user.role} />
        </div>

        {/* Main content area */}
        <main className="min-w-0 pt-16 lg:ml-60">
          <div className="max-w-full p-4 lg:p-6">{children}</div>
        </main>

        {/* PWA Install prompts - only in protected pages */}
        <PwaInstallToast />
        <IosA2hsHint />
      </div>
    </FundProvider>
  );
}
