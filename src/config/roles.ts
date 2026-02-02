/**
 * Role System Configuration
 *
 * Configurable role hierarchy for RBAC (Role-Based Access Control).
 * Roles are stored as text in the database to avoid migrations when adding new roles.
 *
 * Customize this file per project during Discovery phase.
 *
 * @see ADR-007: Auth Framework Design
 */

// =============================================================================
// Role Definitions
// =============================================================================

/**
 * Available roles in the system.
 * Customize per project - add/remove as needed.
 *
 * @example E-commerce project:
 * export const ROLES = {
 *   SUPER_ADMIN: 'super_admin',
 *   ADMIN: 'admin',
 *   SELLER: 'seller',
 *   CUSTOMER: 'customer',
 * } as const;
 *
 * @example SaaS project:
 * export const ROLES = {
 *   SUPER_ADMIN: 'super_admin',
 *   OWNER: 'owner',
 *   ADMIN: 'admin',
 *   MEMBER: 'member',
 *   GUEST: 'guest',
 * } as const;
 */
export const ROLES = {
  /** System super admin - has all permissions, cannot be deleted */
  SUPER_ADMIN: 'super_admin',
  /** Project admin - manages users and content */
  ADMIN: 'admin',
  /** Regular authenticated user */
  USER: 'user',
} as const;

/** Type for role values */
export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Role hierarchy from highest to lowest privilege.
 * Order matters: first role has highest privileges.
 *
 * Used by `hasRoleOrHigher()` to determine access.
 */
export const ROLE_HIERARCHY: Role[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER];

// =============================================================================
// Role Utility Functions
// =============================================================================

/**
 * Get the privilege level of a role (lower = more privileged)
 *
 * @param role - The role to check
 * @returns The index in hierarchy (0 = highest), -1 if not found
 *
 * @example
 * getRoleLevel('super_admin') // 0
 * getRoleLevel('admin')       // 1
 * getRoleLevel('user')        // 2
 */
export function getRoleLevel(role: string): number {
  return ROLE_HIERARCHY.indexOf(role as Role);
}

/**
 * Check if a user's role meets or exceeds the required role level
 *
 * @param userRole - The user's current role
 * @param requiredRole - The minimum required role
 * @returns true if user has required role or higher
 *
 * @example
 * hasRoleOrHigher('admin', 'user')        // true (admin > user)
 * hasRoleOrHigher('user', 'admin')        // false (user < admin)
 * hasRoleOrHigher('super_admin', 'admin') // true (super_admin > admin)
 */
export function hasRoleOrHigher(userRole: string, requiredRole: string): boolean {
  const userLevel = getRoleLevel(userRole);
  const requiredLevel = getRoleLevel(requiredRole);

  // Invalid roles don't have access
  if (userLevel === -1 || requiredLevel === -1) {
    return false;
  }

  // Lower index = higher privilege
  return userLevel <= requiredLevel;
}

/**
 * Check if a role string is valid
 *
 * @param role - The role to validate
 * @returns true if role exists in ROLES
 *
 * @example
 * isValidRole('admin')   // true
 * isValidRole('hacker')  // false
 */
export function isValidRole(role: string): role is Role {
  return ROLE_HIERARCHY.includes(role as Role);
}

/**
 * Get the default role for new users
 *
 * @returns The lowest privilege role in hierarchy
 */
export function getDefaultRole(): Role {
  return ROLE_HIERARCHY[ROLE_HIERARCHY.length - 1];
}

/**
 * Check if a role is the super admin role
 *
 * @param role - The role to check
 * @returns true if role is super_admin
 */
export function isSuperAdmin(role: string): boolean {
  return role === ROLES.SUPER_ADMIN;
}

/**
 * Get display name for a role (for UI)
 *
 * @param role - The role to get display name for
 * @returns Human-readable role name
 *
 * @example
 * getRoleDisplayName('super_admin') // 'Super Admin'
 * getRoleDisplayName('user')        // 'User'
 */
export function getRoleDisplayName(role: string): string {
  const displayNames: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrador',
    user: 'Usuario',
  };
  return displayNames[role] || role;
}

/**
 * Get all roles that a user with given role can assign to others
 *
 * @param userRole - The role of the user doing the assignment
 * @returns Array of roles that can be assigned
 *
 * @example
 * getAssignableRoles('super_admin') // ['super_admin', 'admin', 'user']
 * getAssignableRoles('admin')       // ['admin', 'user']
 * getAssignableRoles('user')        // []
 */
export function getAssignableRoles(userRole: string): Role[] {
  const userLevel = getRoleLevel(userRole);

  // Invalid roles or lowest role can't assign
  if (userLevel === -1 || userLevel === ROLE_HIERARCHY.length - 1) {
    return [];
  }

  // Can assign own role and below
  return ROLE_HIERARCHY.slice(userLevel);
}
