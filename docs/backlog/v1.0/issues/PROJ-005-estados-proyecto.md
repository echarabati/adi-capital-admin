# PROJ-005: Estados proyecto

> **Issue ID:** PROJ-005
> **Priority:** P2
> **Effort:** S
> **Status:** ✅ Done (2026-02-04)
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar cambio de estado del proyecto con validaciones correspondientes.

## User Story

> Como **P-001/P-002**, quiero **cambiar el estado del proyecto** para **reflejar su ciclo de vida**.

**Implementa:** US-007

---

## 📚 Referencias

- Business Rules: [BR-008](../../planning/04_BUSINESS_RULES.md#br-008) — Estados y restricciones
- API Contract: `updateProyectoEstado` (07_API_CONTRACTS.md L155-175)

---

## ✅ Criterios de Aceptación

- [x] Estados: inversion_abierta → inversion_cerrada → concluido
- [x] Transición inversa solo: cerrada → abierta (reabrir)
- [x] No se pueden crear movimientos en proyecto concluido (BR-008)
- [x] Dropdown en header de detalle del proyecto
- [x] Confirmación con warning antes de cambiar a "concluido"

---

**Dependencias de Issues:**

- Bloqueado por: PROJ-003
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Validación transiciones válidas
- [ ] Integration: Bloqueo de movimientos en concluido

---

## Implementation Notes

**Completed:** 2026-02-04

**Context & Decisions:**

- Migrated `estadoProyectoEnum` from generic to semantic values
- VALID_TRANSITIONS map for BR-008 enforcement
- Confirmation dialog for terminal state (concluido)

**Files created:**

- `src/.../[proyectoId]/EstadoSelector.tsx` — Client dropdown with confirmation

**Files modified:**

- `lib/db/schema/enums.ts` — New enum values
- `lib/db/schema/proyectos.ts` — New default
- `lib/validations/proyectos/proyecto-validation.ts` — Zod options
- `lib/actions/proyectos/proyectos-mutations.ts` — Added `updateProyectoEstado`
- `lib/actions/proyectos/proyectos-queries.ts` — Updated types
- `src/.../[proyectoId]/layout.tsx` — Integrated EstadoSelector
- `src/.../proyectos/ProyectosTable.tsx` — Updated estadoConfig

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
