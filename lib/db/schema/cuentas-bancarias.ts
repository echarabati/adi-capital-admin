/**
 * Cuentas Bancarias Schema
 *
 * Bank accounts belonging to funds.
 * Used for tracking money in/out and account balances.
 *
 * @see 05_DATA_MODEL.md#e-007-cuentas-bancarias
 * @see SCHEMA-002
 */

import { pgTable, text, uuid, decimal, boolean, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { monedaEnum } from './enums';
import { fondos } from './fondos';

// =============================================================================
// Cuentas Bancarias Table
// =============================================================================

/**
 * Fund bank accounts table.
 *
 * Each fund can have multiple accounts in different currencies.
 */
export const cuentasBancarias = pgTable(
  'cuentas_bancarias',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    /** Fund this account belongs to */
    fondoId: uuid('fondo_id')
      .notNull()
      .references(() => fondos.id),

    /** Bank name */
    banco: text('banco').notNull(),

    /** Account number */
    numero: text('numero').notNull(),

    /** CLABE (Mexican interbank code, optional) */
    clabe: text('clabe'),

    /** Account currency */
    moneda: monedaEnum('moneda').notNull(),

    /** Cached: Current balance */
    saldo: decimal('saldo', { precision: 18, scale: 2 }).default('0'),

    /** Whether the account is active */
    activa: boolean('activa').default(true),

    // Audit fields
    ...auditFields,
  },
  (table) => [
    index('cuentas_bancarias_fondo_id_idx').on(table.fondoId),
    unique('cuentas_bancarias_unique').on(table.fondoId, table.numero),
  ]
);

// =============================================================================
// Relations
// =============================================================================

export const cuentasBancariasRelations = relations(cuentasBancarias, ({ one, many }) => ({
  fondo: one(fondos, {
    fields: [cuentasBancarias.fondoId],
    references: [fondos.id],
  }),
  movimientos: many(movimientos),
}));

// =============================================================================
// Types
// =============================================================================

export type CuentaBancaria = typeof cuentasBancarias.$inferSelect;
export type NewCuentaBancaria = typeof cuentasBancarias.$inferInsert;

// Forward declaration for relations
import { movimientos } from './movimientos';
