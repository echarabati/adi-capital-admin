# MOV-010: Form Movimientos Admin (TRA/CAM/ERR/TSI)

> **Issue ID:** MOV-010
> **Priority:** P0
> **Effort:** M
> **Status:** ✅ Done (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

---

## 🎯 Objetivo

Implementar variantes del form de movimiento para operaciones administrativas y correcciones.

## User Story

> Como **P-001/P-002**, quiero **registrar traspasos, cambios de moneda y correcciones** para **mantener contabilidad precisa**.

**Implementa:** US-090 (Tipo de Cambio)

---

## 📚 Referencias

**Business Rules:**

- [BR-029](../../planning/04_BUSINESS_RULES.md#br-029) — Validaciones admin
- [BR-050](../../planning/04_BUSINESS_RULES.md#br-050) — Tipo de cambio

**API Contract:**

- `createMovimiento` con conceptos admin (07_API_CONTRACTS.md L282-306)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Registrar cambio de moneda
  Given que selecciono concepto "CAM"
  And ingreso monto $10,000 USD
  And ingreso tipo de cambio 17.50
  When guardo el movimiento
  Then se calcula monto_moneda_base = $175,000 MXN
  And se guarda el tipo de cambio

Scenario: Traspaso entre cuentas
  Given que selecciono concepto "TRA"
  And selecciono cuenta origen y cuenta destino
  And ingreso monto
  When confirmo
  Then se generan 2 movimientos: salida de origen, entrada a destino

Scenario: Corrección de error
  Given que selecciono concepto "ERR"
  And referencio el movimiento original a corregir
  When confirmo
  Then el movimiento original queda con referencia a corrección
```

- [ ] Conceptos soportados: TRA, CAM, ERR, TSI
- [ ] TRA: requiere cuenta_origen y cuenta_destino (BR-029)
- [ ] CAM: requiere tipo_cambio (obligatorio)
- [ ] ERR: referencia a movimiento_original opcional
- [ ] TSI: transferencia sistema interno
- [ ] Tipo de cambio persiste en campo `tipo_cambio`

## 🔧 Contexto Técnico

**Conceptos:**
| Código | Nombre | Campos Especiales |
|--------|--------|-------------------|
| TRA | Traspaso | cuenta_origen, cuenta_destino |
| CAM | Cambio Moneda | tipo_cambio (required) |
| ERR | Error/Corrección | movimiento_referencia |
| TSI | Transfer Sistema | — |

**Archivos a crear/modificar:**

- `src/components/movimientos/form-admin.tsx`
- Integrar en `MovimientoForm` switch de concepto

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002, FOND-004 (cuentas bancarias)
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Validación tipo cambio para CAM
- [ ] Integration: TRA genera 2 movimientos
- [ ] Integration: CAM calcula monto_moneda_base

## 🚫 Out of Scope

- Integración con API de tipo de cambio (Post-MVP)

---

_Creado: 2026-02-03 — Remediación GAP-03_
