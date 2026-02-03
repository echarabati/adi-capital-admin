# SCHEMA-003: Extender users con roles y fondos

> **Issue ID:** SCHEMA-003
> **Priority:** P0
> **Effort:** S
> **Status:** 📋 Backlog
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

- [ ] Enum `rol_usuario`: 'super_admin', 'admin_fondo', 'agente'
- [ ] Campo `rol` agregado a tabla `users` existente
- [ ] Tabla `user_fondos` para asignación NxM
- [ ] Índices en `user_fondos`
- [ ] `pnpm db:generate` ejecuta sin errores

## 🔧 Contexto Técnico

**Archivos a modificar:**

- `lib/db/schema/users.ts` — Agregar campo `rol`

**Archivos a crear:**

- `lib/db/schema/user-fondos.ts` — Tabla de asignación

```typescript
export const userFondos = pgTable('user_fondos', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  fondoId: text('fondo_id')
    .notNull()
    .references(() => fondos.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

**Dependencias de Issues:**

- Bloqueado por: SCHEMA-001
- Bloquea a: FOND-001, FOND-002

## 🧪 Tests Requeridos

- [ ] Integration: Migraciones aplican sin romper auth existente

## 🚫 Out of Scope

- UI de gestión de usuarios (ya existe en Starter Kit)

---

_Creado: 2026-02-03_
