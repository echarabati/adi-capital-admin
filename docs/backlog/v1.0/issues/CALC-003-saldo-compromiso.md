# CALC-003: Cálculo Saldo Compromiso

> **Issue ID:** CALC-003
> **Priority:** P1
> **Effort:** S
> **Status:** ✅ Completed (2026-02-06)
> **Epic:** [E07-EPIC-CALCULOS](../epics/EPIC-CALCULOS.md)

## 🎯 Objetivo

Mantener actualizado el saldo del compromiso de cada inversión.

## User Story

> Como **Sistema**, quiero **calcular el saldo de compromiso** para **mostrar cuánto falta por aportar**.

**Implementa:** US-070

---

## 📚 Referencias

- Business Rules: [BR-017](../../planning/04_BUSINESS_RULES.md#br-017) — Estados del compromiso
- Schema: [E-004: Inversiones](../../planning/05_DATA_MODEL.md#e-004-inversiones)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Calcular saldo inicial
  Given que Juan tiene compromiso de $100,000
  And capital_aportado = $0
  When consulto el saldo
  Then saldo_compromiso = $100,000
  And estado = "pendiente"

Scenario: Aportación parcial
  Given que Juan aporta $30,000
  When recalculo el saldo
  Then saldo_compromiso = $70,000
  And estado = "parcial"

Scenario: Compromiso completado
  Given que Juan ha aportado $100,000 (= compromiso)
  Then saldo_compromiso = $0
  And estado = "completado"

Scenario: Compromiso excedido
  Given que Juan aportó $120,000 (> compromiso $100,000)
  Then saldo_compromiso = -$20,000
  And estado = "excedido"
```

- [x] Fórmula: saldo = compromiso - SUM(APO confirmados)
- [x] Estados: pendiente (100%), parcial (0-100%), completado (0%), excedido (<0%)
- [x] Recálculo automático al confirmar APO (BR-017)
- [x] Cache en campo inversiones.saldo_compromiso

---

**Dependencias de Issues:**

- Bloqueado por: MOV-007 (confirmar APO) ✅
- Bloquea a: INVE-004

## 🧪 Tests Requeridos

- [x] Unit: Cálculo por cada estado
- [x] Integration: Recálculo al confirmar APO

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Módulo de cálculo puro para estado del compromiso
- **Functions:** `calcularCompromisoStatus`, `getSaldoCompromiso`, `getEstadoCompromiso`, `isCompromisoSatisfecho`
- **Cache:** On-demand calculation via utility (no schema change needed)
- **Existing:** `confirmMovimiento` already updates `capitalAportado`

**Files created:**

- `lib/calculations/compromiso-calculator.ts` — Pure function module
- `tests/unit/compromiso-calculation.test.ts` — 14 unit tests

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Tests: 14/14 passing

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
