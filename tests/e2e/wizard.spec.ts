/**
 * Wizard E2E Tests
 *
 * Tests end-to-end wizard flow for capital distribution.
 * - Navigate through 4 steps
 * - Select project
 * - Enter amount
 * - View cascada preview
 *
 * @see TEST-003
 * @see WIZ-001→WIZ-004
 */

import { test, expect, Page } from '@playwright/test';
import { createTestUser, cleanupTestUser } from '../fixtures/auth';
import { db } from '@/lib/db/drizzle';
import { fondos, proyectos, inversionistas, inversiones, userFondos } from '@/lib/db/schema';
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

interface TestFixtureData {
  fondoId: string;
  proyectoId: string;
  inversionistaId: string;
  inversionId: string;
}

let superAdmin: TestUserData;
let fixtures: TestFixtureData | null = null;

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

async function createTestFixtures(createdBy: string): Promise<TestFixtureData> {
  // Create fondo
  const [fondo] = await db
    .insert(fondos)
    .values({
      nombre: `E2E Wizard Fondo ${Date.now()}`,
      monedaBase: 'MXN',
      metodoCascada: 'pref_primero',
      createdBy,
      modifiedBy: createdBy,
    })
    .returning({ id: fondos.id });

  // Assign user to fondo
  await db.insert(userFondos).values({
    userId: createdBy,
    fondoId: fondo.id,
  });

  // Create proyecto
  const [proyecto] = await db
    .insert(proyectos)
    .values({
      fondoId: fondo.id,
      codigo: `PRJ-E2E-${Date.now()}`,
      nombre: `E2E Proyecto Test`,
      estado: 'inversion_abierta',
      tasaPref: '10.0',
      metodoCascada: 'pref_primero',
      createdBy,
      modifiedBy: createdBy,
    })
    .returning({ id: proyectos.id });

  // Create inversionista
  const [inversionista] = await db
    .insert(inversionistas)
    .values({
      nombre: `E2E Inversionista ${Date.now()}`,
      createdBy,
      modifiedBy: createdBy,
    })
    .returning({ id: inversionistas.id });

  // Create inversion
  const [inversion] = await db
    .insert(inversiones)
    .values({
      proyectoId: proyecto.id,
      inversionistaId: inversionista.id,
      compromiso: '100000.00',
      capitalAportado: '50000.00',
      prefAcumulado: '5000.00',
      prefPagado: '0.00',
      createdBy,
      modifiedBy: createdBy,
    })
    .returning({ id: inversiones.id });

  return {
    fondoId: fondo.id,
    proyectoId: proyecto.id,
    inversionistaId: inversionista.id,
    inversionId: inversion.id,
  };
}

async function cleanupTestFixtures(data: TestFixtureData | null) {
  if (!data) return;
  try {
    await db.delete(inversiones).where(eq(inversiones.id, data.inversionId));
    await db.delete(inversionistas).where(eq(inversionistas.id, data.inversionistaId));
    await db.delete(proyectos).where(eq(proyectos.id, data.proyectoId));
    await db.delete(userFondos).where(eq(userFondos.fondoId, data.fondoId));
    await db.delete(fondos).where(eq(fondos.id, data.fondoId));
  } catch (error) {
    console.error('Failed to cleanup wizard test fixtures:', error);
  }
}

// =============================================================================
// Setup & Teardown
// =============================================================================

test.describe('Wizard E2E', () => {
  test.beforeAll(async () => {
    // Create Super Admin
    superAdmin = await createTestUser({
      email: `e2e-wizard-${Date.now()}@test.com`,
      name: 'E2E Wizard Admin',
      role: 'super_admin',
    });

    // Create test data
    fixtures = await createTestFixtures(superAdmin.id);
  });

  test.afterAll(async () => {
    await cleanupTestFixtures(fixtures);
    if (superAdmin?.id) await cleanupTestUser(superAdmin.id);
  });

  // ===========================================================================
  // Tests
  // ===========================================================================

  test('should display wizard page with stepper', async ({ page }) => {
    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');

    // Should see stepper (look for step list items)
    const stepper = page.locator('ol, [role="list"]').first();
    await expect(stepper).toBeVisible({ timeout: 5000 });

    // Should see step 1 content heading
    await expect(page.getByRole('heading', { name: /selecciona.*proyecto/i })).toBeVisible();
  });

  test('should navigate through wizard steps', async ({ page }) => {
    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');

    // Step 1: Select project - click the project card containing our test project
    const projectCard = page.locator('[class*="cursor-pointer"]').filter({
      hasText: 'E2E Proyecto Test',
    });
    await expect(projectCard).toBeVisible({ timeout: 10000 });
    await projectCard.click();

    // Click Next
    const nextButton = page.getByRole('button', { name: /siguiente/i });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 2: Should see "Monto a Distribuir" heading
    await expect(page.getByRole('heading', { name: /monto.*distribuir/i })).toBeVisible({
      timeout: 5000,
    });

    // Find the text input (it's type="text" with inputMode="decimal")
    const montoInput = page.locator('input[inputmode="decimal"]');
    await expect(montoInput).toBeVisible();
    await montoInput.fill('10000');

    await nextButton.click();

    // Step 3: Preview - should see Preview heading
    await expect(page.getByRole('heading', { name: /preview/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show cascada preview with investor data', async ({ page }) => {
    test.skip(!fixtures, 'No fixtures created');

    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');

    // Select project
    const projectCard = page.locator('[class*="cursor-pointer"]').filter({
      hasText: 'E2E Proyecto Test',
    });
    await expect(projectCard).toBeVisible({ timeout: 10000 });
    await projectCard.click();

    const nextButton = page.getByRole('button', { name: /siguiente/i });
    await nextButton.click();

    // Wait for step 2
    await expect(page.getByRole('heading', { name: /monto.*distribuir/i })).toBeVisible({
      timeout: 5000,
    });

    // Enter amount
    const montoInput = page.locator('input[inputmode="decimal"]');
    await montoInput.fill('20000');
    await nextButton.click();

    // Should see preview with table
    await expect(page.getByRole('heading', { name: /preview/i })).toBeVisible({ timeout: 5000 });

    // Verify table exists
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 5000 });

    // Verify totals row exists
    const totalsRow = page.locator('tfoot tr, tr').filter({ hasText: /total/i });
    await expect(totalsRow).toBeVisible();
  });

  test('should validate amount is positive', async ({ page }) => {
    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');

    // Select project
    const projectCard = page.locator('[class*="cursor-pointer"]').filter({
      hasText: 'E2E Proyecto Test',
    });
    await expect(projectCard).toBeVisible({ timeout: 10000 });
    await projectCard.click();

    const nextButton = page.getByRole('button', { name: /siguiente/i });
    await nextButton.click();

    // Wait for step 2
    await expect(page.getByRole('heading', { name: /monto.*distribuir/i })).toBeVisible({
      timeout: 5000,
    });

    // Enter zero amount
    const montoInput = page.locator('input[inputmode="decimal"]');
    await montoInput.fill('0');

    // Next button should be disabled with zero amount
    await expect(nextButton).toBeDisabled();
  });
});
