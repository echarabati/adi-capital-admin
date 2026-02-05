# INV-001: Lista de inversionistas

> **Issue ID:** INV-001
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E04-EPIC-INVERSIONISTAS](../epics/EPIC-INVERSIONISTAS.md)

---

## 🎯 Objetivo

Implementar lista de inversionistas con filtros por fondo y nombre.

## User Story

> Como **P-001/P-002**, quiero **ver la lista de inversionistas** para **gestionar su información**.

**Implementa:** US-011

---

## ✅ Criterios de Aceptación

- [x] URL: `/inversionistas`
- [x] DataTable: Nombre, Email, Fondos (tags), Es Fundador (badge)
- [x] Filtro por fondo (respeta RBAC)
- [x] Filtro por nombre/email
- [x] Click navega a `/inversionistas/[id]`

---

**Dependencias:** Bloqueado por FOND-003 ✅. Bloquea INV-002, INV-003.

---

## Implementation Notes

**Completed:** 2026-02-05

**Files created:**

- `lib/actions/inversionistas/inversionistas-queries.ts` — RBAC queries with N:M fondo join
- `lib/validations/inversionistas/inversionista-validation.ts` — Zod schemas
- `src/app/(protected)/inversionistas/page.tsx` — Server page
- `src/app/(protected)/inversionistas/InversionistasTable.tsx` — DataTable client component

**Files modified:**

- `src/config/navigation.ts` — Added Inversionistas to sidebar

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03_
_Completado: 2026-02-05_
