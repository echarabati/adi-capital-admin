// ⚠️ CRITICAL: Load env vars FIRST, before any other imports
// This must be at the very top so DATABASE_URL is available when drizzle.ts loads
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Database Seed Orchestrator
 *
 * Runs all seed functions in the correct order.
 * Run with: pnpm db:seed
 *
 * @example
 * ```bash
 * # Full seed (all functions)
 * pnpm db:seed
 *
 * # Admin only (standalone)
 * pnpm db:seed:admin
 * ```
 *
 * ## Seed Order
 *
 * 1. Admin — Creates the superadmin user (required for audit fields)
 * 2. (Add more seeds here as needed)
 *
 * ## Idempotency
 *
 * All seeds are idempotent — safe to run multiple times.
 */

import { seedAdmin } from './seeds';

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // 1. Admin seed (required first for audit field references)
  await seedAdmin();

  // 2. Add more seeds here as needed:
  // await seedDemoData();
  // await seedTestUsers();

  console.log('\n✅ All seeds complete');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
