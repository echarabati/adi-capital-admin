# MOV-005: Form Inversiones Proyecto (INV/INV-D/RET)

> **Issue ID:** MOV-005
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar variante del form para inversiones en el proyecto y retornos.

## User Story

> Como **P-001/P-002**, quiero **registrar inversiones del fondo en proyectos** para **seguimiento de capital desplegado y retornos**.

**Implementa:** US-043, US-044, US-045

---

## 📚 Referencias

- Business Rules: [BR-028](../../planning/04_BUSINESS_RULES.md#br-028) — Validaciones inversión proyecto
- API Contract: `createMovimiento` con concepto INV/RET (07_API_CONTRACTS.md L273-306)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Inversión en proyecto
  Given que selecciono concepto "INV"
  And selecciono proyecto "Marina Tower"
  And ingreso monto $500,000
  When confirmo el movimiento
  Then el proyecto.capital_invertido aumenta $500,000

Scenario: Retorno del proyecto
  Given que el proyecto devuelve $750,000
  And registro concepto "RET"
  When confirmo
  Then proyecto.capital_retornado aumenta $750,000
  And la utilidad del proyecto es $250,000

Scenario: Inversión diferida
  Given que selecciono "INV-D" con fecha futura
  Then el capital no se despliega hasta la fecha programada
```

- [ ] Conceptos: INV (Inversión), INV-D (Inversión Diferida), RET (Retorno)
- [ ] Campos: Proyecto (required), Monto, Fecha
- [ ] RET: debe haber INV previo (validación BR-028)
- [ ] Actualiza métricas de capital_invertido/capital_retornado del proyecto

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002
- Bloquea a: PROJ-004

## 🧪 Tests Requeridos

- [ ] Unit: Validación RET sin INV previo
- [ ] Integration: INV actualiza proyecto

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
