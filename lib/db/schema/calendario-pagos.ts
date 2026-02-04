/**
 * Calendario de Pagos Schema
 *
 * Capital calls scheduled for investments.
 * Tracks expected and actual payment progress.
 *
 * @see 05_DATA_MODEL.md#e-006-calendario-de-pagos
 * @see SCHEMA-002
 */

import { pgTable, uuid, integer, decimal, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { estadoCallEnum } from './enums';
import { inversiones } from './inversiones';

// =============================================================================
// Calendario Pagos Table
// =============================================================================

/**
 * Capital call schedule table.
 *
 * Each investment can have multiple scheduled capital calls.
 */
export const calendarioPagos = pgTable(
  'calendario_pagos',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    /** Investment this schedule belongs to */
    inversionId: uuid('inversion_id')
      .notNull()
      .references(() => inversiones.id, { onDelete: 'cascade' }),

    /** Sequential number within the investment (1, 2, 3...) */
    numero: integer('numero').notNull(),

    /** Scheduled payment date */
    fechaProgramada: timestamp('fecha_programada', { mode: 'date', withTimezone: true }).notNull(),

    /** Expected payment amount */
    montoEsperado: decimal('monto_esperado', { precision: 18, scale: 2 }).notNull(),

    /** Cached: Amount paid so far */
    montoPagado: decimal('monto_pagado', { precision: 18, scale: 2 }).default('0'),

    /** Payment state */
    estado: estadoCallEnum('estado').notNull().default('pendiente'),

    /** Notes about this capital call */
    notas: text('notas'),

    // Audit fields
    ...auditFields,
  },
  (table) => [
    index('calendario_pagos_inversion_id_idx').on(table.inversionId),
    unique('calendario_pagos_unique').on(table.inversionId, table.numero),
  ]
);

// Import text for notas field
import { text } from 'drizzle-orm/pg-core';

// =============================================================================
// Relations
// =============================================================================

export const calendarioPagosRelations = relations(calendarioPagos, ({ one }) => ({
  inversion: one(inversiones, {
    fields: [calendarioPagos.inversionId],
    references: [inversiones.id],
  }),
}));

// =============================================================================
// Types
// =============================================================================

export type CalendarioPago = typeof calendarioPagos.$inferSelect;
export type NewCalendarioPago = typeof calendarioPagos.$inferInsert;

// =============================================================================
// Helpers
// =============================================================================

/**
 * Calculate remaining amount for a capital call.
 */
export function getMontoPendiente(
  call: Pick<CalendarioPago, 'montoEsperado' | 'montoPagado'>
): number {
  const esperado = Number(call.montoEsperado) || 0;
  const pagado = Number(call.montoPagado) || 0;
  return Math.max(0, esperado - pagado);
}
