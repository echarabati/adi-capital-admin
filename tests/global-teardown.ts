/**
 * Playwright Global Teardown
 *
 * Simple teardown - no longer deletes Neon branches.
 * For isolated E2E tests, use: pnpm test:e2e:isolated
 */

async function globalTeardown() {
  console.log('[E2E] Global teardown complete.');
}

export default globalTeardown;
