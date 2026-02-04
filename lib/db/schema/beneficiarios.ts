/**
 * Beneficiarios Schema
 *
 * Payment recipients for expense movements (GAS, GASP).
 * Stores vendor/supplier information for the fund.
 *
 * @see 05_DATA_MODEL.md#e-008-beneficiarios
 * @see SCHEMA-002
 */

import { pgTable, text, uuid, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { fondos } from './fondos';

// =============================================================================
// Beneficiarios Table
// =============================================================================

/**
 * Expense payment recipients table.
 *
 * Used for GAS (administrative expenses) and GASP (project expenses) movements.
 */
export const beneficiarios = pgTable(
  'beneficiarios',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    /** Fund this beneficiary belongs to */
    fondoId: uuid('fondo_id')
      .notNull()
      .references(() => fondos.id),

    /** Beneficiary name */
    nombre: text('nombre').notNull(),

    /** Bank name (optional) */
    banco: text('banco'),

    /** Account number (optional) */
    numeroCuenta: text('numero_cuenta'),

    /** CLABE (Mexican interbank code, optional) */
    clabe: text('clabe'),

    /** Notes about this beneficiary */
    notas: text('notas'),

    // Audit fields
    ...auditFields,
  },
  (table) => [
    index('beneficiarios_fondo_id_idx').on(table.fondoId),
    unique('beneficiarios_unique').on(table.fondoId, table.nombre),
  ]
);

// =============================================================================
// Relations
// =============================================================================

export const beneficiariosRelations = relations(beneficiarios, ({ one, many }) => ({
  fondo: one(fondos, {
    fields: [beneficiarios.fondoId],
    references: [fondos.id],
  }),
  movimientos: many(movimientos),
}));

// =============================================================================
// Types
// =============================================================================

export type Beneficiario = typeof beneficiarios.$inferSelect;
export type NewBeneficiario = typeof beneficiarios.$inferInsert;

// Forward declaration for relations
import { movimientos } from './movimientos';
