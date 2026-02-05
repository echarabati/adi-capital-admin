/**
 * Proyectos Schema
 *
 * Investment projects within a fund.
 * Inherits cascade method from fund or can override.
 *
 * @see 05_DATA_MODEL.md#e-002-proyectos
 * @see SCHEMA-001
 */

import { pgTable, text, uuid, decimal, index, unique, timestamp } from 'drizzle-orm/pg-core';
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

    /** Project code (unique within fund, e.g. PRJ-001) */
    codigo: text('codigo').notNull(),

    /** URL-friendly identifier */
    slug: text('slug'),

    /** Project name */
    nombre: text('nombre').notNull(),

    /** Project description */
    descripcion: text('descripcion'),

    /** Project lifecycle state */
    estado: estadoProyectoEnum('estado').notNull().default('inversion_abierta'),

    /** Preferred return rate (annual %) */
    tasaPref: decimal('tasa_pref', { precision: 5, scale: 2 }).notNull().default('12.00'),

    /** Cascade method override (null = inherit from fund) */
    metodoCascada: metodoCascadaEnum('metodo_cascada'),

    /** Success fee override (null = inherit from fund) */
    successFeePct: decimal('success_fee_pct', { precision: 5, scale: 2 }),

    /** Project start date */
    fechaInicio: timestamp('fecha_inicio', { withTimezone: true }),

    /** Expected project end date */
    fechaTerminacion: timestamp('fecha_terminacion', { withTimezone: true }),

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
  (table) => [
    index('proyectos_fondo_id_idx').on(table.fondoId),
    unique('proyectos_fondo_codigo_unique').on(table.fondoId, table.codigo),
  ]
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
