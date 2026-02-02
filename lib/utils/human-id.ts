/**
 * Human ID Generator
 *
 * Generates human-readable IDs for records that coexist with UUIDs.
 * Use this when users need to reference, communicate, or remember record IDs.
 *
 * @example
 * ```typescript
 * import { generateHumanId } from '@/lib/utils/human-id';
 *
 * // With year (default)
 * generateHumanId(42, { prefix: 'ORD' })     // → 'ORD-2026-0042'
 * generateHumanId(1, { prefix: 'INV' })       // → 'INV-2026-0001'
 *
 * // Without year
 * generateHumanId(1, { prefix: 'USR', includeYear: false })  // → 'USR-0001'
 *
 * // Custom padding
 * generateHumanId(1, { prefix: 'T', padLength: 6 })  // → 'T-2026-000001'
 * ```
 *
 * ## Schema Pattern
 *
 * ```typescript
 * export const orders = pgTable('orders', {
 *   // Technical ID (PK, joins, indexes)
 *   id: uuid('id').primaryKey().defaultRandom(),
 *
 *   // Human ID (display, URLs, breadcrumbs)
 *   orderNumber: text('order_number').notNull().unique(),
 * });
 * ```
 *
 * ## ⚠️ IMPORTANT LIMITATION
 *
 * This is an **application-level helper only**. The sequence number must be
 * provided by the caller — there is NO database sequence integration.
 *
 * **What this means:**
 * - You must calculate the sequence yourself (e.g., `SELECT COUNT(*) + 1`)
 * - In high-concurrency scenarios, this can cause collisions
 * - Gaps may occur if inserts fail after getting the sequence
 *
 * **If you need database-level sequences:**
 * You will need to implement custom solutions in your project, such as:
 * - PostgreSQL SEQUENCE (e.g., `CREATE SEQUENCE order_seq`)
 * - Database function that generates the human ID atomically
 * - Optimistic locking with retry on collision
 *
 * @see SCHEMA-003
 */

export type HumanIdOptions = {
  /** Prefix for the ID (e.g., 'ORD', 'USR', 'INV') */
  prefix: string;
  /** Include year in the format? Default: true */
  includeYear?: boolean;
  /** Padding length for sequence number. Default: 4 */
  padLength?: number;
};

/**
 * Generate a human-readable ID from a sequence number.
 *
 * @param sequence - The sequence number (must be positive integer)
 * @param options - Configuration for the ID format
 * @returns Human-readable ID string
 *
 * @example
 * ```typescript
 * // Getting sequence from count
 * const count = await db.select({ count: sql`count(*)` }).from(orders);
 * const humanId = generateHumanId(count[0].count + 1, { prefix: 'ORD' });
 *
 * await db.insert(orders).values({
 *   orderNumber: humanId,
 *   // ...
 * });
 * ```
 */
export function generateHumanId(sequence: number, options: HumanIdOptions): string {
  const { prefix, includeYear = true, padLength = 4 } = options;

  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error('Sequence must be a positive integer');
  }

  if (!prefix || prefix.length === 0) {
    throw new Error('Prefix is required');
  }

  const paddedSeq = String(sequence).padStart(padLength, '0');

  if (includeYear) {
    const year = new Date().getFullYear();
    return `${prefix}-${year}-${paddedSeq}`;
  }

  return `${prefix}-${paddedSeq}`;
}

/**
 * Common prefixes used in the starter kit.
 * Extend this in your project as needed.
 */
export const HUMAN_ID_PREFIXES = {
  USER: 'USR',
  ORDER: 'ORD',
  INVOICE: 'INV',
  TICKET: 'TKT',
} as const;
