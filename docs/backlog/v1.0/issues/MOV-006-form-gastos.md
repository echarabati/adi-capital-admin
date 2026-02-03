# MOV-006: Form Gastos (GAS/GASP)

> **Issue ID:** MOV-006
> **Priority:** P1
> **Effort:** S
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar variante del form para gastos generales y de proyecto.

## User Story

> Como **P-001/P-002**, quiero **registrar gastos del fondo y proyectos** para **llevar control de costos**.

**Implementa:** US-047, US-048

---

## 📚 Referencias

- Business Rules: [BR-028](../../planning/04_BUSINESS_RULES.md#br-028) — GASP requiere proyecto
- API Contract: `createMovimiento` con concepto GAS/GASP (07_API_CONTRACTS.md L273-306)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Gasto general del fondo
  Given que selecciono concepto "GAS" (Gasto General)
  And ingreso monto $5,000 y descripción "Auditoría anual"
  When confirmo
  Then se registra como gasto a nivel fondo
  And aparece en métricas de gastos_fondo

Scenario: Gasto de proyecto específico
  Given que selecciono concepto "GASP" (Gasto Proyecto)
  When no selecciono un proyecto
  Then el sistema muestra error "GASP requiere proyecto" (BR-028)

Scenario: GASP válido
  Given que selecciono GASP y proyecto "Marina Tower"
  And ingreso $10,000 por "Due diligence"
  When confirmo
  Then aparece en gastos del proyecto específico
```

- [ ] Conceptos: GAS (Gasto General), GASP (Gasto Proyecto)
- [ ] Campos: Monto, Descripción (required), Fecha
- [ ] GASP requiere campo Proyecto adicional (BR-028)
- [ ] Actualiza gastos_fondo o gastos_proyecto según concepto

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Validación GASP sin proyecto
- [ ] Integration: GAS suma a métricas fondo

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
