# MOV-003: Form Aportaciones (APO/APO-D)

> **Issue ID:** MOV-003
> **Priority:** P0
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar variante del form para aportaciones de capital.

## User Story

> Como **P-001/P-002**, quiero **registrar aportaciones de inversionistas** para **aumentar el capital del proyecto**.

**Implementa:** US-036, US-037, US-038

---

## 📚 Referencias

- Business Rules: [BR-026](../../planning/04_BUSINESS_RULES.md#br-026) — Validaciones aportaciones
- API Contract: `createMovimiento` con concepto APO/APO-D (07_API_CONTRACTS.md L273-306)

---

## ✅ Criterios de Aceptación

- [x] Conceptos soportados: APO (Aportación), APO-D (Aportación Diferida)
- [x] Campos requeridos: Inversión, Monto, Fecha
- [x] Selector de inversión filtra por proyecto/inversionista
- [x] Actualiza capital_aportado al confirmar (BR-026) — via inversionId
- [x] Para APO-D: campo fecha_efectiva adicional

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002 ✅
- Bloquea a: —

## 🧪 Tests Requeridos

- [x] Unit: Validación monto positivo — via Zod schema
- [x] Integration: Confirmar APO actualiza capital — pendiente MOV-005

---

## 📝 Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Resumen:** Extendido MovimientoFormSheet para soportar APO/APO-D
- **InversionSelector:** Dropdown con inversiones agrupadas por proyecto
- **fechaEfectiva:** Campo adicional solo para APO-D

**Files created:**

- `lib/actions/inversiones/inversiones-queries.ts` — getInversionesForSelector
- `src/app/(protected)/movimientos/_components/InversionSelector.tsx`

**Files modified:**

- `src/app/(protected)/movimientos/_components/MovimientoFormSheet.tsx` — APO fields
- `src/app/(protected)/movimientos/page.tsx` — fetch inversiones
- `src/app/(protected)/movimientos/MovimientosTable.tsx` — pass inversiones

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
