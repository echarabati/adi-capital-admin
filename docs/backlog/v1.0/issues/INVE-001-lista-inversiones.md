# INVE-001: Lista inversiones

> **Issue ID:** INVE-001
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E05-EPIC-INVERSIONES](../epics/EPIC-INVERSIONES.md)

## 🎯 Objetivo

Mostrar inversiones filtradas por proyecto o inversionista.

## User Story

> Como **P-001/P-002**, quiero **ver inversiones de un proyecto/inversionista** para **gestionar su estado**.

**Implementa:** US-017, US-018

---

## ✅ Criterios de Aceptación

- [x] Tabla en tab Inversiones de proyecto o inversionista
- [x] Columnas: Código, Proyecto/Inversionista, Compromiso, Aportado, Estado
- [x] Badge estado: Pendiente/Parcial/Completado/Excedido
- [x] Click navega a `/inversiones/[id]`

---

**Dependencias:** Bloqueado por PROJ-003, INV-003. Bloquea INVE-002.

---

## Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Resumen:** Implemented inversiones list tables for both proyecto and inversionista detail page tabs
- **Patrón:** Followed `ProyectosTable.tsx` pattern for consistency
- **Estado:** Computed dynamically from `compromiso` vs `capitalAportado` (Pendiente/Parcial/Completado/Excedido)
- **Navigation:** Row click navigates to `/inversiones/[id]` (placeholder route for INVE-003)

**Files created:**

- `lib/actions/inversiones/inversiones-queries.ts` — Server queries with RBAC
- `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/inversiones/InversionesTable.tsx` — Table for proyecto context
- `src/app/(protected)/inversionistas/[id]/inversiones/InversionistaInversionesTable.tsx` — Table for inversionista context

**Files modified:**

- `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/inversiones/page.tsx` — Replaced placeholder
- `src/app/(protected)/inversionistas/[id]/inversiones/page.tsx` — Replaced placeholder

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass
- [x] Tests: N/A (E2E in TEST-002)

---

_Creado: 2026-02-03_
