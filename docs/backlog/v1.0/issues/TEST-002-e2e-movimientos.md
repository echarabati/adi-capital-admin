# TEST-002: E2E Movimientos Flow

> **Issue ID:** TEST-002
> **Priority:** P0
> **Effort:** M (3 pts)
> **Status:** ✅ Done (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Validar flujo completo de registro, confirmación y cancelación de movimientos.

## Tipo de Issue

> **QA Issue** — Ejecutar después de completar E06 (MOVIMIENTOS)

---

## 📚 Referencias

- Business Rules: [BR-020→029](../../planning/04_BUSINESS_RULES.md#br-020)
- Flow: [FLW-001](../../planning/09_DESIGN.md#flw-001-registro-de-movimiento)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Crear movimiento APO
  Given que estoy en /movimientos/nuevo
  And selecciono concepto "APO"
  And selecciono inversionista "Juan"
  And selecciono inversión "Marina Tower"
  And ingreso monto $50,000
  When guardo el movimiento
  Then el movimiento se crea en estado "borrador"
  And capital_aportado NO cambia todavía

Scenario: Confirmar movimiento actualiza saldos
  Given que tengo un movimiento APO en borrador por $50,000
  When confirmo el movimiento
  Then el estado cambia a "confirmado"
  And capital_aportado del inversionista aumenta $50,000
  And saldo_compromiso disminuye $50,000

Scenario: Cancelar movimiento revierte saldos
  Given que tengo un movimiento APO confirmado por $30,000
  And capital_aportado = $80,000
  When cancelo el movimiento
  Then capital_aportado = $50,000 (resta $30k)
  And el movimiento queda en estado "cancelado"

Scenario: Validación de campos requeridos
  Given que estoy creando un movimiento DIS
  When no selecciono inversionista
  Then el sistema muestra error "Inversionista requerido"
  And no se puede guardar

Scenario: Filtros en lista de movimientos
  Given que hay movimientos de diferentes conceptos
  When filtro por concepto "APO"
  Then solo veo movimientos de tipo APO
```

- [ ] Crear movimiento de cada tipo (APO, DIS, INV, etc.)
- [ ] Confirmar actualiza campos calculados
- [ ] Cancelar revierte cambios
- [ ] Filtros funcionan correctamente
- [ ] Validaciones por concepto funcionan

---

## 🔧 Contexto Técnico

**Test Files:**

- `tests/e2e/movimientos.spec.ts`

**Setup:**

- Seed: fondo, proyecto, inversionista, inversión
- Usuario Super Admin

**Commands:**

```bash
pnpm test:e2e tests/e2e/movimientos.spec.ts
```

---

**Dependencias de Issues:**

- Bloqueado por: MOV-001 → MOV-010
- Bloquea a: — (pero requerido para /audit R2 de E06)

---

_Creado: 2026-02-03 — QE Strategy_
