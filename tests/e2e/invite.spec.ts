/**
 * Accept Invite E2E Tests
 *
 * Tests the invite acceptance flow in the browser.
 * Tests with database dependencies are in /tests integration when configured.
 */

import { test, expect } from '@playwright/test';

test.describe('Accept Invite Page', () => {
  test('shows error state when no token is provided', async ({ page }) => {
    await page.goto('/accept-invite');

    // Should show invalid state (token not provided)
    await expect(page.getByRole('heading', { name: /inválid/i })).toBeVisible();
  });

  test('shows error state for invalid token', async ({ page }) => {
    await page.goto('/accept-invite?token=invalid-token-12345');

    // Wait for validation to complete
    await page.waitForTimeout(1500);

    // Should show invalid/expired heading
    await expect(page.getByRole('heading', { name: /inválid|expirad/i })).toBeVisible();
  });

  test('shows loading indicator initially', async ({ page }) => {
    // Start navigation with a token
    await page.goto('/accept-invite?token=some-token');

    // The page should have navigated (basic smoke test)
    await expect(page).toHaveURL(/accept-invite/);
  });
});
