/**
 * Proyectos Schema
 *
 * Investment projects within a fund.
 * Inherits cascade method from fund or can override.
 *
 * @see 05_DATA_MODEL.md#e-002-proyectos
 * @see SCHEMA-001
 */

import { pgTable, text, uuid, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { metodoCascadaEnum, estadoProyectoEnum } from './enums';
import { fondos } from './fondos';

// =============================================================================
// Proyectos Table
// =============================================================================

/**
 * Investment projects table.
 *
 * Projects belong to a single fund and can have custom cascade/fee settings.
 */
export const proyectos = pgTable(
  'proyectos',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    /** Parent fund */
    fondoId: uuid('fondo_id')
      .notNull()
      .references(() => fondos.id),

    /** Project name */
    nombre: text('nombre').notNull(),

    /** Project description */
    descripcion: text('descripcion'),

    /** Project lifecycle state */
    estado: estadoProyectoEnum('estado').notNull().default('activo'),

    /** Cascade method override (null = inherit from fund) */
    metodoCascada: metodoCascadaEnum('metodo_cascada'),

    /** Success fee override (null = inherit from fund) */
    successFeePct: decimal('success_fee_pct', { precision: 5, scale: 2 }),

    // Cached financial fields
    /** Cached: Total capital invested in project */
    inversionRecibida: decimal('inversion_recibida', { precision: 18, scale: 2 }).default('0'),

    /** Cached: Total project expenses */
    gastos: decimal('gastos', { precision: 18, scale: 2 }).default('0'),

    /** Cached: Total returns from project */
    retornos: decimal('retornos', { precision: 18, scale: 2 }).default('0'),

    // Audit fields
    ...auditFields,
  },
  (table) => [index('proyectos_fondo_id_idx').on(table.fondoId)]
);

// =============================================================================
// Relations
// =============================================================================

export const proyectosRelations = relations(proyectos, ({ one, many }) => ({
  fondo: one(fondos, {
    fields: [proyectos.fondoId],
    references: [fondos.id],
  }),
  inversiones: many(inversiones),
}));

// =============================================================================
// Types
// =============================================================================

export type Proyecto = typeof proyectos.$inferSelect;
export type NewProyecto = typeof proyectos.$inferInsert;

// Forward declaration for relations
import { inversiones } from './inversiones';
