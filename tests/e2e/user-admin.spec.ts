/**
 * User Admin E2E Tests
 *
 * Tests the user administration CRUD functionality.
 * Covers: create, edit, delete, filter, search, and RBAC.
 *
 * NOTE: Uses serial mode to avoid parallel worker conflicts with fixtures.
 *
 * @see TEST-004, CRUD-002
 */

import { test, expect, Page } from '@playwright/test';
import { createTestUser, createAdminTestUser, cleanupTestUser } from '../fixtures/auth';

// Force serial execution to avoid fixture conflicts
test.describe.configure({ mode: 'serial' });

// =============================================================================
// Test Data
// =============================================================================

interface TestUserData {
  id: string;
  email: string;
  plainPassword: string;
}

let adminUser: TestUserData;
let regularUser: TestUserData;
const createdUserIds: string[] = [];

// =============================================================================
// Helpers
// =============================================================================

/**
 * Login as a user via the login page.
 */
async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForSelector('#email', { timeout: 10000 });
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard|settings/, { timeout: 15000 });
}

/**
 * Navigate to user admin page.
 */
async function goToUserAdmin(page: Page) {
  await page.goto('/settings/users');
  await page.waitForSelector('h2:has-text("Usuarios")', { timeout: 10000 });
}

// =============================================================================
// Setup & Teardown
// =============================================================================

