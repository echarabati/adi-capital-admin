/**
 * Proyectos CRUD E2E Tests
 *
 * Tests end-to-end CRUD operations for Proyectos (Projects) nested under Fondos.
 * - Navigate to proyectos list within a fondo
 * - Create a new proyecto via dialog form
 * - Edit an existing proyecto
 * - Navigate to proyecto detail with tabs (inversiones, movimientos, documentos)
 *
 * @see TEST-004
 */

import { test, expect, Page } from '@playwright/test';
import { createTestUser, cleanupTestUser } from '../fixtures/auth';
import { db } from '@/lib/db/drizzle';
import { fondos, proyectos, userFondos } from '@/lib/db/schema';
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

interface TestProyectoData {
  id: string;
  nombre: string;
}

let superAdmin: TestUserData;
let testFondo: TestFondoData;
let createdProyectoId: string | null = null;

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

async function createTestProyecto(
  nombre: string,
  fondoId: string,
  createdBy: string
): Promise<TestProyectoData> {
  const [proyecto] = await db
    .insert(proyectos)
    .values({
      nombre,
      fondoId,
      codigo: `PRJ-${Date.now()}`,
      createdBy,
      modifiedBy: createdBy,
    })
    .returning({ id: proyectos.id, nombre: proyectos.nombre });
  return proyecto;
}

async function cleanupTestProyecto(proyectoId: string) {
  if (!proyectoId) return;
  try {
    await db.delete(proyectos).where(eq(proyectos.id, proyectoId));
  } catch (error) {
    console.error(`Failed to cleanup test proyecto ${proyectoId}:`, error);
  }
}

async function cleanupTestFondo(fondoId: string) {
  if (!fondoId) return;
  try {
    // Delete proyectos first (FK constraint)
    await db.delete(proyectos).where(eq(proyectos.fondoId, fondoId));
    await db.delete(userFondos).where(eq(userFondos.fondoId, fondoId));
    await db.delete(fondos).where(eq(fondos.id, fondoId));
  } catch (error) {
    console.error(`Failed to cleanup test fondo ${fondoId}:`, error);
  }
}

// =============================================================================
// Setup & Teardown
// =============================================================================

