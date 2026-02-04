'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { PwaInstallToast, IosA2hsHint } from '@/components/pwa';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: User;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div className="bg-background min-h-screen">
      <Header user={user} />

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
  );
}
