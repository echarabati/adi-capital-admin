/**
 * Tests for super-admin utilities
 *
 * Tests the role-based super admin detection.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the roles config
vi.mock('@/config/roles', () => ({
  isSuperAdmin: (role: string) => role === 'super_admin',
}));

describe('isUserSuperAdmin', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns true when user has super_admin role', async () => {
    const { isUserSuperAdmin } = await import('@/lib/auth/super-admin');
    expect(isUserSuperAdmin({ role: 'super_admin' })).toBe(true);
  });

  it('returns false when user has admin role', async () => {
    const { isUserSuperAdmin } = await import('@/lib/auth/super-admin');
    expect(isUserSuperAdmin({ role: 'admin' })).toBe(false);
  });

  it('returns false when user has user role', async () => {
    const { isUserSuperAdmin } = await import('@/lib/auth/super-admin');
    expect(isUserSuperAdmin({ role: 'user' })).toBe(false);
  });

  it('returns false when user is null', async () => {
    const { isUserSuperAdmin } = await import('@/lib/auth/super-admin');
    expect(isUserSuperAdmin(null)).toBe(false);
  });

  it('returns false when user is undefined', async () => {
    const { isUserSuperAdmin } = await import('@/lib/auth/super-admin');
    expect(isUserSuperAdmin(undefined)).toBe(false);
  });

  it('returns false when user has no role', async () => {
    const { isUserSuperAdmin } = await import('@/lib/auth/super-admin');
    expect(isUserSuperAdmin({})).toBe(false);
  });
});

describe('logSuperAdminAction', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('logs action and retrieves it', async () => {
    const { logSuperAdminAction, getRecentSuperAdminActions } =
      await import('@/lib/auth/super-admin');

    await logSuperAdminAction('user-123', 'admin@test.com', 'test_action', { key: 'value' });

    const actions = getRecentSuperAdminActions(1);
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].action).toBe('test_action');
    expect(actions[0].email).toBe('admin@test.com');
  });
});
