/**
 * Drizzle ORM Database Client
 *
 * Uses Neon Serverless driver with connection pooling.
 * Supports transactions via db.transaction().
 *
 * Requires DATABASE_URL environment variable.
 *
 * @see docs/AUTH_SETUP.md for configuration
 */

import { Pool } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

export type Database = NeonDatabase<typeof schema>;

/**
 * Check if database is configured
 * Re-exported from env.ts for convenience
 */
export { isDatabaseConfigured } from '@/lib/env';

/**
 * Database client instance.
 *
 * Note: Will be `null` during build time if DATABASE_URL is not set.
 * All database operations must check for null or use runtime-only code paths.
 *
 * Uses connection pooling for better performance and transaction support.
 */
export const db: Database = (() => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
      console.warn(
        'DATABASE_URL not set. Set it in .env.local for local dev or in Vercel for production.'
      );
    }

    // Return a proxy that throws helpful errors at runtime
    return new Proxy({} as Database, {
      get(_, prop) {
        if (prop === 'then' || prop === Symbol.toStringTag) {
          return undefined;
        }
        throw new Error(
          `Database not configured. Set DATABASE_URL in .env.local. ` +
            `See docs/AUTH_SETUP.md for instructions.`
        );
      },
    }) as Database;
  }

  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle(pool, { schema });
})();
