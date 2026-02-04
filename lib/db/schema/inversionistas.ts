/**
 * Inversionistas Schema
 *
 * Investors who can participate in multiple funds.
 * Uses a pivot table for the N:M relationship with funds.
 *
 * @see 05_DATA_MODEL.md#e-003-inversionistas
 * @see SCHEMA-001
 */

import { pgTable, text, uuid, boolean, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { fondos } from './fondos';

// =============================================================================
// Inversionistas Table
// =============================================================================

/**
 * Investors table.
 *
 * Investors can be associated with multiple funds via inversionistasFondos.
 */
export const inversionistas = pgTable('inversionistas', {
  /** Unique identifier (UUID v4) */
  id: uuid('id').primaryKey().defaultRandom(),

  /** Full name */
  nombre: text('nombre').notNull(),

  /** Email address (optional) */
  email: text('email'),

  /** Phone number */
  telefono: text('telefono'),

  /** RFC (tax ID) for Mexican investors */
  rfc: text('rfc'),

  /** Notes or comments */
  notas: text('notas'),

  /** Flag for founding partners (can receive APS/RPS/PRS/DPRS movements) */
  esFundador: boolean('es_fundador').default(false),

  /** Associated sales agent (post-MVP) */
  agenteId: uuid('agente_id'),

  // Audit fields
  ...auditFields,
});

// =============================================================================
// Pivot Table: Inversionistas <-> Fondos (N:M)
// =============================================================================

/**
 * Many-to-many relationship between investors and funds.
 */
export const inversionistasFondos = pgTable(
  'inversionistas_fondos',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    /** Investor reference */
    inversionistaId: uuid('inversionista_id')
      .notNull()
      .references(() => inversionistas.id, { onDelete: 'cascade' }),

    /** Fund reference */
    fondoId: uuid('fondo_id')
      .notNull()
      .references(() => fondos.id, { onDelete: 'cascade' }),

    // Audit fields
    ...auditFields,
  },
  (table) => [
    unique('inversionistas_fondos_unique').on(table.inversionistaId, table.fondoId),
    index('inversionistas_fondos_inversionista_id_idx').on(table.inversionistaId),
    index('inversionistas_fondos_fondo_id_idx').on(table.fondoId),
  ]
);

// =============================================================================
// Relations
// =============================================================================

export const inversionistasRelations = relations(inversionistas, ({ many }) => ({
  fondos: many(inversionistasFondos),
  inversiones: many(inversiones),
}));

export const inversionistasFondosRelations = relations(inversionistasFondos, ({ one }) => ({
  inversionista: one(inversionistas, {
    fields: [inversionistasFondos.inversionistaId],
    references: [inversionistas.id],
  }),
  fondo: one(fondos, {
    fields: [inversionistasFondos.fondoId],
    references: [fondos.id],
  }),
}));

// =============================================================================
// Types
// =============================================================================

export type Inversionista = typeof inversionistas.$inferSelect;
export type NewInversionista = typeof inversionistas.$inferInsert;
export type InversionistaFondo = typeof inversionistasFondos.$inferSelect;
export type NewInversionistaFondo = typeof inversionistasFondos.$inferInsert;

// Forward declaration for relations
import { inversiones } from './inversiones';
