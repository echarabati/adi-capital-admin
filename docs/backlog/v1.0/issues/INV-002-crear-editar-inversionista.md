# INV-002: Crear/Editar inversionista

> **Issue ID:** INV-002
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E04-EPIC-INVERSIONISTAS](../epics/EPIC-INVERSIONISTAS.md)

---

## 🎯 Objetivo

Implementar formulario para crear y editar inversionistas con asignación a fondos.

## User Story

> Como **P-001/P-002**, quiero **crear inversionistas** para **registrar participantes en el fondo**.

**Implementa:** US-009, US-010

---

## ✅ Criterios de Aceptación

- [x] Dialog con: Nombre, Email (único), Teléfono, Fondos (multi-select)
- [x] Validación email único (BR-010)
- [x] Asignar a al menos 1 fondo (BR-011)
- [x] Toast éxito/error
- [x] Editar inversionista existente

---

**Dependencias:** Bloqueado por INV-001 ✅. Bloquea INV-003.

---

## Implementation Notes

**Completed:** 2026-02-05

**Files created:**

- `lib/actions/inversionistas/inversionistas-mutations.ts` — Create/Update with N:M fondo handling
- `src/app/(protected)/inversionistas/InversionistaFormDialog.tsx` — Form dialog with multi-select

**Files modified:**

- `InversionistasTable.tsx` — Added create/edit buttons and dialogs

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03_
_Completado: 2026-02-05_
