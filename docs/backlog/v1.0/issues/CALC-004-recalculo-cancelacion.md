# CALC-004: Recálculo al cancelar movimiento

> **Issue ID:** CALC-004
> **Priority:** P1
> **Effort:** S
> **Status:** ✅ Completed (2026-02-06)
> **Epic:** [E07-EPIC-CALCULOS](../epics/EPIC-CALCULOS.md)

## 🎯 Objetivo

Revertir cálculos cuando se cancela un movimiento confirmado.

## User Story

> Como **Sistema**, quiero **revertir saldos al cancelar un movimiento** para **mantener consistencia de datos**.

**Implementa:** BR-024

---

## 📚 Referencias

- Business Rules: [BR-024](../../planning/04_BUSINESS_RULES.md#br-024) — Cancelación es reversión lógica
- API Contract: `cancelarMovimiento` (07_API_CONTRACTS.md L340-365)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Cancelar APO revierte capital
  Given que Juan tiene capital_aportado = $80,000
  And hay un movimiento APO confirmado por $30,000
  When cancelo ese movimiento
  Then capital_aportado = $50,000 (resta $30k)
  And el movimiento queda con estado = "cancelado"
  And el movimiento original mantiene su historial

Scenario: Cancelar DIS revierte saldos
  Given que Juan recibió distribución DIS de $20,000
  And su pref_pagado = $20,000
  When cancelo la distribución
  Then pref_pagado = $0
  And pref_acumulado restaura valor previo

Scenario: Cancelar genera registro de auditoría
  Given que cancelo cualquier movimiento
  Then se registra en audit_log: who, when, motivo
```

- [x] Revertir capital_aportado para APO/APO-D
- [x] Revertir pref_pagado para DIS a pref (utility ready, awaits `destino` field)
- [x] Revertir capital para DIS a capital (utility ready, awaits `destino` field)
- [x] Marcar movimiento como estado = "cancelado" (no delete)
- [ ] Registro en audit_log → [INFRA-010](./INFRA-010-schema-gaps.md)

---

**Dependencias de Issues:**

- Bloqueado por: MOV-007 ✅
- Bloquea a: —
- Follow-up: [INFRA-010](./INFRA-010-schema-gaps.md) (destino field, audit_log)

## 🧪 Tests Requeridos

- [x] Unit: Reversión por tipo de movimiento
- [ ] Integration: Cancelar APO actualiza inversión (requires E2E)

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Módulo de cálculo para deltas de reversión + integración en cancelMovimiento
- **Functions:** `calcularReversal`, `requiresReversal`, `getReversalDescription`
- **Partial:** DIS reversals need `destino` field in movimientos schema (tracked in INFRA-010)
- **APO/DEV:** Fully functional - reverts capitalAportado correctly

**Files created:**

- `lib/calculations/reversal-calculator.ts` — Pure function module
- `tests/unit/reversal-calculation.test.ts` — 16 unit tests

**Files modified:**

- `lib/actions/movimientos/movimientos-mutations.ts` — Enhanced cancelMovimiento

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Tests: 16/16 passing

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
