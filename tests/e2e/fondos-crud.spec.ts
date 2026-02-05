/**
 * Fondos CRUD E2E Tests
 *
 * Tests end-to-end CRUD operations for Fondos (Funds).
 * - Create a new fondo via dialog form
 * - Edit an existing fondo
 * - Navigate to fondo detail with tabs
 * - Navigate to sub-resources (cuentas, beneficiarios)
 *
 * @see TEST-004
 */

import { test, expect, Page } from '@playwright/test';
import { createTestUser, cleanupTestUser } from '../fixtures/auth';
import { db } from '@/lib/db/drizzle';
import { fondos, userFondos, cuentasBancarias, beneficiarios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

interface TestFondoData {
  id: string;
  nombre: string;
}

let superAdmin: TestUserData;
let createdFondoId: string | null = null;

// =============================================================================
// Helpers
// =============================================================================

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForSelector('#email', { timeout: 10000 });
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard|fondos/, { timeout: 15000 });
}

async function createTestFondo(nombre: string, createdBy: string): Promise<TestFondoData> {
  const [fondo] = await db
    .insert(fondos)
    .values({
      nombre,
      monedaBase: 'MXN',
      metodoCascada: 'pref_primero',
      createdBy,
      modifiedBy: createdBy,
    })
    .returning({ id: fondos.id, nombre: fondos.nombre });
  return fondo;
}

async function cleanupTestFondo(fondoId: string) {
  if (!fondoId) return;
  try {
    // Delete related records first
    await db.delete(beneficiarios).where(eq(beneficiarios.fondoId, fondoId));
    await db.delete(cuentasBancarias).where(eq(cuentasBancarias.fondoId, fondoId));
    await db.delete(userFondos).where(eq(userFondos.fondoId, fondoId));
    await db.delete(fondos).where(eq(fondos.id, fondoId));
  } catch (error) {
    console.error(`Failed to cleanup test fondo ${fondoId}:`, error);
  }
}

// =============================================================================
// Setup & Teardown
// =============================================================================

test.describe('Fondos CRUD E2E', () => {
  test.beforeAll(async () => {
    // Create Super Admin for all tests
    superAdmin = await createTestUser({
      email: `e2e-fondos-crud-${Date.now()}@test.com`,
      name: 'E2E Fondos CRUD Admin',
      role: 'super_admin',
    });
  });

  test.afterAll(async () => {
    // Cleanup created fondo if exists
    if (createdFondoId) await cleanupTestFondo(createdFondoId);
    if (superAdmin?.id) await cleanupTestUser(superAdmin.id);
  });

  // ===========================================================================
  // Tests
  // ===========================================================================

  test('should create a new fondo via dialog form', async ({ page }) => {
    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto('/fondos');
    await page.waitForLoadState('networkidle');

    // Click "Nuevo Fondo" button
    const newFondoButton = page.getByRole('button', { name: /nuevo fondo/i });
    await expect(newFondoButton).toBeVisible({ timeout: 10000 });
    await newFondoButton.click();

    // Wait for dialog to open
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Fill the form
    const fondoName = `Test Fondo E2E ${Date.now()}`;
    await page.fill('input[name="nombre"]', fondoName);

    // Select moneda base if dropdown exists
    const monedaSelect = page.locator('select[name="monedaBase"], [data-testid="moneda-select"]');
    if (await monedaSelect.isVisible()) {
      await monedaSelect.selectOption('MXN');
    }

    // Submit the form
    const submitButton = page.getByRole('button', { name: /guardar|crear|submit/i });
    await submitButton.click();

    // Wait for dialog to close
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });

    // Wait for the new fondo to appear in the table (with polling for revalidation)
    await page.waitForSelector('table', { timeout: 10000 });
    await expect
      .poll(
        async () => {
          const table = page.locator('table');
          const content = await table.textContent();
          return content?.includes(fondoName);
        },
        { timeout: 15000, message: `Fondo "${fondoName}" should appear in table` }
      )
      .toBe(true);

    // Get created fondo ID from DB for subsequent tests
    const [created] = await db
      .select({ id: fondos.id })
      .from(fondos)
      .where(eq(fondos.nombre, fondoName))
      .limit(1);
    createdFondoId = created?.id || null;
  });

  test('should navigate to fondo detail page', async ({ page }) => {
    // Skip if no fondo was created
    test.skip(!createdFondoId, 'No fondo created in previous test');

    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto(`/fondos/${createdFondoId}`);
    await page.waitForLoadState('networkidle');

    // Should see the fondo detail page with heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to beneficiarios tab', async ({ page }) => {
    test.skip(!createdFondoId, 'No fondo created');

    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto(`/fondos/${createdFondoId}/beneficiarios`);
    await page.waitForLoadState('networkidle');

    // Should see beneficiarios page
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toMatch(/beneficiari|nuevo|agregar/i);
  });

  test('should navigate to cuentas bancarias tab', async ({ page }) => {
    test.skip(!createdFondoId, 'No fondo created');

    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto(`/fondos/${createdFondoId}/cuentas`);
    await page.waitForLoadState('networkidle');

    // Should see cuentas page
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toMatch(/cuenta|bancari|nuevo|agregar/i);
  });

  test('should edit an existing fondo', async ({ page }) => {
    // Create a test fondo for editing
    const testFondo = await createTestFondo(`Edit Test ${Date.now()}`, superAdmin.id);

    try {
      await loginAs(page, superAdmin.email, superAdmin.plainPassword);
      await page.goto('/fondos');
      await page.waitForLoadState('networkidle');

      // Find the fondo row and click edit button
      const fondoRow = page.getByRole('row').filter({ hasText: testFondo.nombre });
      const editButton = fondoRow.getByRole('button', { name: /editar|edit/i });

      if (await editButton.isVisible()) {
        await editButton.click();
      } else {
        // Try dropdown menu
        const menuButton = fondoRow.getByRole('button').last();
        await menuButton.click();
        await page.getByRole('menuitem', { name: /editar|edit/i }).click();
      }

      // Wait for dialog
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      // Modify the name
      const newName = `${testFondo.nombre} - Modified`;
      await page.fill('input[name="nombre"]', newName);

      // Submit
      const submitButton = page.getByRole('button', { name: /guardar|actualizar|save/i });
      await submitButton.click();

      // Wait for dialog to close
      await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });

      // Verify the modification with polling (wait for revalidation)
      await expect
        .poll(
          async () => {
            const table = page.locator('table');
            const content = await table.textContent();
            return content?.includes('Modified');
          },
          { timeout: 15000, message: 'Modified fondo name should appear in table' }
        )
        .toBe(true);
    } finally {
      await cleanupTestFondo(testFondo.id);
    }
  });
});
