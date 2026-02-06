/**
 * Shared Enums
 *
 * PostgreSQL enums used across multiple domain schemas.
 * Centralized here to avoid circular imports and ensure consistency.
 *
 * @see 05_DATA_MODEL.md
 * @see SCHEMA-001
 */

import { pgEnum } from 'drizzle-orm/pg-core';

// =============================================================================
// Financial Enums
// =============================================================================

/** Supported currencies for funds and transactions */
export const monedaEnum = pgEnum('moneda', ['MXN', 'USD', 'EUR', 'ILS']);

/** Distribution cascade method for fund payouts */
export const metodoCascadaEnum = pgEnum('metodo_cascada', ['pref_primero', 'capital_primero']);

// =============================================================================
// Project Enums
// =============================================================================

/** Project lifecycle states */
export const estadoProyectoEnum = pgEnum('estado_proyecto', [
  'inversion_abierta',
  'inversion_cerrada',
  'concluido',
]);

// =============================================================================
// Admin Fee Enums
// =============================================================================

/** When the admin fee is charged */
export const tipoAdminFeeEnum = pgEnum('tipo_admin_fee', ['one_time', 'anual']);

/** Base amount for calculating admin fee */
export const baseAdminFeeEnum = pgEnum('base_admin_fee', ['compromiso', 'aportado']);

/** How the admin fee is collected */
export const metodoAdminFeeEnum = pgEnum('metodo_admin_fee', [
  'capital_call_independiente',
  'incluido_en_capital_call',
]);

// =============================================================================
// Transaction Enums (SCHEMA-002)
// =============================================================================

/**
 * Movement concept types (18 total).
 * Each category represents different financial operations.
 */
export const conceptoEnum = pgEnum('concepto', [
  // Inversionistas (5)
  'APO', // Aportación
  'APO-D', // Aportación Destiempo
  'DIS', // Distribución
  'DEV', // Devolución
  'FEE', // Success Fee
  // Proyectos (3)
  'INV', // Inversión
  'INV-D', // Desinversión
  'RET', // Retorno
  // Gastos (2)
  'GAS', // Gasto Administrativo
  'GASP', // Gasto de Proyecto
  // Socios (4)
  'APS', // Aportación Socio
  'RPS', // Retiro Socio
  'PRS', // Préstamo Socio
  'DPRS', // Devolución Préstamo Socio
  // Admin (4)
  'TRA', // Traspaso
  'CAM', // Cambio (moneda)
  'ERR', // Error/Corrección
  'TSI', // Tipo de Cambio (ajuste)
]);

/** Movement lifecycle states */
export const estadoMovimientoEnum = pgEnum('estado_movimiento', [
  'borrador',
  'confirmado',
  'cancelado',
]);

/** Distribution destination for DIS movements */
export const destinoEnum = pgEnum('destino', ['a_pref', 'a_capital', 'a_utilidad']);

/** Capital call payment states */
export const estadoCallEnum = pgEnum('estado_call', ['pendiente', 'parcial', 'completo']);

// =============================================================================
// User Enums (SCHEMA-003)
// =============================================================================

/**
 * User roles for RBAC.
 * @see 04_BUSINESS_RULES.md BR-050→071
 */
export const rolUsuarioEnum = pgEnum('rol_usuario', [
  'super_admin', // Full access to all funds
  'admin_fondo', // Access to assigned funds only
  'agente', // Limited access (Post-MVP)
]);

// =============================================================================
// News Enums (NEWS-001)
// =============================================================================

/** News publication states */
export const estadoNoticiaEnum = pgEnum('estado_noticia', ['borrador', 'publicado']);
