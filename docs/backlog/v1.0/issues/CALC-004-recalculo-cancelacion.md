# CALC-004: Recálculo al cancelar movimiento

> **Issue ID:** CALC-004
> **Priority:** P1
> **Effort:** S
> **Status:** 📋 Backlog
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

- [ ] Revertir capital_aportado para APO/APO-D
- [ ] Revertir pref_pagado para DIS a pref
- [ ] Revertir capital para DIS a capital
- [ ] Marcar movimiento como estado = "cancelado" (no delete)
- [ ] Registro en audit_log

---

**Dependencias de Issues:**

- Bloqueado por: MOV-007
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Reversión por tipo de movimiento
- [ ] Integration: Cancelar APO actualiza inversión

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
