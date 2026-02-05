# MOV-004: Form Distribuciones (DIS/DEV/FEE)

> **Issue ID:** MOV-004
> **Priority:** P0
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar variante del form para distribuciones y devoluciones.

## User Story

> Como **P-001/P-002**, quiero **registrar distribuciones a inversionistas** para **devolver capital y utilidades**.

**Implementa:** US-039, US-040, US-041

---

## 📚 Referencias

- Business Rules: [BR-027](../../planning/04_BUSINESS_RULES.md#br-027) — Validaciones distribuciones
- API Contract: `createMovimiento` con concepto DIS/DEV/FEE (07_API_CONTRACTS.md L273-306)

---

## ✅ Criterios de Aceptación

- [x] Conceptos soportados: DIS (Distribución), DEV (Devolución), FEE (Success Fee)
- [x] Campos: Inversión, Monto, Tipo (a_pref, a_capital, a_utilidad para DIS)
- [x] FEE generado automáticamente por Wizard (nota informativa)
- [x] DEV requiere justificación/descripción

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002 ✅
- Bloquea a: WIZ-004

## 🧪 Tests Requeridos

- [x] Unit: Validación tipo de distribución — via required select
- [ ] Integration: DIS aplica cascada correctamente — pendiente WIZ-004

---

## 📝 Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **tipoDistribucion:** Select con 3 opciones (a_pref, a_capital, a_utilidad)
- **FEE:** Nota de advertencia que se genera desde Wizard
- **DEV:** Justificación obligatoria con placeholder claro

**Files modified:**

- `MovimientoFormSheet.tsx` — tipoDistribucion, isDis/isDev/isFee flags, conditional UI

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
