/**
 * Fondos Schema
 *
 * Investment funds that group projects and investors.
 * Each fund has its own cascade method and base currency.
 *
 * @see 05_DATA_MODEL.md#e-001-fondos
 * @see SCHEMA-001
 */

import { pgTable, text, uuid, decimal, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { monedaEnum, metodoCascadaEnum } from './enums';

// =============================================================================
// Fondos Table
// =============================================================================

/**
 * Investment funds table.
 *
 * Example: "Adi Capital", "Kentucky"
 */
export const fondos = pgTable('fondos', {
  /** Unique identifier (UUID v4) */
  id: uuid('id').primaryKey().defaultRandom(),

  /** Fund name */
  nombre: text('nombre').notNull(),

  /** URL-friendly identifier */
  slug: text('slug'),

  /** Base currency for the fund */
  monedaBase: monedaEnum('moneda_base').notNull().default('MXN'),

  /** Distribution cascade method */
  metodoCascada: metodoCascadaEnum('metodo_cascada').notNull().default('pref_primero'),

  /** Default success fee percentage for new investments */
  successFeeDefault: decimal('success_fee_default', { precision: 5, scale: 2 }).default('20'),

  /** Default preferred return rate (annual %) */
  prefRateDefault: decimal('pref_rate_default', { precision: 5, scale: 2 }).default('12'),

  /** Cached: Sum of partner contributions (APS - RPS) */
  capitalSocios: decimal('capital_socios', { precision: 18, scale: 2 }).default('0'),

  /** Whether the fund is active */
  activo: boolean('activo').default(true),

  // Audit fields
  ...auditFields,
});

// =============================================================================
// Relations
// =============================================================================

export const fondosRelations = relations(fondos, ({ many }) => ({
  proyectos: many(proyectos),
  inversionistasFondos: many(inversionistasFondos),
}));

// =============================================================================
// Types
// =============================================================================

export type Fondo = typeof fondos.$inferSelect;
export type NewFondo = typeof fondos.$inferInsert;

// Forward declarations for relations (imported at runtime)
import { proyectos } from './proyectos';
import { inversionistasFondos } from './inversionistas';
