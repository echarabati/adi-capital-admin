# MOV-003: Form Aportaciones (APO/APO-D)

> **Issue ID:** MOV-003
> **Priority:** P0
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar variante del form para aportaciones de capital.

## User Story

> Como **P-001/P-002**, quiero **registrar aportaciones de inversionistas** para **aumentar el capital del proyecto**.

**Implementa:** US-036, US-037, US-038

---

## 📚 Referencias

- Business Rules: [BR-026](../../planning/04_BUSINESS_RULES.md#br-026) — Validaciones aportaciones
- API Contract: `createMovimiento` con concepto APO/APO-D (07_API_CONTRACTS.md L273-306)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Registrar aportación
  Given que selecciono concepto "APO"
  And selecciono la inversión de Juan en Marina Tower
  And ingreso monto $50,000
  When guardo el movimiento
  Then el movimiento se crea en estado borrador
  And el capital_aportado NO aumenta todavía

Scenario: Confirmar aportación actualiza saldo
  Given que confirmo el movimiento APO de $50,000
  Then el capital_aportado del inversionista aumenta $50,000
  And el saldo_compromiso disminuye $50,000

Scenario: Aportación diferida
  Given que selecciono "APO-D" (Aportación Diferida)
  And ingreso fecha futura de efectivización
  When confirmo
  Then el capital no aumenta hasta la fecha programada
```

- [ ] Conceptos soportados: APO (Aportación), APO-D (Aportación Diferida)
- [ ] Campos requeridos: Inversión, Monto, Fecha
- [ ] Selector de inversión filtra por proyecto/inversionista
- [ ] Actualiza capital_aportado al confirmar (BR-026)
- [ ] Para APO-D: campo fecha_efectiva adicional

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Validación monto positivo
- [ ] Integration: Confirmar APO actualiza capital

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
