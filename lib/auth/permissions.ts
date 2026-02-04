/**
 * Permission System (RBAC)
 *
 * Role-Based Access Control with resource-level permissions.
 * Super admin always has access to everything.
 *
 * Customize the PERMISSIONS matrix per project based on Discovery.
 *
 * @see ADR-007: Auth Framework Design
 */

import { ROLES, hasRoleOrHigher, isSuperAdmin } from '@/config/roles';

// =============================================================================
// Types
// =============================================================================

/** Available resources in the system */
export type Resource = 'users' | 'posts' | 'comments' | 'settings';

/** Available actions on resources */
export type Action = 'create' | 'read' | 'update' | 'delete' | 'list';

/** Permission matrix type */
export type PermissionMatrix = {
  [R in Resource]: {
    [A in Action]?: string[];
  };
};

// =============================================================================
// Permission Matrix Configuration
// =============================================================================

/**
 * Permission matrix defining which roles can perform which actions on resources.
 *
 * Customize per project based on Discovery phase requirements.
 *
 * @example E-commerce customization:
 * export const PERMISSIONS: PermissionMatrix = {
 *   products: {
 *     create: ['seller', 'admin', 'super_admin'],
 *     read: ['customer', 'seller', 'admin', 'super_admin'],
 *     update: ['seller', 'admin', 'super_admin'],
 *     delete: ['admin', 'super_admin'],
 *   },
 *   orders: {
 *     create: ['customer', 'seller', 'admin', 'super_admin'],
 *     read: ['customer', 'seller', 'admin', 'super_admin'], // Own orders
 *     cancel: ['customer', 'admin', 'super_admin'],
 *     refund: ['admin', 'super_admin'],
 *   },
 * };
 */
export const PERMISSIONS: PermissionMatrix = {
  users: {
    create: [ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    read: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    update: [ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    delete: [ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    list: [ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
  },
  posts: {
    create: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    read: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    update: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN], // Own posts only for agente
    delete: [ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    list: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
  },
  comments: {
    create: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    read: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    update: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN], // Own comments only for agente
    delete: [ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    list: [ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
  },
  settings: {
    read: [ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN],
    update: [ROLES.SUPER_ADMIN],
  },
};

// =============================================================================
// Permission Check Functions
// =============================================================================

/**
 * Check if a user with given role has permission to perform an action on a resource
 *
 * @param userRole - The user's current role
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @returns true if user has permission
 *
 * @example
 * // In a server action
 * if (!hasPermission(session.user.role, 'users', 'delete')) {
 *   throw new Error('Permission denied');
 * }
 *
 * @example
 * // Conditional UI
 * {hasPermission(user.role, 'posts', 'create') && <CreatePostButton />}
 */
export function hasPermission(
  userRole: string | undefined | null,
  resource: Resource,
  action: Action
): boolean {
  // No role = no permission
  if (!userRole) return false;

  // Super admin always has permission
  if (isSuperAdmin(userRole)) return true;

  // Get allowed roles for this resource/action
  const allowedRoles = PERMISSIONS[resource]?.[action];

  // If no permissions defined, deny by default
  if (!allowedRoles || allowedRoles.length === 0) return false;

  // Check if user's role is in allowed list
  return allowedRoles.includes(userRole);
}

/**
 * Require permission - throws if denied
 *
 * Use in server actions to enforce permissions with automatic error handling.
 *
 * @param userRole - The user's current role
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @throws Error if permission denied
 *
 * @example
 * // In a server action
 * export async function deleteUser(userId: string) {
 *   const session = await auth();
 *   requirePermission(session?.user?.role, 'users', 'delete');
 *
 *   // Proceed with deletion
 *   await db.delete(users).where(eq(users.id, userId));
 * }
 */
export function requirePermission(
  userRole: string | undefined | null,
  resource: Resource,
  action: Action
): void {
  if (!hasPermission(userRole, resource, action)) {
    throw new Error(
      `Permission denied: ${action} on ${resource} requires role with higher privileges`
    );
  }
}

/**
 * Check if user has role or higher (without resource context)
 *
 * @param userRole - The user's current role
 * @param minimumRole - The minimum required role
 * @returns true if user meets minimum role requirement
 *
 * @example
 * // Require at least admin role
 * if (!hasMinimumRole(user.role, 'admin')) {
 *   redirect('/unauthorized');
 * }
 */
export function hasMinimumRole(userRole: string | undefined | null, minimumRole: string): boolean {
  if (!userRole) return false;
  return hasRoleOrHigher(userRole, minimumRole);
}

// =============================================================================
// Resource Discovery Functions
// =============================================================================

/**
 * Get all resources a user can access (for UI rendering)
 *
 * @param userRole - The user's current role
 * @returns Array of resources the user can access with at least one action
 *
 * @example
 * const accessibleResources = getUserAccessibleResources(user.role);
 * // ['posts', 'comments'] for regular user
 * // ['users', 'posts', 'comments', 'settings'] for admin
 */
export function getUserAccessibleResources(userRole: string | undefined | null): Resource[] {
  if (!userRole) return [];
  if (isSuperAdmin(userRole)) return Object.keys(PERMISSIONS) as Resource[];

  return (Object.keys(PERMISSIONS) as Resource[]).filter((resource) => {
    const actions = PERMISSIONS[resource];
    return Object.values(actions).some((roles) => roles?.includes(userRole));
  });
}

/**
 * Get all actions a user can perform on a resource
 *
 * @param userRole - The user's current role
 * @param resource - The resource to check
 * @returns Array of allowed actions
 *
 * @example
 * const actions = getUserActionsForResource(user.role, 'posts');
 * // ['create', 'read', 'update', 'list'] for regular user
 * // All actions for admin
 */
export function getUserActionsForResource(
  userRole: string | undefined | null,
  resource: Resource
): Action[] {
  if (!userRole) return [];
  if (isSuperAdmin(userRole)) {
    return Object.keys(PERMISSIONS[resource] || {}) as Action[];
  }

  const resourcePermissions = PERMISSIONS[resource];
  if (!resourcePermissions) return [];

  return (Object.entries(resourcePermissions) as [Action, string[]][])
    .filter(([, roles]) => roles?.includes(userRole))
    .map(([action]) => action);
}

// =============================================================================
// Permission Matrix Utilities
// =============================================================================

/**
 * Get a summary of all permissions for display (admin UI)
 *
 * @returns Permission matrix summary
 */
export function getPermissionSummary(): {
  resource: Resource;
  actions: { action: Action; roles: string[] }[];
}[] {
  return (Object.entries(PERMISSIONS) as [Resource, PermissionMatrix[Resource]][]).map(
    ([resource, actions]) => ({
      resource,
      actions: (Object.entries(actions) as [Action, string[]][]).map(([action, roles]) => ({
        action,
        roles: roles || [],
      })),
    })
  );
}

/**
 * Check if a permission exists in the matrix
 *
 * @param resource - Resource to check
 * @param action - Action to check
 * @returns true if the permission is defined
 */
export function isPermissionDefined(resource: string, action: string): boolean {
  return Boolean(PERMISSIONS[resource as Resource]?.[action as Action]);
}
