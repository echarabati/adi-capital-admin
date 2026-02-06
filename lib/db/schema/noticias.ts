/**
 * Noticias Schema
 *
 * News/announcements for funds. Can be fund-specific or general (visible to all).
 *
 * @see NEWS-001
 */

import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { auditFields } from '@/lib/db/helpers/audit-fields';
import { estadoNoticiaEnum } from './enums';
import { fondos } from './fondos';

// =============================================================================
// Noticias Table
// =============================================================================

/**
 * News/announcements table.
 *
 * - fondoId = NULL → General news, visible to all funds
 * - fondoId = UUID → Fund-specific news, only visible to that fund
 */
export const noticias = pgTable('noticias', {
  /** Unique identifier (UUID v4) */
  id: uuid('id').primaryKey().defaultRandom(),

  /** News title */
  titulo: text('titulo').notNull(),

  /** News content (can be markdown or HTML) */
  contenido: text('contenido').notNull(),

  /** Optional image URL */
  imagenUrl: text('imagen_url'),

  /** Publication state */
  estado: estadoNoticiaEnum('estado').notNull().default('borrador'),

  /**
   * Target fund (optional)
   * NULL = General news (visible to all funds)
   * UUID = Fund-specific news
   */
  fondoId: uuid('fondo_id').references(() => fondos.id, { onDelete: 'cascade' }),

  /** Publication timestamp (set when estado changes to 'publicado') */
  publicadoAt: timestamp('publicado_at', { withTimezone: true }),

  // Audit fields
  ...auditFields,
});

// =============================================================================
// Relations
// =============================================================================

export const noticiasRelations = relations(noticias, ({ one }) => ({
  fondo: one(fondos, {
    fields: [noticias.fondoId],
    references: [fondos.id],
  }),
}));

// =============================================================================
// Types
// =============================================================================

export type Noticia = typeof noticias.$inferSelect;
export type NewNoticia = typeof noticias.$inferInsert;
