/**
 * Profile Settings Page
 *
 * User profile editing page within settings.
 * Route: /settings/profile
 */

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth/auth';
import { getProfileUser } from '@/lib/db/queries/users';
import { isEmailConfigured } from '@/lib/env';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { BreadcrumbSetter } from '@/components/common/BreadcrumbSetter';

export const metadata: Metadata = {
  title: 'Perfil | Configuración',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await getProfileUser(session.user.id);

  if (!user) {
    redirect('/login');
  }

  const emailEnabled = isEmailConfigured();

  return (
    <>
      <BreadcrumbSetter segment="profile" label="Perfil" />

      <div className="mx-auto max-w-2xl py-6">
        <div className="mb-6">
          <h1 className="text-foreground text-2xl font-bold">Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y seguridad.</p>
        </div>

        <ProfileForm
          user={{
            name: user.name,
            email: user.email,
            hasPassword: !!user.password,
          }}
          emailConfigured={emailEnabled}
        />
      </div>
    </>
  );
}
