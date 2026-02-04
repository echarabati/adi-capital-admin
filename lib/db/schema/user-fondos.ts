/**
 * User-Fondos Schema
 *
 * N:M relationship between users and fondos for RBAC.
 * Allows admin_fondo users to be assigned to specific funds.
 *
 * @see 05_DATA_MODEL.md#e-010-usuarios
 * @see SCHEMA-003
 */

import { pgTable, uuid, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { users } from './users';
import { fondos } from './fondos';

// =============================================================================
// User-Fondos Pivot Table
// =============================================================================

/**
 * User to Fund assignment table.
 *
 * Used for RBAC: admin_fondo users can only access their assigned funds.
 * super_admin users have implicit access to all funds (no entries needed).
 */
export const userFondos = pgTable(
  'user_fondos',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    /** User being assigned to the fund */
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    /** Fund the user is assigned to */
    fondoId: uuid('fondo_id')
      .notNull()
      .references(() => fondos.id, { onDelete: 'cascade' }),

    // Audit fields
    ...auditFields,
  },
  (table) => [
    index('user_fondos_user_id_idx').on(table.userId),
    index('user_fondos_fondo_id_idx').on(table.fondoId),
    unique('user_fondos_unique').on(table.userId, table.fondoId),
  ]
);

// =============================================================================
// Relations
// =============================================================================

export const userFondosRelations = relations(userFondos, ({ one }) => ({
  user: one(users, {
    fields: [userFondos.userId],
    references: [users.id],
  }),
  fondo: one(fondos, {
    fields: [userFondos.fondoId],
    references: [fondos.id],
  }),
}));

// =============================================================================
// Types
// =============================================================================

export type UserFondo = typeof userFondos.$inferSelect;
export type NewUserFondo = typeof userFondos.$inferInsert;
