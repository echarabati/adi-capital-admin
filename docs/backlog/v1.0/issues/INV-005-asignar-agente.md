# INV-005: Asignar agente

> **Issue ID:** INV-005
> **Priority:** P3
> **Effort:** XS
> **Status:** 📋 Backlog
> **Epic:** [E04-EPIC-INVERSIONISTAS](../epics/EPIC-INVERSIONISTAS.md)

---

## 🎯 Objetivo

Permitir asignar agente de ventas a inversionista.

## User Story

> Como **P-001/P-002**, quiero **asignar un agente** para **tracking de referidos y comisiones futuras**.

**Implementa:** US-013

---

## 📚 Referencias

- Design: [SCR-030](../../planning/09_DESIGN.md#scr-030-inversionistas)
- Schema: [E-003: Inversionistas](../../planning/05_DATA_MODEL.md#e-003-inversionistas)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Asignar agente a inversionista
  Given que edito el inversionista Juan
  And ingreso agente_email = "carlos@agenteventas.com"
  When guardo
  Then el campo agente_id se actualiza
  And aparece en el detalle del inversionista

Scenario: Cambiar agente
  Given que Juan tiene agente Carlos asignado
  When cambio el agente a María
  Then el nuevo agente es María
  And Carlos ya no aparece vinculado

Scenario: Campo opcional
  Given que creo un inversionista sin agente
  Then el inversionista se crea correctamente
  And agente_id = null
```

- [ ] Campo agente_email en form de inversionista
- [ ] Campo opcional (nullable)
- [ ] Lookup/autocomplete de usuarios con rol agente (si existen)
- [ ] Visible en detalle del inversionista como "Referido por: [Agente]"
- [ ] Nota: Cálculo de comisiones es Post-MVP

---

**Dependencias de Issues:**

- Bloqueado por: INV-002
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Form guarda con y sin agente
- [ ] Integration: Agente aparece en detalle

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
