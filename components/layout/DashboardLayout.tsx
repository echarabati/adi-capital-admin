'use client';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Simple Dashboard Layout component
 * Note: For authenticated routes, use DashboardShell from (protected)/DashboardShell.tsx
 * which handles auth and passes user data to Header
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="pt-16 lg:ml-60">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