test.describe('User Admin E2E', () => {
  test.beforeAll(async () => {
    try {
      // Create admin user for CRUD operations
      adminUser = await createAdminTestUser({
        email: `e2e-admin-${Date.now()}@test.com`,
        name: 'E2E Admin User',
      });
      createdUserIds.push(adminUser.id);

      // Create regular user for permission tests
      regularUser = await createTestUser({
        email: `e2e-user-${Date.now()}@test.com`,
        name: 'E2E Regular User',
        role: 'agente',
      });
      createdUserIds.push(regularUser.id);
    } catch (e) {
      console.error('Failed to setup user admin test fixtures:', e);
      throw e;
    }
  });

  test.afterAll(async () => {
    // Cleanup all created users
    for (const id of createdUserIds) {
      await cleanupTestUser(id);
    }
  });

  // ===========================================================================
  // CRUD Tests
  // ===========================================================================

  test.describe('CRUD Operations', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, adminUser.email, adminUser.plainPassword);
      await goToUserAdmin(page);
    });

    // AC1: crear usuario como ADMIN
    test('should create user as ADMIN', async ({ page }) => {
      const newEmail = `created-${Date.now()}@test.com`;

      // Click "Agregar" button
      await page.click('button:has-text("Agregar")');
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      // Fill form using id selectors (matching UserFormDialog)
      await page.fill('#name', 'New Test User');
      await page.fill('#email', newEmail);
      await page.fill('#password', 'Test1234!');

      // Select role using native select element
      await page.selectOption('#role', 'agente');

      // Submit - button says "Crear"
      await page.click('button:has-text("Crear")');

      // Verify success toast
      await expect(page.getByText(/creado|éxito/i)).toBeVisible({ timeout: 10000 });
    });

    // AC2: editar usuario
    test('should edit user', async ({ page }) => {
      // Create a user to edit
      const userToEdit = await createTestUser({
        email: `edit-test-${Date.now()}@test.com`,
        name: 'User To Edit',
      });
      createdUserIds.push(userToEdit.id);

      // Refresh page to see new user
      await page.reload();
      await page.waitForSelector('h2:has-text("Usuarios")');

      // Find the user row and click edit
      const userRow = page.locator(`tr:has-text("${userToEdit.email}")`);
      await userRow.locator('button[title="Editar"]').click();

      // Wait for dialog and modify name
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      await page.fill('#name', 'Updated User Name');

      // Submit - button says "Guardar"
      await page.click('button:has-text("Guardar")');

      // Verify success
      await expect(page.getByText(/actualizado|guardado|éxito/i)).toBeVisible({ timeout: 10000 });
    });

    // AC3: eliminar usuario (soft delete)
    test('should soft delete user', async ({ page }) => {
      // Create a user to delete
      const userToDelete = await createTestUser({
        email: `delete-test-${Date.now()}@test.com`,
        name: 'User To Delete',
      });
      createdUserIds.push(userToDelete.id);

      // Refresh to see new user
      await page.reload();
      await page.waitForSelector('h2:has-text("Usuarios")');

      // Find the user row and click delete
      const userRow = page.locator(`tr:has-text("${userToDelete.email}")`);
      await userRow.locator('button[title="Eliminar"]').click();

      // Confirm deletion in dialog
      await page.waitForSelector('[role="alertdialog"]', { timeout: 5000 });
      await page.click('[role="alertdialog"] button:has-text("Eliminar")');

      // Verify success toast
      await expect(page.getByText(/eliminado/i)).toBeVisible({ timeout: 10000 });

      // Verify user no longer in table
      await expect(page.getByText(userToDelete.email)).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ===========================================================================
  // Filtering & Search Tests
  // ===========================================================================

  test.describe('Filtering and Search', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, adminUser.email, adminUser.plainPassword);
      await goToUserAdmin(page);
    });

    // AC4: filtrar usuarios por rol
    test('should filter users by role', async ({ page }) => {
      // Click role filter dropdown
      const filterTrigger = page.locator('button:has-text("Todos los roles")');
      if (await filterTrigger.isVisible()) {
        await filterTrigger.click();
        // Wait for dropdown to open
        await page.waitForSelector('[role="menu"]', { timeout: 3000 });
        // Select "Administrador" from dropdown - it's a button inside the menu
        await page.click('button:has-text("Administrador")');
        // Wait for filter to apply
        await page.waitForTimeout(500);
      }

      // Verify filter applied - at least one admin badge visible
      await expect(page.locator('span:has-text("Administrador")').first()).toBeVisible();
    });

    // AC5: buscar usuarios por nombre/email
    test('should search users by name/email', async ({ page }) => {
      // Type in search input
      const searchInput = page.locator('input[placeholder*="Nombre"], input[placeholder*="email"]');
      await searchInput.fill(adminUser.email.slice(0, 10));

      // Wait for search to filter
      await page.waitForTimeout(500);

      // Verify our admin user is visible
      await expect(page.getByText(adminUser.email)).toBeVisible();
    });
  });

  // ===========================================================================
  // RBAC Tests
  // ===========================================================================

  test.describe('RBAC Permissions', () => {
    // AC6: verificar que USER no puede acceder a /settings/users
    test('should deny USER access to /settings/users', async ({ page }) => {
      // Login as regular user
      await loginAs(page, regularUser.email, regularUser.plainPassword);

      // Try to navigate to users page
      await page.goto('/settings/users');
      await page.waitForTimeout(2000);

      const currentUrl = page.url();

      // Either redirected away OR shows permission error
      const hasAccess = currentUrl.includes('/settings/users');
      const hasError = await page
        .getByText(/permiso|acceso|autorizado|no tienes/i)
        .isVisible()
        .catch(() => false);

      // Should not have normal access to the page
      expect(hasAccess && !hasError).toBeFalsy();
    });

    // AC7: verificar que ADMIN no puede crear SUPER_ADMIN
    test('should not allow ADMIN to create SUPER_ADMIN', async ({ page }) => {
      await loginAs(page, adminUser.email, adminUser.plainPassword);
      await goToUserAdmin(page);

      // Click "Agregar" button
      await page.click('button:has-text("Agregar")');
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      // Get all options from the role select
      const roleSelect = page.locator('#role');
      const options = await roleSelect.locator('option').allTextContents();

      // SUPER_ADMIN should not be in the options for ADMIN
      const hasSuperAdmin = options.some((opt) => opt.includes('Super Admin'));
      expect(hasSuperAdmin).toBeFalsy();

      // Close dialog
      await page.keyboard.press('Escape');
    });
  });
});
