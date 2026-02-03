# E02 — EPIC-FONDOS: Gestión de Fondos

> **Milestone:** v1.0
> **Status:** 📋 Planning
> **Issues:** 6 total (0 done) — includes TEST-001
> **Priority:** P0

---

## Objetivo

Implementar CRUD completo de fondos, cuentas bancarias y beneficiarios con RBAC.

## Issues

| ID                                                   | Título                    | Priority | Effort | Status |
| ---------------------------------------------------- | ------------------------- | -------- | ------ | ------ |
| [FOND-001](../issues/FOND-001-lista-fondos.md)       | Lista de fondos con RBAC  | P0       | M      | 📋     |
| [FOND-002](../issues/FOND-002-crear-editar-fondo.md) | Crear/Editar fondo        | P0       | M      | 📋     |
| [FOND-003](../issues/FOND-003-detalle-fondo.md)      | Detalle de fondo con tabs | P1       | M      | 📋     |
| [FOND-004](../issues/FOND-004-cuentas-bancarias.md)  | CRUD Cuentas Bancarias    | P1       | M      | 📋     |
| [FOND-005](../issues/FOND-005-beneficiarios.md)      | CRUD Beneficiarios        | P1       | S      | 📋     |
| [TEST-001](../issues/TEST-001-e2e-auth-rbac.md)      | 🧪 E2E Auth + RBAC        | P0       | M      | 📋     |

## Dependencias

- **Requiere:** E01 (SCHEMA)
- **Bloquea:** E03, E04, E10

## Scope

**Incluido:**

- SCR-010, SCR-011, SCR-012, SCR-013
- FT-001 (Fondos), FT-006 (Cuentas), FT-007 (Beneficiarios)
- US-001 → US-003, US-022 → US-026

**Excluido:**

- Proyectos (E03)
- Inversionistas (E04)

## Referencias

- [09_DESIGN.md - SCR-010/011/012/013](../../planning/09_DESIGN.md#scr-010011012013-fondos)
- [03_USER_STORIES.md](../../planning/03_USER_STORIES.md)

---

_Epic E02 — Backlog v1.0_
