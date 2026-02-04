# SCHEMA-003: Extender users con roles y fondos

> **Issue ID:** SCHEMA-003
> **Priority:** P0
> **Effort:** S
> **Status:** ✅ Completed (2026-02-04)
> **Epic:** [E01-EPIC-SCHEMA](../epics/EPIC-SCHEMA.md)

---

## 🎯 Objetivo

Extender schema de users existente (Starter Kit) para soportar roles y asignación de fondos.

## User Story

> Como **Super Admin**, quiero **asignar roles y fondos a usuarios** para **implementar RBAC**.

**Implementa:** US-103, US-107

---

## 📚 Referencias

**Schema:**

- [E-010: Usuarios](../../planning/05_DATA_MODEL.md#e-010-usuarios)

**RBAC:**

- [04_BUSINESS_RULES.md - BR-050→071](../../planning/04_BUSINESS_RULES.md#reglas-rbac)

---

## ✅ Criterios de Aceptación

- [x] Enum `rol_usuario`: 'super_admin', 'admin_fondo', 'agente'
- [x] Campo `role` agregado a tabla `users` usando enum (kept field name for compatibility)
- [x] Tabla `user_fondos` para asignación NxM
- [x] Índices en `user_fondos`
- [x] `pnpm db:generate` ejecuta sin errores

## 🔧 Contexto Técnico

**Archivos a modificar:**

- `lib/db/schema/users.ts` — Agregar campo `role` con enum

**Archivos a crear:**

- `lib/db/schema/user-fondos.ts` — Tabla de asignación

```typescript
export const userFondos = pgTable(
  'user_fondos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    fondoId: uuid('fondo_id')
      .notNull()
      .references(() => fondos.id, { onDelete: 'cascade' }),
    ...auditFields,
  },
  (table) => [
    index('user_fondos_user_id_idx').on(table.userId),
    index('user_fondos_fondo_id_idx').on(table.fondoId),
    unique('user_fondos_unique').on(table.userId, table.fondoId),
  ]
);
```

---

**Dependencias de Issues:**

- Bloqueado por: SCHEMA-001 ✅
- Bloquea a: FOND-001, FOND-002

## 🧪 Tests Requeridos

- [x] Integration: Migraciones aplican sin romper auth existente

## 🚫 Out of Scope

- UI de gestión de usuarios (ya existe en Starter Kit)

---

## Implementation Notes

**Completed:** 2026-02-04

**Context & Decisions:**

- Kept field name as `role` (not `rol`) for backward compatibility with existing codebase
- Changed enum values from `super_admin/admin/user` to `super_admin/admin_fondo/agente` per data model
- Updated all role references across 10+ files to use new role values
- Default role for invited users changed from `user` to `admin_fondo`

**Files created:**

- `lib/db/schema/user-fondos.ts` — N:M pivot table with UNIQUE(user_id, fondo_id)

**Files modified:**

- `lib/db/schema/enums.ts` — Added `rolUsuarioEnum`
- `lib/db/schema/users.ts` — Changed role field to use enum
- `lib/db/schema/index.ts` — Export user-fondos
- `src/config/roles.ts` — New role values (SUPER_ADMIN, ADMIN_FONDO, AGENTE)
- `lib/auth/permissions.ts` — Updated PERMISSIONS matrix
- `lib/validations/admin/user-admin.ts` — Schema updates
- `components/admin/UserTable.tsx` — Role filter options
- `components/admin/UserFormDialog.tsx` — Form defaults
- `tests/fixtures/auth.ts` — Test role values
- `tests/e2e/user-admin.spec.ts` — E2E test role values
- `src/app/api/invites/accept/route.ts` — Default role

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] DB Generate: `lib/db/migrations/0004_legal_senator_kelly.sql`

---

_Creado: 2026-02-03_
_Completado: 2026-02-04_
