# INVE-004: Compromiso Progress Bar

> **Issue ID:** INVE-004
> **Priority:** P2
> **Effort:** S
> **Status:** 📋 Backlog
> **Epic:** [E05-EPIC-INVERSIONES](../epics/EPIC-INVERSIONES.md)

## 🎯 Objetivo

Mostrar visualmente el progreso del compromiso de inversión.

## User Story

> Como **P-001/P-002**, quiero **ver el progreso visual del compromiso** para **identificar rápidamente el estado de cada inversión**.

**Implementa:** US-016

---

## 📚 Referencias

- Business Rules: [BR-017](../../planning/04_BUSINESS_RULES.md#br-017) — Estados del compromiso
- Design: [SCR-040](../../planning/09_DESIGN.md#scr-040-inversiones)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Compromiso pendiente
  Given que inversión tiene compromiso $100,000 y aportado $0
  Then progress bar muestra 0%
  And color es gris
  And badge muestra "Pendiente"

Scenario: Compromiso parcial
  Given que aportado = $60,000 de $100,000
  Then progress bar muestra 60%
  And color es azul
  And badge muestra "Parcial"

Scenario: Compromiso completado
  Given que aportado = $100,000 = compromiso
  Then progress bar muestra 100%
  And color es verde
  And badge muestra "Completado"

Scenario: Compromiso excedido
  Given que aportado = $120,000 > compromiso $100,000
  Then progress bar muestra 100% con indicador de exceso
  And color es amarillo con icono warning
  And badge muestra "Excedido +$20k"
```

- [ ] Progress bar con porcentaje visual
- [ ] Colores: gris (0%), azul (1-99%), verde (100%), amarillo (>100%)
- [ ] Badge con estado textual
- [ ] Tooltip con montos exactos: "Aportado: $X / Compromiso: $Y"
- [ ] Indicador de monto excedido si aplica

---

**Dependencias de Issues:**

- Bloqueado por: CALC-003
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Render por cada estado
- [ ] Unit: Cálculo porcentaje correcto

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
