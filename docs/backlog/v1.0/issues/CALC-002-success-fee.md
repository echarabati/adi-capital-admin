# CALC-002: Cálculo Success Fee

> **Issue ID:** CALC-002
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-06)
> **Epic:** [E07-EPIC-CALCULOS](../epics/EPIC-CALCULOS.md)

## 🎯 Objetivo

Calcular Success Fee automáticamente cuando hay distribución de utilidades.

## User Story

> Como **Sistema**, quiero **calcular el Success Fee sobre utilidades** para **que el fondo cobre su comisión de éxito**.

**Implementa:** US-068, US-069

---

## 📚 Referencias

- Business Rules: [BR-040](../../planning/04_BUSINESS_RULES.md#br-040) — Cálculo Success Fee
- API Contract: Función interna `calcularSuccessFee` usada por Wizard

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Distribución con utilidad positiva
  Given que el proyecto tiene success_fee_pct = 20%
  And Juan invirtió $100,000
  And recibe distribución total de $150,000
  When el Wizard calcula el reparto
  Then la utilidad de Juan es $50,000 (150k - 100k)
  And el Success Fee es $10,000 (50k × 20%)
  And se genera movimiento FEE por $10,000

Scenario: Distribución sin utilidad
  Given que el proyecto tiene success_fee_pct = 20%
  And Juan invirtió $100,000
  And recibe distribución de $80,000 (pérdida)
  When el Wizard calcula el reparto
  Then NO se genera Success Fee (utilidad negativa)

Scenario: Solo aplica sobre utilidades
  Given que la distribución incluye $30k a Pref, $70k a Capital, $20k a Utilidad
  Then el Success Fee solo aplica sobre los $20k de utilidad
  And Fee = $20,000 × 20% = $4,000
```

- [x] Fórmula: utilidad = distribución - capital_invertido; fee = max(0, utilidad × %)
- [x] Solo aplica sobre utilidades (no sobre Pref ni capital devuelto)
- [x] Genera movimiento FEE automático vinculado al grupo_movimiento
- [x] Usado exclusivamente por Wizard de Reparto (no manual)

---

**Dependencias de Issues:**

- Bloqueado por: MOV-004 (concepto FEE) ✅
- Bloquea a: WIZ-002, WIZ-003

## 🧪 Tests Requeridos

- [x] Unit: Cálculo con utilidad positiva
- [x] Unit: Cálculo con utilidad negativa (= $0)
- [x] Unit: Cálculo solo sobre porción utilidad

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Módulo de cálculo puro sin dependencias de DB para Success Fee
- **Functions:** `calcularSuccessFee`, `calcularSuccessFeeCascada`, `getEffectiveSuccessFeePct`
- **Priority:** inversion.successFeePct > proyecto.successFeePct > fondo.successFeeDefault
- **Default:** 20% when no configuration exists

**Files created:**

- `lib/calculations/success-fee.ts` — Pure function module
- `tests/unit/success-fee-calculation.test.ts` — 18 unit tests

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Tests: 18/18 passing

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
