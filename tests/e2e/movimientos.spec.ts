/**
 * Movimientos E2E Tests
 *
 * Tests end-to-end movement flows: view, confirm, cancel.
 * Uses Neon branch isolation for database testing.
 *
 * @see TEST-002
 */

import { test, expect, Page } from '@playwright/test';
import { createTestUser, cleanupTestUser } from '../fixtures/auth';
import { db } from '@/lib/db/drizzle';
import { fondos, movimientos, userFondos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// =============================================================================
// Test Configuration
// =============================================================================

// Tests run serially because they share state (same movement goes through flow)
test.describe.configure({ mode: 'serial' });

// =============================================================================
// Types
// =============================================================================

interface TestUser {
  id: string;
  email: string;
  plainPassword: string;
}

interface TestFondo {
  id: string;
  nombre: string;
}

// =============================================================================
// Test State
// =============================================================================

let testUser: TestUser;
let testFondo: TestFondo;
let movimientoId: string;

// =============================================================================
// Factory Functions
// =============================================================================

async function createFondo(userId: string): Promise<TestFondo> {
  const [fondo] = await db
    .insert(fondos)
    .values({
      nombre: `E2E Fondo ${Date.now()}`,
      monedaBase: 'USD',
      metodoCascada: 'pref_primero',
      createdBy: userId,
      modifiedBy: userId,
    })
    .returning({ id: fondos.id, nombre: fondos.nombre });

  await db.insert(userFondos).values({ userId, fondoId: fondo.id });
  return fondo;
}

async function createMovimiento(
  fondoId: string,
  userId: string,
  estado: 'borrador' | 'confirmado' | 'cancelado' = 'borrador'
): Promise<string> {
  const [mov] = await db
    .insert(movimientos)
    .values({
      fondoId,
      concepto: 'GAS',
      monto: '5000',
      moneda: 'USD',
      estado,
      fechaMovimiento: new Date(),
      descripcion: 'E2E Test',
      createdBy: userId,
      modifiedBy: userId,
    })
    .returning({ id: movimientos.id });

  return mov.id;
}

async function getMovimientoEstado(id: string): Promise<string | null> {
  const [mov] = await db
    .select({ estado: movimientos.estado })
    .from(movimientos)
    .where(eq(movimientos.id, id))
    .limit(1);
  return mov?.estado ?? null;
}

async function cleanup() {
  if (testFondo?.id) {
    await db
      .delete(movimientos)
      .where(eq(movimientos.fondoId, testFondo.id))
      .catch(() => {});
    await db
      .delete(userFondos)
      .where(eq(userFondos.fondoId, testFondo.id))
      .catch(() => {});
    await db
      .delete(fondos)
      .where(eq(fondos.id, testFondo.id))
      .catch(() => {});
  }
}

// =============================================================================
// Helpers
// =============================================================================

async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForSelector('#email');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard|fondos|movimientos/, { timeout: 15000 });
}

// =============================================================================
// Tests
// =============================================================================

test.describe('Movimientos E2E Flow', () => {
  test.beforeAll(async () => {
    testUser = await createTestUser({
      email: `e2e-mov-${Date.now()}@test.com`,
      name: 'E2E Mov Test',
      role: 'super_admin',
    });
    testFondo = await createFondo(testUser.id);
    movimientoId = await createMovimiento(testFondo.id, testUser.id, 'borrador');
  });

  test.afterAll(async () => {
    await cleanup();
    if (testUser?.id) await cleanupTestUser(testUser.id);
  });

  // ---------------------------------------------------------------------------
  // Test 1: See movement in table
  // ---------------------------------------------------------------------------

  test('should display borrador movement in table', async ({ page }) => {
    // Arrange
    await login(page, testUser.email, testUser.plainPassword);

    // Act
    await page.goto('/movimientos');
    await page.waitForLoadState('networkidle');

    // Assert - Table visible
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10000 });

    // Assert - Movement visible with correct data
    const tableText = await table.textContent();
    expect(tableText?.toLowerCase()).toContain('borrador');
    expect(tableText).toContain('Gasto'); // GAS shows as "Gasto Admin/Proyecto"
  });

  // ---------------------------------------------------------------------------
  // Test 2: Confirm movement
  // ---------------------------------------------------------------------------

  test('should confirm movement via action button', async ({ page }) => {
    // Arrange
    await login(page, testUser.email, testUser.plainPassword);
    await page.goto('/movimientos');
    await page.waitForLoadState('networkidle');

    // Find row with borrador
    const row = page
      .getByRole('row')
      .filter({ hasText: /borrador/i })
      .first();
    await expect(row).toBeVisible({ timeout: 10000 });

    // Act - Click confirm button (icon button with Check svg)
    const confirmBtn = row
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();
    await expect(confirmBtn).toBeVisible({ timeout: 5000 });
    await confirmBtn.click();

    // Assert - DB state changed
    await page.waitForTimeout(1500);
    const estado = await getMovimientoEstado(movimientoId);
    expect(estado).toBe('confirmado');
  });

  // ---------------------------------------------------------------------------
  // Test 3: Cancel movement
  // ---------------------------------------------------------------------------

  test('should cancel movement via action button', async ({ page }) => {
    // Arrange
    await login(page, testUser.email, testUser.plainPassword);
    await page.goto('/movimientos');
    await page.waitForLoadState('networkidle');

    // Find row with confirmado
    const row = page
      .getByRole('row')
      .filter({ hasText: /confirmado/i })
      .first();
    await expect(row).toBeVisible({ timeout: 10000 });

    // Act - Click cancel button (icon button with XCircle svg)
    const cancelBtn = row
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();
    await expect(cancelBtn).toBeVisible({ timeout: 5000 });
    await cancelBtn.click();

    // Assert - DB state changed
    await page.waitForTimeout(1500);
    const estado = await getMovimientoEstado(movimientoId);
    expect(estado).toBe('cancelado');
  });

  // ---------------------------------------------------------------------------
  // Test 4: Page loads correctly
  // ---------------------------------------------------------------------------

  test('should load movimientos page with nuevo button', async ({ page }) => {
    // Arrange & Act
    await login(page, testUser.email, testUser.plainPassword);
    await page.goto('/movimientos');
    await page.waitForLoadState('networkidle');

    // Assert - Key elements present
    await expect(page.getByRole('heading', { name: /movimientos/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /nuevo movimiento/i })).toBeVisible();
  });
});
