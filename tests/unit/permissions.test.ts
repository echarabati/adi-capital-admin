import { describe, it, expect } from 'vitest';
import { hasPermission, requirePermission, hasMinimumRole } from '@/lib/auth/permissions';

// Updated to use new role values: super_admin, admin_fondo, agente
// Hierarchy: agente < admin_fondo < super_admin

describe('RBAC Permissions', () => {
  describe('hasPermission', () => {
    it('allows super_admin to do anything', () => {
      expect(hasPermission('super_admin', 'users', 'delete')).toBe(true);
      expect(hasPermission('super_admin', 'settings', 'update')).toBe(true);
    });

    it('allows admin_fondo to manage users', () => {
      expect(hasPermission('admin_fondo', 'users', 'create')).toBe(true);
      expect(hasPermission('admin_fondo', 'users', 'update')).toBe(true);
      expect(hasPermission('admin_fondo', 'users', 'delete')).toBe(true);
    });

    it('denies agente from deleting users', () => {
      expect(hasPermission('agente', 'users', 'delete')).toBe(false);
    });

    it('returns false for undefined role', () => {
      expect(hasPermission(undefined, 'users', 'read')).toBe(false);
      expect(hasPermission(null, 'users', 'read')).toBe(false);
    });
  });

  describe('requirePermission', () => {
    it('does not throw if allowed', () => {
      expect(() => requirePermission('admin_fondo', 'users', 'create')).not.toThrow();
    });

    it('throws error if denied', () => {
      expect(() => requirePermission('agente', 'users', 'delete')).toThrow(/Permission denied/);
    });
  });

  describe('hasMinimumRole', () => {
    // Hierarchy: agente < admin_fondo < super_admin
    it('returns true if role meets minimum', () => {
      expect(hasMinimumRole('admin_fondo', 'admin_fondo')).toBe(true);
      expect(hasMinimumRole('super_admin', 'admin_fondo')).toBe(true);
    });

    it('returns false if role is lower', () => {
      expect(hasMinimumRole('agente', 'admin_fondo')).toBe(false);
    });
  });
});
