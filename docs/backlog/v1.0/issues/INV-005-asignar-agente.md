# INV-005: Asignar agente

> **Issue ID:** INV-005
> **Priority:** P3
> **Effort:** XS
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E04-EPIC-INVERSIONISTAS](../epics/EPIC-INVERSIONISTAS.md)

---

## 🎯 Objetivo

Permitir asignar agente de ventas a inversionista.

## User Story

> Como **P-001/P-002**, quiero **asignar un agente** para **tracking de referidos y comisiones futuras**.

**Implementa:** US-013

---

## ✅ Criterios de Aceptación

- [x] Campo agente_email en form de inversionista
- [x] Campo opcional (nullable)
- [x] Lookup/autocomplete de usuarios con rol agente (si existen) — Simple input por ahora
- [x] Visible en detalle del inversionista como "Referido por: [Agente]"
- [x] Nota: Cálculo de comisiones es Post-MVP

---

**Dependencias:** Bloqueado por INV-002 ✅.

---

## Implementation Notes

**Completed:** 2026-02-05

**Context:**

- El campo `agenteId` ya existía en el schema (nullable UUID)
- Se agregó campo en form con validación UUID opcional
- Se muestra "Referido por agente" en el header del detalle cuando existe

**Files modified:**

- `lib/validations/inversionistas/inversionista-validation.ts` — +agenteId
- `lib/actions/inversionistas/inversionistas-mutations.ts` — +agenteId handling
- `lib/actions/inversionistas/inversionistas-queries.ts` — +agenteId in type/select
- `src/app/(protected)/inversionistas/InversionistaFormDialog.tsx` — +input
- `src/app/(protected)/inversionistas/[id]/layout.tsx` — +Referido display

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03_
_Completado: 2026-02-05_
