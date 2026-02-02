/**
 * Playwright Global Setup
 *
 * Simple setup for E2E tests.
 * Tests use the main database and clean up after themselves.
 *
 * Note: For better isolation, consider Neon Branching in the future.
 * See: PARK-xxx for Neon branching implementation.
 */

async function globalSetup() {
  const hasDatabase = !!process.env.DATABASE_URL;

  if (!hasDatabase) {
    console.warn('[E2E] No DATABASE_URL set, some tests may be skipped');
    return;
  }

  console.warn('[E2E] Global setup complete. Using main database.');
}

export default globalSetup;
