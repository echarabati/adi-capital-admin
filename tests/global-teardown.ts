/**
 * Playwright Global Teardown
 *
 * Simple teardown for E2E tests.
 * Branch cleanup is handled by scripts/e2e-isolated.ts
 */

async function globalTeardown() {
  console.log('[E2E] Global teardown complete.');
}

export default globalTeardown;
