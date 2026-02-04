/**
 * Movimientos Schema
 *
 * Financial transactions with 18 movement types.
 * Core transactional entity linking funds, projects, investors, and investments.
 *
 * @see 05_DATA_MODEL.md#e-005-movimientos
 * @see SCHEMA-002
 */

import { pgTable, text, uuid, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { conceptoEnum, estadoMovimientoEnum, monedaEnum } from './enums';
import { fondos } from './fondos';
import { proyectos } from './proyectos';
import { inversionistas } from './inversionistas';
import { inversiones } from './inversiones';

// =============================================================================
// Movimientos Table
// =============================================================================

/**
 * Financial movements/transactions table.
 *
 * Supports 18 movement types across 5 categories:
 * - Inversionistas: APO, APO-D, DIS, DEV, FEE
 * - Proyectos: INV, INV-D, RET
 * - Gastos: GAS, GASP
 * - Socios: APS, RPS, PRS, DPRS
 * - Admin: TRA, CAM, ERR, TSI
 */
export const movimientos = pgTable(
  'movimientos',
  {
    /** Unique identifier (UUID v4) */
    id: uuid('id').primaryKey().defaultRandom(),

    // =========================================================================
    // Context References
    // =========================================================================

    /** Fund this movement belongs to (required) */
    fondoId: uuid('fondo_id')
      .notNull()
      .references(() => fondos.id),

    /** Project reference (optional, for project-related movements) */
    proyectoId: uuid('proyecto_id').references(() => proyectos.id),

    /** Investor reference (optional, for investor movements) */
    inversionistaId: uuid('inversionista_id').references(() => inversionistas.id),

    /** Investment reference (optional, for investment-specific movements) */
    inversionId: uuid('inversion_id').references(() => inversiones.id),

    /** Beneficiary reference (optional, for GAS/GASP movements) */
    beneficiarioId: uuid('beneficiario_id').references(() => beneficiarios.id),

    /** Bank account reference (optional) */
    cuentaId: uuid('cuenta_id').references(() => cuentasBancarias.id),

    // =========================================================================
    // Movement Data
    // =========================================================================

    /** Movement type (18 possible values) */
    concepto: conceptoEnum('concepto').notNull(),

    /** Amount in original currency */
    monto: decimal('monto', { precision: 18, scale: 2 }).notNull(),

    /** Currency of the movement */
    moneda: monedaEnum('moneda').notNull(),

    /** Exchange rate for conversion (if applicable) */
    tipoCambio: decimal('tipo_cambio', { precision: 10, scale: 4 }),

    /** Amount converted to USD (cached) */
    montoUsd: decimal('monto_usd', { precision: 18, scale: 2 }),

    // =========================================================================
    // State & Dates
    // =========================================================================

    /** Movement state: borrador → confirmado → cancelado */
    estado: estadoMovimientoEnum('estado').notNull().default('borrador'),

    /** Effective date of the movement */
    fechaMovimiento: timestamp('fecha_movimiento', { mode: 'date', withTimezone: true }).notNull(),

    /** When the movement was confirmed */
    fechaConfirmacion: timestamp('fecha_confirmacion', { mode: 'date', withTimezone: true }),

    // =========================================================================
    // Grouping & Metadata
    // =========================================================================

    /** UUID to group related movements (e.g., distribution creates multiple DIS + FEE) */
    grupoMovimiento: uuid('grupo_movimiento'),

    /** Description or notes */
    descripcion: text('descripcion'),

    /** Firebase sync tracking */
    sincronizadoFirebase: boolean('sincronizado_firebase').default(false),

    // Audit fields
    ...auditFields,
  },
  (table) => [
    index('movimientos_fondo_id_idx').on(table.fondoId),
    index('movimientos_proyecto_id_idx').on(table.proyectoId),
    index('movimientos_inversionista_id_idx').on(table.inversionistaId),
    index('movimientos_inversion_id_idx').on(table.inversionId),
    index('movimientos_concepto_idx').on(table.concepto),
    index('movimientos_estado_idx').on(table.estado),
    index('movimientos_fecha_idx').on(table.fechaMovimiento),
    index('movimientos_grupo_idx').on(table.grupoMovimiento),
  ]
);

// =============================================================================
// Relations
// =============================================================================

export const movimientosRelations = relations(movimientos, ({ one }) => ({
  fondo: one(fondos, {
    fields: [movimientos.fondoId],
    references: [fondos.id],
  }),
  proyecto: one(proyectos, {
    fields: [movimientos.proyectoId],
    references: [proyectos.id],
  }),
  inversionista: one(inversionistas, {
    fields: [movimientos.inversionistaId],
    references: [inversionistas.id],
  }),
  inversion: one(inversiones, {
    fields: [movimientos.inversionId],
    references: [inversiones.id],
  }),
  beneficiario: one(beneficiarios, {
    fields: [movimientos.beneficiarioId],
    references: [beneficiarios.id],
  }),
  cuenta: one(cuentasBancarias, {
    fields: [movimientos.cuentaId],
    references: [cuentasBancarias.id],
  }),
}));

// =============================================================================
// Types
// =============================================================================

export type Movimiento = typeof movimientos.$inferSelect;
export type NewMovimiento = typeof movimientos.$inferInsert;

// Forward declarations for FK references
import { beneficiarios } from './beneficiarios';
import { cuentasBancarias } from './cuentas-bancarias';
