/**
 * Auth E2E Tests
 *
 * Tests authentication flows: login, logout, failed login, session persistence.
 *
 * @see TEST-001
 */

import { test, expect, Page } from '@playwright/test';
import { createTestUser, cleanupTestUser } from '../fixtures/auth';

// Force serial execution
test.describe.configure({ mode: 'serial' });

// =============================================================================
// Test Data
// =============================================================================

interface TestUserData {
  id: string;
  email: string;
  plainPassword: string;
}

let testUser: TestUserData;

// =============================================================================
// Helpers
// =============================================================================

/**
 * Attempt login with given credentials.
 */
async function attemptLogin(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForSelector('#email', { timeout: 10000 });
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
}

// =============================================================================
// Setup & Teardown
// =============================================================================

test.describe('Auth E2E', () => {
  test.beforeAll(async () => {
    // Create test user
    testUser = await createTestUser({
      email: `e2e-auth-${Date.now()}@test.com`,
      name: 'E2E Auth User',
      role: 'agente',
    });
  });

  test.afterAll(async () => {
    if (testUser?.id) {
      await cleanupTestUser(testUser.id);
    }
  });

  // ===========================================================================
  // Tests
  // ===========================================================================

  test('should login with valid credentials', async ({ page }) => {
    await attemptLogin(page, testUser.email, testUser.plainPassword);

    // Should redirect to dashboard
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await attemptLogin(page, testUser.email, 'WrongPassword123!');

    // Should stay on login page and show error
    await page.waitForSelector('text=/inválid|incorrect|error/i', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await attemptLogin(page, testUser.email, testUser.plainPassword);
    await page.waitForURL(/dashboard/, { timeout: 15000 });

    // Click logout via user menu or sidebar
    // Look for logout button/link
    const logoutButton = page.locator(
      'button:has-text("Cerrar sesión"), a:has-text("Cerrar sesión"), [data-testid="logout"]'
    );

    if ((await logoutButton.count()) > 0) {
      await logoutButton.first().click();
    } else {
      // Try via URL
      await page.goto('/api/auth/signout');
      const confirmButton = page.locator('button[type="submit"]');
      if ((await confirmButton.count()) > 0) {
        await confirmButton.click();
      }
    }

    // Should be redirected to login
    await page.waitForURL(/login/, { timeout: 15000 });
    expect(page.url()).toContain('/login');
  });

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await attemptLogin(page, testUser.email, testUser.plainPassword);
    await page.waitForURL(/dashboard/, { timeout: 15000 });

    // Reload page
    await page.reload();

    // Should still be on dashboard (session persisted)
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Clear cookies to ensure unauthenticated state
    await page.context().clearCookies();

    // Try to access protected route
    await page.goto('/dashboard');

    // Should redirect to login
    await page.waitForURL(/login/, { timeout: 15000 });
    expect(page.url()).toContain('/login');
  });
});
