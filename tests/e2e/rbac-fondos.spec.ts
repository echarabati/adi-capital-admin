/**
 * RBAC Fondos E2E Tests
 *
 * Tests role-based access control for fund visibility.
 * - Super Admin sees all funds
 * - Admin de Fondo sees only assigned funds
 * - Unauthorized access is blocked
 *
 * @see TEST-001
 */

import { test, expect, Page } from '@playwright/test';
import { createTestUser, cleanupTestUser } from '../fixtures/auth';
import { db } from '@/lib/db/drizzle';
import { fondos, userFondos } from '@/lib/db/schema';
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
let adminFondo: TestUserData;
let fondoAsignado: TestFondoData;
let fondoNoAsignado: TestFondoData;

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

async function assignUserToFondo(userId: string, fondoId: string) {
  await db.insert(userFondos).values({ userId, fondoId });
}

async function cleanupTestFondo(fondoId: string) {
  if (!fondoId) return;
  try {
    await db.delete(userFondos).where(eq(userFondos.fondoId, fondoId));
    await db.delete(fondos).where(eq(fondos.id, fondoId));
  } catch (error) {
    console.error(`Failed to cleanup test fondo ${fondoId}:`, error);
  }
}

// =============================================================================
// Setup & Teardown
// =============================================================================

test.describe('RBAC Fondos E2E', () => {
  test.beforeAll(async () => {
    // Create Super Admin
    superAdmin = await createTestUser({
      email: `e2e-superadmin-${Date.now()}@test.com`,
      name: 'E2E Super Admin',
      role: 'super_admin',
    });

    // Create Admin de Fondo
    adminFondo = await createTestUser({
      email: `e2e-adminfondo-${Date.now()}@test.com`,
      name: 'E2E Admin Fondo',
      role: 'admin_fondo',
    });

    // Create two test funds
    fondoAsignado = await createTestFondo(`Fondo Asignado ${Date.now()}`, superAdmin.id);
    fondoNoAsignado = await createTestFondo(`Fondo No Asignado ${Date.now()}`, superAdmin.id);

    // Assign admin_fondo to only one fund
    await assignUserToFondo(adminFondo.id, fondoAsignado.id);
  });

  test.afterAll(async () => {
    // Cleanup in reverse order
    if (fondoAsignado?.id) await cleanupTestFondo(fondoAsignado.id);
    if (fondoNoAsignado?.id) await cleanupTestFondo(fondoNoAsignado.id);
    if (adminFondo?.id) await cleanupTestUser(adminFondo.id);
    if (superAdmin?.id) await cleanupTestUser(superAdmin.id);
  });

  // ===========================================================================
  // Tests
  // ===========================================================================

  test('Super Admin should see all funds', async ({ page }) => {
    await loginAs(page, superAdmin.email, superAdmin.plainPassword);
    await page.goto('/fondos');
    await page.waitForSelector('table', { timeout: 10000 });

    // Should see both funds
    const content = await page.textContent('body');
    expect(content).toContain(fondoAsignado.nombre);
    expect(content).toContain(fondoNoAsignado.nombre);
  });

  test('Admin de Fondo should see only assigned funds', async ({ page }) => {
    await loginAs(page, adminFondo.email, adminFondo.plainPassword);
    await page.goto('/fondos');
    await page.waitForSelector('table', { timeout: 10000 });

    // Should see assigned fund
    const content = await page.textContent('body');
    expect(content).toContain(fondoAsignado.nombre);

    // Should NOT see non-assigned fund
    expect(content).not.toContain(fondoNoAsignado.nombre);
  });

  test('Admin de Fondo should be blocked from accessing unauthorized fund', async ({ page }) => {
    await loginAs(page, adminFondo.email, adminFondo.plainPassword);

    // Try to access non-assigned fund
    await page.goto(`/fondos/${fondoNoAsignado.id}`);

    // Should get 404 (notFound) or be redirected
    // The layout uses notFound() which shows 404 page
    await page.waitForTimeout(2000); // Wait for potential redirect

    // Check for 404 page or redirect
    const url = page.url();
    const content = await page.textContent('body');

    // Either we see 404 or we're redirected away
    const is404 =
      content?.includes('404') ||
      content?.includes('not found') ||
      content?.includes('No encontrado');
    const isRedirected = !url.includes(fondoNoAsignado.id);

    expect(is404 || isRedirected).toBe(true);
  });

  test('Super Admin can access any fund detail', async ({ page }) => {
    await loginAs(page, superAdmin.email, superAdmin.plainPassword);

    // Access the non-assigned fund (which admin_fondo couldn't)
    await page.goto(`/fondos/${fondoNoAsignado.id}`);

    // Should see fund detail page
    await page.waitForSelector('h1', { timeout: 10000 });
    const heading = await page.textContent('h1');
    expect(heading).toContain(fondoNoAsignado.nombre);
  });

  test('Admin de Fondo can access their assigned fund detail', async ({ page }) => {
    await loginAs(page, adminFondo.email, adminFondo.plainPassword);

    // Access assigned fund
    await page.goto(`/fondos/${fondoAsignado.id}`);

    // Should see fund detail page
    await page.waitForSelector('h1', { timeout: 10000 });
    const heading = await page.textContent('h1');
    expect(heading).toContain(fondoAsignado.nombre);
  });
});
