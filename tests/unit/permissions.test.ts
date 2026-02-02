import { describe, it, expect } from 'vitest';
import { hasPermission, requirePermission, hasMinimumRole } from '@/lib/auth/permissions';

// Mock config/roles if needed, but since we updated vitest alias it should resolve.
// Assuming 'admin', 'user', 'super_admin' exist in the system.

describe('RBAC Permissions', () => {
  describe('hasPermission', () => {
    it('allows super_admin to do anything', () => {
      expect(hasPermission('super_admin', 'users', 'delete')).toBe(true);
      expect(hasPermission('super_admin', 'settings', 'update')).toBe(true);
    });

    it('allows admin to manage users', () => {
      expect(hasPermission('admin', 'users', 'create')).toBe(true);
      expect(hasPermission('admin', 'users', 'update')).toBe(true);
      expect(hasPermission('admin', 'users', 'delete')).toBe(true);
    });

    it('denies user from deleting users', () => {
      expect(hasPermission('user', 'users', 'delete')).toBe(false);
    });

    it('returns false for undefined role', () => {
      expect(hasPermission(undefined, 'users', 'read')).toBe(false);
      expect(hasPermission(null, 'users', 'read')).toBe(false);
    });
  });

  describe('requirePermission', () => {
    it('does not throw if allowed', () => {
      expect(() => requirePermission('admin', 'users', 'create')).not.toThrow();
    });

    it('throws error if denied', () => {
      expect(() => requirePermission('user', 'users', 'delete')).toThrow(/Permission denied/);
    });
  });

  describe('hasMinimumRole', () => {
    // Assuming hierarchy user < admin < super_admin
    it('returns true if role meets minimum', () => {
      expect(hasMinimumRole('admin', 'admin')).toBe(true);
      expect(hasMinimumRole('super_admin', 'admin')).toBe(true);
    });

    it('returns false if role is lower', () => {
      expect(hasMinimumRole('user', 'admin')).toBe(false);
    });
  });
});
