/**
 * Inversiones Schema
 *
 * Investment participations linking investors to projects.
 * Contains commitment, fee configuration, and cached Pref calculations.
 *
 * @see 05_DATA_MODEL.md#e-004-inversiones
 * @see SCHEMA-001
 */

import { pgTable, text, uuid, decimal, index, unique, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { tipoAdminFeeEnum, baseAdminFeeEnum, metodoAdminFeeEnum } from './enums';
import { proyectos } from './proyectos';
import { inversionistas } from './inversionistas';

// =============================================================================
// Inversiones Table
// =============================================================================

/**
 * Investment participations table.
 *
 * Links an investor to a project with specific fee/pref configuration.
 */
export const inversiones = pgTable(
  'inversiones',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    /** Investor making the investment */
    inversionistaId: uuid('inversionista_id')
      .notNull()
      .references(() => inversionistas.id),

    /** Project being invested in */
    proyectoId: uuid('proyecto_id')
      .notNull()
      .references(() => proyectos.id),

    /** Committed capital amount */
    compromiso: decimal('compromiso', { precision: 18, scale: 2 }).notNull(),

    /** Preferred return rate override (null = inherit from fund) */
    prefRate: decimal('pref_rate', { precision: 5, scale: 2 }),

    /** Success fee override (null = inherit from project/fund) */
    successFeePct: decimal('success_fee_pct', { precision: 5, scale: 2 }),

    // =========================================================================
    // Admin Fee Configuration
    // =========================================================================

    /** Admin fee type: one_time or annual */
    adminFeeTipo: tipoAdminFeeEnum('admin_fee_tipo'),

    /** Admin fee base: compromiso or aportado */
    adminFeeBase: baseAdminFeeEnum('admin_fee_base'),

    /** Admin fee collection method */
    adminFeeMetodo: metodoAdminFeeEnum('admin_fee_metodo'),

    /** Admin fee percentage */
    adminFeePct: decimal('admin_fee_pct', { precision: 5, scale: 2 }),

    // =========================================================================
    // Cached/Calculated Fields
    // =========================================================================

    /** Cached: Total capital contributed (SUM APO - SUM DEV) */
    capitalAportado: decimal('capital_aportado', { precision: 18, scale: 2 }).default('0'),

    /** Cached: Accumulated preferred return (daily calculation) */
    prefAcumulado: decimal('pref_acumulado', { precision: 18, scale: 2 }).default('0'),

    /** Cached: Paid preferred return (SUM DIS to Pref) */
    prefPagado: decimal('pref_pagado', { precision: 18, scale: 2 }).default('0'),

    /** Date through which Pref has been calculated (cron job tracking) */
    prefAcumuladoHasta: timestamp('pref_acumulado_hasta', { mode: 'date', withTimezone: true }),

    /** Notes about this investment */
    notas: text('notas'),

    // Audit fields
    ...auditFields,
  },
  (table) => [
    unique('inversiones_unique').on(table.inversionistaId, table.proyectoId),
    index('inversiones_inversionista_id_idx').on(table.inversionistaId),
    index('inversiones_proyecto_id_idx').on(table.proyectoId),
  ]
);

// =============================================================================
// Relations
// =============================================================================

export const inversionesRelations = relations(inversiones, ({ one }) => ({
  inversionista: one(inversionistas, {
    fields: [inversiones.inversionistaId],
    references: [inversionistas.id],
  }),
  proyecto: one(proyectos, {
    fields: [inversiones.proyectoId],
    references: [proyectos.id],
  }),
}));

// =============================================================================
// Types
// =============================================================================

export type Inversion = typeof inversiones.$inferSelect;
export type NewInversion = typeof inversiones.$inferInsert;

// =============================================================================
// Computed Helpers
// =============================================================================

/**
 * Calculate pending Pref (not yet paid).
 */
export function getPrefPendiente(
  inversion: Pick<Inversion, 'prefAcumulado' | 'prefPagado'>
): number {
  const acumulado = Number(inversion.prefAcumulado) || 0;
  const pagado = Number(inversion.prefPagado) || 0;
  return acumulado - pagado;
}

/**
 * Calculate remaining commitment (not yet contributed).
 */
export function getSaldoCompromiso(
  inversion: Pick<Inversion, 'compromiso' | 'capitalAportado'>
): number {
  const compromiso = Number(inversion.compromiso) || 0;
  const aportado = Number(inversion.capitalAportado) || 0;
  return compromiso - aportado;
}
