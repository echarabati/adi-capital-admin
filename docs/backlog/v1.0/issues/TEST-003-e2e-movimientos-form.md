# TEST-003: E2E Movimientos Form & Filters

> **Issue ID:** TEST-003
> **Priority:** P1
> **Effort:** M (3 pts)
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Completar cobertura E2E de movimientos: creación via form y filtros.

## Tipo de Issue

> **QA Issue** — Follow-up de TEST-002

---

## 📚 Referencias

- Parent: [TEST-002](./TEST-002-e2e-movimientos.md)
- Flow: [FLW-001](../../planning/09_DESIGN.md#flw-001-registro-de-movimiento)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Crear movimiento APO via form
  Given fixtures con fondo, proyecto, inversionista e inversión
  And estoy en /movimientos
  When click "Nuevo Movimiento"
  And selecciono concepto "APO"
  And selecciono inversión del fixture
  And lleno monto y fecha
  And guardo
  Then movimiento se crea en estado "borrador"

Scenario: Validación de campos requeridos
  Given estoy creando un movimiento DIS
  When no selecciono inversionista
  Then el sistema muestra error
  And no se puede guardar

Scenario: Filtros en lista de movimientos
  Given hay movimientos de diferentes conceptos
  When filtro por concepto "APO"
  Then solo veo movimientos de tipo APO
```

---

## 🔧 Contexto Técnico

**Blocker conocido:**

- `InversionSelector` requiere fixtures con relaciones correctas:
  - Inversión → Proyecto → Fondo (mismo fondo seleccionado)
  - Query usa `proyectos.fondoId = selectedFondoId`

**Approach sugerido:**

1. Investigar `getInversionesForSelector` query
2. Ajustar fixtures para crear relaciones correctas
3. O: Mock response de server action en test

---

**Dependencias:**

- Bloqueado por: TEST-002 ✅

---

_Creado: 2026-02-05 — Follow-up de QC_
