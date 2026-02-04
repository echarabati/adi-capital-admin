/**
 * Playwright Global Setup
 *
 * Simple setup - no longer creates Neon branches.
 * For isolated E2E tests, use: pnpm test:e2e:isolated
 */

async function globalSetup() {
  console.log('[E2E] Global setup complete.');
}

export default globalSetup;
