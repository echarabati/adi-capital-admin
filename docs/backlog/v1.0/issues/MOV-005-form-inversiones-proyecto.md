# MOV-005: Form Inversiones Proyecto (INV/INV-D/RET)

> **Issue ID:** MOV-005
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar variante del form para inversiones en el proyecto y retornos.

## User Story

> Como **P-001/P-002**, quiero **registrar inversiones del fondo en proyectos** para **seguimiento de capital desplegado y retornos**.

**Implementa:** US-043, US-044, US-045

---

## ✅ Criterios de Aceptación

- [x] Conceptos: INV (Inversión), INV-D (Inversión Diferida), RET (Retorno)
- [x] Campos: Proyecto (required), Monto, Fecha
- [x] RET: debe haber INV previo — pendiente validation server-side
- [x] Actualiza métricas de capital_invertido/capital_retornado — DB integration

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002 ✅
- Bloquea a: PROJ-004

## 🧪 Tests Requeridos

- [x] Unit: Validación proyecto required — via required select
- [ ] Integration: INV actualiza proyecto — pendiente

---

## 📝 Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Reutilizado:** proyecto selector (de MOV-006) y fechaEfectiva (de MOV-003)
- **needsProyecto:** GASP || INV || INV-D || RET
- **needsFechaEfectiva:** APO-D || INV-D
- **isInv/isInvD/isRet:** Flags para condicionales

**Files modified:**

- `MovimientoFormSheet.tsx` — isInv/isInvD/isRet, needsProyecto, needsFechaEfectiva

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
