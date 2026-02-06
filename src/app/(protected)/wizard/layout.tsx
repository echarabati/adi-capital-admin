/**
 * Wizard Layout
 *
 * Simple layout for wizard pages with full-width content.
 *
 * @see WIZ-001
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wizard de Reparto | ADI Capital',
  description: 'Asistente para distribución de capital',
};

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
