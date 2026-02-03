# E01 — EPIC-SCHEMA: Schema y Migración

> **Milestone:** v1.0
> **Status:** 📋 Planning
> **Issues:** 3 total (0 done)
> **Priority:** P0 (Blocker)

---

## Objetivo

Crear schemas Drizzle para todas las entidades del sistema. Este epic bloquea a todos los demás.

## Issues

| ID                                                         | Título                                      | Priority | Effort | Status |
| ---------------------------------------------------------- | ------------------------------------------- | -------- | ------ | ------ |
| [SCHEMA-001](../issues/SCHEMA-001-drizzle-schemas-core.md) | Crear schemas Drizzle para entidades core   | P0       | L      | 📋     |
| [SCHEMA-002](../issues/SCHEMA-002-schemas-movimientos.md)  | Crear schemas para movimientos y calendario | P0       | M      | 📋     |
| [SCHEMA-003](../issues/SCHEMA-003-users-roles.md)          | Extender users con roles y fondos           | P0       | S      | 📋     |

## Dependencias

- **Requiere:** —
- **Bloquea:** E02, E03, E04, E05, E06

## Scope

**Incluido:**

- Schemas Drizzle para E-001 → E-010
- Enums compartidos
- Relaciones (FK, N:M)
- Migraciones

**Excluido:**

- Server Actions (E02+)
- UI (E02+)

## Referencias

- [05_DATA_MODEL.md](../../planning/05_DATA_MODEL.md)
- [lib/db/schema/](../../../lib/db/schema/)

---

_Epic E01 — Backlog v1.0_
