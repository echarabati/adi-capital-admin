# WIZ-002: Cálculo cascada pref_primero

> **Issue ID:** WIZ-002
> **Priority:** P1
> **Effort:** L
> **Status:** ✅ Completed (2026-02-06)
> **Epic:** [E08-EPIC-WIZARD](../epics/EPIC-WIZARD.md)

## 🎯 Objetivo

Implementar lógica de cascada "Pref Primero" (método Adi Capital).

**Implementa:** US-064, BR-036

---

## ✅ Criterios de Aceptación

- [x] Orden: 1) Pagar Pref pendiente, 2) Devolver capital, 3) Utilidad
- [x] Calcular para cada inversión del proyecto
- [x] Generar array de distribuciones por inversionista
- [x] Incluir Success Fee si hay utilidad (CALC-002)

---

**Dependencias:** Bloqueado por WIZ-001 ✅, CALC-002 ✅. Bloquea WIZ-004.

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Pure calculation module for Pref Primero waterfall distribution
- **Pattern:** Follows `success-fee.ts` pattern (pure functions, no DB deps)
- **Waterfall:** Pref → Capital → Utilidad, proportional by participation
- **Integration:** Uses `calcularSuccessFeeCascada()` for utility fees

**Files created:**

- `lib/calculations/cascada-pref-primero.ts` — Types + main function
- `tests/unit/cascada-pref-primero.test.ts` — 12 unit tests

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Tests: 12/12 passing

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
