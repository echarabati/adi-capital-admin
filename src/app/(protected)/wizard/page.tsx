/**
 * Wizard Page
 *
 * Multi-step wizard for capital distribution.
 * Server component with auth check, renders WizardContainer.
 *
 * @see WIZ-001
 * @see SCR-060
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getProyectosForWizard } from './wizard-queries';
import { WizardContainer } from './WizardContainer';

export default async function WizardPage() {
  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch proyectos for step 1
  const proyectos = await getProyectosForWizard();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">Wizard de Reparto</h1>
        <p className="text-muted-foreground">
          Asistente para distribución de capital a inversionistas
        </p>
      </div>
      <WizardContainer proyectos={proyectos} />
    </div>
  );
}
