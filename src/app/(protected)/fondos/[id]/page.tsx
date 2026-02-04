/**
 * Fondo Detail Page
 *
 * Default page redirects to Proyectos tab.
 *
 * @see FOND-003
 */

import { redirect } from 'next/navigation';

interface FondoPageProps {
  params: Promise<{ id: string }>;
}

export default async function FondoPage({ params }: FondoPageProps) {
  const { id } = await params;
  redirect(`/fondos/${id}/proyectos`);
}
