/**
 * Super Admin Utilities
 *
 * Simple role-based super admin detection.
 *
 * ## How It Works
 *
 * 1. **Seed creates the first super_admin** — `pnpm db:seed`
 * 2. **Promotion in-app** — Only super_admins can promote others
 *
 * No env-based whitelist. Role is determined solely by database.
 *
 * @see SEED-001 for superadmin bootstrap
 */

import { logger } from '@/lib/logger';
import { isSuperAdmin as isSuperAdminRole } from '@/config/roles';

// =============================================================================
// Types
// =============================================================================

export interface SuperAdminActionLog {
  userId: string;
  email: string;
  action: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  ip?: string;
}

// =============================================================================
// Super Admin Detection
// =============================================================================

/**
 * Check if a user object is a super admin
 *
 * @param user - User object with role property
 * @returns true if user is super admin
 *
 * @example
 * if (isUserSuperAdmin(session.user)) {
 *   // Show admin panel
 * }
 */
export function isUserSuperAdmin(user: { role?: string } | null | undefined): boolean {
  return user?.role ? isSuperAdminRole(user.role) : false;
}

// =============================================================================
// Audit Logging
// =============================================================================

// In-memory log for development. In production, use a proper logging service.
const auditLog: SuperAdminActionLog[] = [];

/**
 * Log a super admin action for audit purposes
 *
 * @param userId - The super admin's user ID
 * @param email - The super admin's email
 * @param action - The action being performed
 * @param metadata - Additional context
 */
export async function logSuperAdminAction(
  userId: string,
  email: string,
  action: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const logEntry: SuperAdminActionLog = {
    userId,
    email,
    action,
    metadata,
    timestamp: new Date(),
    ip: metadata?.ip as string | undefined,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    logger.info('[SuperAdmin Audit]', JSON.stringify(logEntry, null, 2));
  }

  // Store in memory (replace with database/service in production)
  auditLog.push(logEntry);
}

/**
 * Get recent super admin actions (for audit UI)
 *
 * @param limit - Maximum number of entries to return
 * @returns Recent audit log entries
 */
export function getRecentSuperAdminActions(limit = 100): SuperAdminActionLog[] {
  return auditLog.slice(-limit).reverse();
}

// =============================================================================
// Alerts
// =============================================================================

/**
 * Send alert when super admin access is used
 *
 * @param userId - The super admin's user ID
 * @param email - The super admin's email
 * @param action - What triggered the alert
 */
export async function alertSuperAdminUsage(
  userId: string,
  email: string,
  action: 'promoted' | 'used_emergency_access'
): Promise<void> {
  const alertMessages = {
    promoted: `⚠️ User promoted to super admin: ${email}`,
    used_emergency_access: `🔐 Super admin used emergency access: ${email}`,
  };

  const message = alertMessages[action];

  // Log to console
  logger.warn(`[SuperAdmin Alert] ${message}`);

  // NOTE: Production alerting extension point
  // await sendSlackAlert(message);
}
