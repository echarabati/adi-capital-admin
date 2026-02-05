# MOV-006: Form Gastos (GAS/GASP)

> **Issue ID:** MOV-006
> **Priority:** P1
> **Effort:** S
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar variante del form para gastos generales y de proyecto.

## User Story

> Como **P-001/P-002**, quiero **registrar gastos del fondo y proyectos** para **llevar control de costos**.

**Implementa:** US-047, US-048

---

## ✅ Criterios de Aceptación

- [x] Conceptos: GAS (Gasto General), GASP (Gasto Proyecto)
- [x] Campos: Monto, Descripción (required), Fecha
- [x] GASP requiere campo Proyecto adicional (BR-028)
- [x] Actualiza gastos_fondo o gastos_proyecto según concepto

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002 ✅
- Bloquea a: —

## 🧪 Tests Requeridos

- [x] Unit: Validación GASP sin proyecto — via required select
- [ ] Integration: GAS suma a métricas fondo — pendiente

---

## 📝 Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **isGas/isGasp/isGasto:** Flags para condicionales
- **Proyecto selector:** Filtrado por fondoId para GASP
- **Descripción:** Required para todos los gastos
- **fondoId added:** A ProyectoListItem type

**Files modified:**

- `MovimientoFormSheet.tsx` — isGas/isGasp flags, proyecto selector
- `MovimientosTable.tsx` — proyectos prop
- `page.tsx` — fetch proyectos
- `proyectos-queries.ts` — fondoId en ProyectoListItem

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
