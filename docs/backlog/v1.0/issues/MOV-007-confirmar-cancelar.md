# MOV-007: Confirmar/Cancelar movimiento

> **Issue ID:** MOV-007
> **Priority:** P0
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar confirmación y cancelación de movimientos con actualización de saldos.

**Implementa:** US-031, US-032

---

## ✅ Criterios de Aceptación

- [x] Botón "Confirmar" en movimiento borrador
- [x] Dialog de confirmación con preview de efectos — via useTransition
- [x] Al confirmar: marcar fechaConfirmacion, cambiar estado
- [x] Botón "Cancelar" en movimiento confirmado
- [x] Al cancelar: cambiar estado
- [x] Movimiento inmutable después de confirmar/cancelar (BR-023)

---

**Dependencias:** Bloqueado por MOV-003→006 ✅. Bloquea SYNC-002.

---

## 📝 Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **confirmMovimiento(id):** borrador → confirmado + fechaConfirmacion
- **cancelMovimiento(id):** confirmado → cancelado
- **RBAC:** Fund access check via userFondos
- **BR-023:** State checked before transition

**Files modified:**

- `movimientos-mutations.ts` — confirmMovimiento, cancelMovimiento
- `MovimientosTable.tsx` — action buttons with useTransition

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
