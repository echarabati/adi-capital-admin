/**
 * Inversionista Detail Page
 *
 * Default page redirects to Inversiones tab.
 *
 * @see INV-003
 */

import { redirect } from 'next/navigation';

interface InversionistaPageProps {
  params: Promise<{ id: string }>;
}

export default async function InversionistaPage({ params }: InversionistaPageProps) {
  const { id } = await params;
  redirect(`/inversionistas/${id}/inversiones`);
}
