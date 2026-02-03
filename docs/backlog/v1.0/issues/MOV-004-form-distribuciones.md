# MOV-004: Form Distribuciones (DIS/DEV/FEE)

> **Issue ID:** MOV-004
> **Priority:** P0
> **Effort:** M
> **Status:** 📋 Backlog
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

```gherkin
Scenario: Distribución reduce saldos
  Given que registro una distribución (DIS) de $30,000 a Juan
  When confirmo el movimiento
  Then el sistema aplica cascada según método del proyecto
  And reduce pref_acumulado o capital según corresponda

Scenario: Devolución de capital
  Given que registro una devolución (DEV) por error de cálculo
  Then el capital_aportado disminuye
  And queda registro del motivo

Scenario: Fee por success
  Given que el Wizard generó un FEE de $5,000
  Then el FEE se muestra como movimiento de comisión
  And se suma a métricas de fees del fondo
```

- [ ] Conceptos soportados: DIS (Distribución), DEV (Devolución), FEE (Success Fee)
- [ ] Campos: Inversión, Monto, Tipo (a_pref, a_capital, a_utilidad para DIS)
- [ ] FEE generado automáticamente por Wizard (no manual)
- [ ] DEV requiere justificación/descripción

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002
- Bloquea a: WIZ-004

## 🧪 Tests Requeridos

- [ ] Unit: Validación tipo de distribución
- [ ] Integration: DIS aplica cascada correctamente

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
