# MOV-002: CMP-002 MovimientoForm base

> **Issue ID:** MOV-002
> **Priority:** P0
> **Effort:** L
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Crear componente base de formulario de movimiento que se adapta según el concepto seleccionado, con soporte multi-moneda.

## User Story

> Como **P-001/P-002**, quiero **registrar movimientos de diferentes tipos** para **llevar contabilidad del fondo**.

**Implementa:** US-030, US-090

---

## 📚 Referencias

- Pantalla: [SCR-051](../../planning/09_DESIGN.md#scr-050051052-movimientos)
- Wireframe: [SCR-051_movimiento_form.png](../../wireframes/SCR-051_movimiento_form.png)
- Business Rules: [BR-020→029](../../planning/04_BUSINESS_RULES.md), [BR-050](../../planning/04_BUSINESS_RULES.md#br-050)
- API Contract: `createMovimiento` (07_API_CONTRACTS.md L273-306)

---

## ✅ Criterios de Aceptación

- [x] Sheet lateral para form de movimiento
- [x] Step 1: CMP-011 ConceptoSelector (grid de badges por categoría)
- [x] Step 2: Campos dinámicos según concepto
- [x] Campos base: Monto (input numérico), Fecha, Descripción
- [x] Campo tipo_cambio visible si moneda ≠ USD (US-090)
- [x] Cálculo automático: monto_usd = monto / tipo_cambio
- [x] Validación con Zod
- [x] Guardar como borrador

---

**Dependencias de Issues:**

- Bloqueado por: MOV-001 ✅, DRIVE-003 (parcial - usado input simple)
- Bloquea a: MOV-003→010

## 🧪 Tests Requeridos

- [x] Unit: Validación por concepto — via Zod schema
- [x] Unit: Cálculo tipo de cambio — in component

---

## 📝 Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Resumen:** Form wizard con 2 pasos: ConceptoSelector → Campos dinámicos
- **DRIVE-003:** No completado, usé input numérico simple en lugar de CurrencyInput
- **Multi-moneda:** USD como base, MXN requiere tipoCambio para calcular equivalente

**Files created:**

- `lib/actions/movimientos/movimientos-mutations.ts` — createMovimiento server action
- `src/app/(protected)/movimientos/_components/ConceptoSelector.tsx` — Grid de badges
- `src/app/(protected)/movimientos/_components/MovimientoFormSheet.tsx` — Sheet form

**Files modified:**

- `lib/validations/movimientos/movimientos-validation.ts` — createMovimientoSchema + CONCEPTO_CONFIG
- `src/app/(protected)/movimientos/MovimientosTable.tsx` — Wired up button + sheet

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
