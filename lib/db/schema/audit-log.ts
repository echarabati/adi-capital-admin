/**
 * Audit Log Schema
 *
 * Tracks changes to entities for audit trail and compliance.
 * Records who made changes, when, and what was changed.
 *
 * @see INFRA-010
 */

import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// =============================================================================
// Audit Log Table
// =============================================================================

/**
 * Audit log for tracking entity changes.
 *
 * Records:
 * - CONFIRM: Movement confirmed
 * - CANCEL: Movement cancelled
 * - UPDATE: Entity updated
 * - DELETE: Entity soft-deleted
 */
export const auditLog = pgTable(
  'audit_log',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    /** Type of entity (movimientos, inversiones, etc.) */
    entityType: text('entity_type').notNull(),

    /** ID of the affected entity */
    entityId: uuid('entity_id').notNull(),

    /** Action performed */
    action: text('action').notNull(),

    /** User who performed the action */
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),

    /** When the action was performed */
    timestamp: timestamp('timestamp', { mode: 'date', withTimezone: true }).notNull().defaultNow(),

    /** Additional context (previous values, reason, etc.) */
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('audit_log_entity_idx').on(table.entityType, table.entityId),
    index('audit_log_user_idx').on(table.userId),
    index('audit_log_timestamp_idx').on(table.timestamp),
  ]
);

// =============================================================================
// Relations
// =============================================================================

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));

// =============================================================================
// Types
// =============================================================================

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;

/** Common audit actions */
export const AUDIT_ACTIONS = {
  CONFIRM: 'CONFIRM',
  CANCEL: 'CANCEL',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  CREATE: 'CREATE',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
