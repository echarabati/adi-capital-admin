# PROJ-002: Crear/Editar proyecto

> **Issue ID:** PROJ-002
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Done (2026-02-04)
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar formulario para crear y editar proyectos con configuración de tasas.

## User Story

> Como **P-001/P-002**, quiero **crear proyectos** para **registrar inversiones inmobiliarias**.

**Implementa:** US-004, US-005

---

## 📚 Referencias

- Pantalla: [SCR-022](../../planning/09_DESIGN.md#scr-020021022-proyectos)
- Business Rules: [BR-004→008](../../planning/04_BUSINESS_RULES.md)

---

## ✅ Criterios de Aceptación

- [x] Dialog con campos: Nombre, Descripción, Success Fee %
- [x] Nombre único dentro del fondo (validación)
- [x] Success Fee default: 20%
- [x] Método Cascada opcional (hereda de fondo si null)
- [x] Toast éxito/error
- [x] Editar proyecto existente

---

**Dependencias de Issues:**

- Bloqueado por: PROJ-001
- Bloquea a: PROJ-003

---

## Implementation Notes

**Completed:** 2026-02-04

**Context & Decisions:**

- Followed `CuentaBancariaFormDialog` pattern for consistency
- Uniqueness check: nombre within fondo
- Default successFeePct: 20%
- metodoCascada: null = inherit from fund

**Files created:**

- `lib/validations/proyectos/proyecto-validation.ts` — Zod schemas
- `lib/actions/proyectos/proyectos-mutations.ts` — Create/update actions
- `src/app/(protected)/fondos/[id]/proyectos/ProyectoFormDialog.tsx` — Form dialog

**Files modified:**

- `src/app/(protected)/fondos/[id]/proyectos/ProyectosTable.tsx` — Create/edit buttons
- `src/app/(protected)/fondos/[id]/proyectos/page.tsx` — Pass userRole prop

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03_
