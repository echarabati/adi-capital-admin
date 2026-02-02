'use server';

/**
 * User Admin Server Actions
 *
 * Server-side actions for admin user management (CRUD).
 * Only accessible by ADMIN and SUPER_ADMIN roles.
 *
 * @see CRUD-002
 */

import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { notDeleted } from '@/lib/db/helpers/soft-delete';
import { requirePermission } from '@/lib/auth/permissions';
import { isSuperAdmin, getAssignableRoles } from '@/src/config/roles';
import { createUserSchema, updateUserSchema } from '@/lib/validations/admin/user-admin';
import { hashPassword } from '@/lib/auth';

// =============================================================================
// Types
// =============================================================================

export type UserAdminResult = {
  success?: boolean;
  error?: string;
  data?: unknown;
};

export type UserListItem = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  deletedAt: Date | null;
};

// =============================================================================
// List Users
// =============================================================================

/**
 * Get all active users for admin listing.
 *
 * @returns List of users (filtered by soft delete)
 */
export async function getUsers(): Promise<UserListItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  requirePermission(session.user.role, 'users', 'list');

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      deletedAt: users.deletedAt,
    })
    .from(users)
    .where(notDeleted(users))
    .orderBy(users.createdAt);

  return result;
}

// =============================================================================
// Create User
// =============================================================================

/**
 * Create a new user.
 *
 * @param input - User data to create
 * @returns Result with success or error
 */
export async function createUser(input: unknown): Promise<UserAdminResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Permission check
  try {
    requirePermission(session.user.role, 'users', 'create');
  } catch {
    return { error: 'No tienes permiso para crear usuarios' };
  }

  // 3. Validate input
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  const { name, email, role, password } = parsed.data;

  // 4. Check assignable roles
  const assignableRoles = getAssignableRoles(session.user.role);
  if (!assignableRoles.includes(role as (typeof assignableRoles)[number])) {
    return { error: 'No puedes asignar ese rol' };
  }

  // 5. Check email uniqueness
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: 'Ya existe un usuario con ese email' };
  }

  try {
    // 6. Hash password if provided
    const hashedPassword = password ? await hashPassword(password) : null;

    // 7. Create user
    await db.insert(users).values({
      name,
      email,
      role,
      password: hashedPassword,
      createdBy: session.user.id,
      modifiedBy: session.user.id,
    });

    // 8. Revalidate cache
    revalidatePath('/settings/users');

    return { success: true };
  } catch (error) {
    console.error('[createUser]', error);
    return { error: 'No pudimos crear el usuario. Intenta de nuevo.' };
  }
}

// =============================================================================
// Update User
// =============================================================================

/**
 * Update an existing user.
 *
 * @param id - User ID to update
 * @param input - User data to update
 * @returns Result with success or error
 */
export async function updateUser(id: string, input: unknown): Promise<UserAdminResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Permission check
  try {
    requirePermission(session.user.role, 'users', 'update');
  } catch {
    return { error: 'No tienes permiso para editar usuarios' };
  }

  // 3. Validate input
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  const { name, email, role } = parsed.data;

  // 4. Get target user
  const [targetUser] = await db
    .select({ id: users.id, role: users.role, email: users.email })
    .from(users)
    .where(and(eq(users.id, id), notDeleted(users)))
    .limit(1);

  if (!targetUser) {
    return { error: 'Usuario no encontrado' };
  }

  // 5. Prevent demoting SUPER_ADMIN (unless you are SUPER_ADMIN)
  if (isSuperAdmin(targetUser.role) && !isSuperAdmin(session.user.role)) {
    return { error: 'No puedes modificar a un Super Admin' };
  }

  // 6. Check assignable roles
  const assignableRoles = getAssignableRoles(session.user.role);
  if (!assignableRoles.includes(role as (typeof assignableRoles)[number])) {
    return { error: 'No puedes asignar ese rol' };
  }

  // 7. Check email uniqueness (if changed)
  if (email !== targetUser.email) {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: 'Ya existe un usuario con ese email' };
    }
  }

  try {
    // 8. Update user
    await db
      .update(users)
      .set({
        name,
        email,
        role,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(users.id, id));

    // 9. Revalidate cache
    revalidatePath('/settings/users');

    return { success: true };
  } catch (error) {
    console.error('[updateUser]', error);
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' };
  }
}

// =============================================================================
// Delete User (Soft Delete)
// =============================================================================

/**
 * Soft delete a user.
 *
 * Protections:
 * - Cannot delete yourself
 * - Cannot delete SUPER_ADMIN
 *
 * @param id - User ID to delete
 * @returns Result with success or error
 */
export async function deleteUser(id: string): Promise<UserAdminResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Permission check
  try {
    requirePermission(session.user.role, 'users', 'delete');
  } catch {
    return { error: 'No tienes permiso para eliminar usuarios' };
  }

  // 3. Prevent self-delete
  if (id === session.user.id) {
    return { error: 'No puedes eliminarte a ti mismo' };
  }

  // 4. Get target user
  const [targetUser] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(and(eq(users.id, id), notDeleted(users)))
    .limit(1);

  if (!targetUser) {
    return { error: 'Usuario no encontrado' };
  }

  // 5. Prevent deleting SUPER_ADMIN
  if (isSuperAdmin(targetUser.role)) {
    return { error: 'SUPER_ADMIN no puede ser eliminado' };
  }

  try {
    // 6. Soft delete
    await db
      .update(users)
      .set({
        deletedAt: new Date(),
        deletedBy: session.user.id,
      })
      .where(eq(users.id, id));

    // 7. Revalidate cache
    revalidatePath('/settings/users');

    return { success: true };
  } catch (error) {
    console.error('[deleteUser]', error);
    return { error: 'No pudimos eliminar el usuario. Intenta de nuevo.' };
  }
}