test.describe('Proyectos CRUD E2E', () => {
  test.beforeAll(async () => {
    // Create Super Admin
    superAdmin = await createTestUser({
      email: `e2e-proyectos-crud-${Date.now()}@test.com`,
      name: 'E2E Proyectos CRUD Admin',
      role: 'super_admin',
    });

    // Create a test fondo to contain proyectos
    testFondo = await createTestFondo(`Fondo for Proyectos E2E ${Date.now()}`, superAdmin.id);
  });

  test.afterAll(async () => {
    // Cleanup created proyecto if exists
    if (createdProyectoId) await cleanupTestProyecto(createdProyectoId);
    if (testFondo?.id) await cleanupTestFondo(testFondo.id);
    if (superAdmin?.id) await cleanupTestUser(superAdmin.id);
  });

  // ===========================================================================
  // Tests
  // ===========================================================================

  test('should navigate to proyectos list within a fondo', async ({ page }) => {
    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto(`/fondos/${testFondo.id}/proyectos`);
    await page.waitForLoadState('networkidle');

    // Should see the proyectos page (may be empty)
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toMatch(/proyecto|nuevo|agregar|no hay/i);
  });

  test('should create a new proyecto via dialog form', async ({ page }) => {
    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto(`/fondos/${testFondo.id}/proyectos`);
    await page.waitForLoadState('networkidle');

    // Click "Nuevo Proyecto" button
    const newProyectoButton = page.getByRole('button', { name: /nuevo proyecto/i });
    await expect(newProyectoButton).toBeVisible({ timeout: 10000 });
    await newProyectoButton.click();

    // Wait for dialog to open
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Fill the form
    const proyectoName = `Test Proyecto E2E ${Date.now()}`;
    await page.fill('input[name="nombre"]', proyectoName);

    // Fill codigo if visible
    const codigoInput = page.locator('input[name="codigo"]');
    if (await codigoInput.isVisible()) {
      await codigoInput.fill(`PRJ-E2E-${Date.now()}`);
    }

    // Fill tasa pref if visible
    const tasaInput = page.locator('input[name="tasaPref"]');
    if (await tasaInput.isVisible()) {
      await tasaInput.fill('8.00');
    }

    // Submit the form
    const submitButton = page.getByRole('button', { name: /guardar|crear|submit/i });
    await submitButton.click();

    // Wait for dialog to close and table to update
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });

    // Verify the new proyecto appears in the table
    await page.waitForSelector('table', { timeout: 10000 });
    const tableContent = await page.textContent('table');
    expect(tableContent).toContain(proyectoName);

    // Get created proyecto ID from DB for subsequent tests
    const [created] = await db
      .select({ id: proyectos.id })
      .from(proyectos)
      .where(eq(proyectos.nombre, proyectoName))
      .limit(1);
    createdProyectoId = created?.id || null;
  });

  test('should navigate to proyecto detail page', async ({ page }) => {
    test.skip(!createdProyectoId, 'No proyecto created in previous test');

    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto(`/fondos/${testFondo.id}/proyectos/${createdProyectoId}`);
    await page.waitForLoadState('networkidle');

    // Should see the proyecto detail page with heading
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to inversiones tab within proyecto', async ({ page }) => {
    test.skip(!createdProyectoId, 'No proyecto created');

    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto(`/fondos/${testFondo.id}/proyectos/${createdProyectoId}/inversiones`);
    await page.waitForLoadState('networkidle');

    // Should see inversiones page
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toMatch(/inversi|nuevo|agregar|no hay/i);
  });

  test('should navigate to movimientos tab within proyecto', async ({ page }) => {
    test.skip(!createdProyectoId, 'No proyecto created');

    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto(`/fondos/${testFondo.id}/proyectos/${createdProyectoId}/movimientos`);
    await page.waitForLoadState('networkidle');

    // Should see movimientos page
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toMatch(/movimiento|transac|nuevo|agregar|no hay/i);
  });

  test('should edit an existing proyecto', async ({ page }) => {
    // Create a test proyecto for editing
    const testProyecto = await createTestProyecto(
      `Edit Test Proyecto ${Date.now()}`,
      testFondo.id,
      superAdmin.id
    );

    try {
      await loginAs(page, superAdmin.email, superAdmin.plainPassword);
      await page.goto(`/fondos/${testFondo.id}/proyectos`);
      await page.waitForLoadState('networkidle');

      // Find the proyecto row and click edit button
      const proyectoRow = page.getByRole('row').filter({ hasText: testProyecto.nombre });
      const editButton = proyectoRow.getByRole('button', { name: /editar|edit/i });

      if (await editButton.isVisible()) {
        await editButton.click();
      } else {
        // Try dropdown menu
        const menuButton = proyectoRow.getByRole('button').last();
        await menuButton.click();
        await page.getByRole('menuitem', { name: /editar|edit/i }).click();
      }

      // Wait for dialog
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      // Wait for form to be ready (inputs visible)
      await page.waitForSelector('input[name="nombre"]', { timeout: 5000 });

      // Ensure codigo field is filled (required) - it should be pre-filled but let's verify
      const codigoInput = page.locator('input[name="codigo"]');
      const codigoValue = await codigoInput.inputValue();
      if (!codigoValue) {
        await codigoInput.fill(`PRJ-EDIT-${Date.now()}`);
      }

      // Modify the name
      const newName = `${testProyecto.nombre} - Modified`;
      await page.fill('input[name="nombre"]', newName);

      // Submit
      const submitButton = page.getByRole('button', { name: /guardar|actualizar|save/i });
      await submitButton.click();

      // Wait for dialog to close with polling (handles potential delays)
      await expect
        .poll(
          async () => {
            const dialog = page.locator('[role="dialog"]');
            return (await dialog.count()) === 0 || !(await dialog.isVisible());
          },
          { timeout: 15000, message: 'Dialog should close after edit' }
        )
        .toBe(true);

      // Verify the modification with polling (wait for revalidation)
      await expect
        .poll(
          async () => {
            const table = page.locator('table');
            const content = await table.textContent();
            return content?.includes('Modified');
          },
          { timeout: 15000, message: 'Modified proyecto name should appear in table' }
        )
        .toBe(true);
    } finally {
      await cleanupTestProyecto(testProyecto.id);
    }
  });
});
