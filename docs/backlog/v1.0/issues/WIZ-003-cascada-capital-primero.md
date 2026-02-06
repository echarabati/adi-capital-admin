# WIZ-003: Cálculo cascada capital_primero

> **Issue ID:** WIZ-003
> **Priority:** P1
> **Effort:** L
> **Status:** ✅ Completed (2026-02-06)
> **Epic:** [E08-EPIC-WIZARD](../epics/EPIC-WIZARD.md)

## 🎯 Objetivo

Implementar lógica de cascada "Capital Primero" (método Kentucky).

**Implementa:** US-065, BR-037

---

## ✅ Criterios de Aceptación

- [x] Orden: 1) Devolver capital, 2) Pagar Pref (sobre capital reducido), 3) Utilidad
- [x] Recálculo de Pref sobre nuevo capital base
- [x] Generar array de distribuciones
- [x] Incluir Success Fee

---

**Dependencias:** Bloqueado por WIZ-001 ✅, CALC-002 ✅. Bloquea WIZ-004.

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Capital Primero waterfall: Capital → Pref → Utilidad
- **Pattern:** Reuses types from `cascada-pref-primero.ts`
- **Key difference:** Pref calculated on reduced capital after returns
- **Integration:** Uses `calcularSuccessFeeCascada()` for utility fees

**Files created:**

- `lib/calculations/cascada-capital-primero.ts` — Capital Primero logic
- `tests/unit/cascada-capital-primero.test.ts` — 11 unit tests

**Files modified:**

- `lib/calculations/cascada-pref-primero.ts` — Updated `CascadaResult.meta.metodoCascada` type

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Tests: 11/11 passing

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
