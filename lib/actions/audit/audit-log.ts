'use server';

/**
 * Audit Logging Utility
 *
 * Server action for creating audit log entries.
 * Used to track entity changes for compliance and debugging.
 *
 * @see INFRA-010
 */

import { db } from '@/lib/db/drizzle';
import { auditLog, type AuditAction } from '@/lib/db/schema';

// =============================================================================
// Types
// =============================================================================

interface AuditLogInput {
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId: string;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Create an audit log entry.
 *
 * @example
 * await logAuditEvent({
 *   entityType: 'movimientos',
 *   entityId: movimiento.id,
 *   action: 'CANCEL',
 *   userId: session.user.id,
 *   metadata: { motivo: 'Error en monto', previousEstado: 'confirmado' }
 * });
 */
export async function logAuditEvent(input: AuditLogInput): Promise<void> {
  try {
    await db.insert(auditLog).values({
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      userId: input.userId,
      metadata: input.metadata || null,
    });
  } catch (error) {
    // Log but don't throw - audit logging should never break functionality
    console.error('[logAuditEvent] Failed to create audit log:', error);
  }
}
