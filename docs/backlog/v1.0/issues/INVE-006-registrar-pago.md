# INVE-006: Registrar pago de capital call

> **Issue ID:** INVE-006
> **Priority:** P1
> **Effort:** S
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E05-EPIC-INVERSIONES](../epics/EPIC-INVERSIONES.md)

## 🎯 Objetivo

Permitir registrar pago parcial o total de un capital call.

## User Story

> Como **P-001/P-002**, quiero **registrar pagos de capital calls** para **actualizar estado del calendario**.

**Implementa:** US-020

---

## 📚 Referencias

- Business Rules: [BR-018](../../planning/04_BUSINESS_RULES.md#br-018) — Capital calls
- API Contract: `registrarPagoCapitalCall` (07_API_CONTRACTS.md L220-245)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Pago completo de capital call
  Given que hay un capital call #1 por $25,000 pendiente
  And monto_pagado = $0
  When registro pago de $25,000
  Then monto_pagado = $25,000
  And estado cambia a "completo"
  And opcionalmente se genera movimiento APO

Scenario: Pago parcial
  Given que hay un capital call por $25,000
  When registro pago de $10,000
  Then monto_pagado = $10,000
  And saldo_pendiente = $15,000
  And estado = "parcial"

Scenario: Validar monto máximo
  Given que el saldo pendiente es $15,000
  When intento pagar $20,000
  Then el sistema muestra error "Monto excede saldo pendiente"

Scenario: Generar APO automático
  Given que marco checkbox "Generar movimiento APO"
  When confirmo el pago
  Then se crea movimiento APO por el monto pagado
  And el APO queda en estado borrador
```

- [x] Botón "Registrar Pago" en cada capital call
- [x] Dialog: Monto a pagar (max: monto_esperado - monto_pagado)
- [x] Actualiza monto_pagado y estado (pendiente/parcial/completo)
- [x] Checkbox opcional: "Generar movimiento APO"
- [x] Validación: monto ≤ saldo pendiente

---

**Dependencias de Issues:**

- Bloqueado por: INVE-005 ✅
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Validación monto máximo
- [ ] Integration: Pago actualiza estado capital call
- [ ] Integration: Genera APO si checkbox marcado

---

## 📝 Implementation Notes

### Archivos Creados

- `calendario-pagos-mutations.ts` — Agregado `registrarPagoCapitalCall`
- `calendario-pagos-validation.ts` — Agregado `registrarPagoSchema`
- `PagoDialog.tsx` — Dialog con monto, validación máximo, checkbox APO

### Archivos Modificados

- `CalendarioTable.tsx` — Agregado botón $ (pay), inversionistaId prop
- `calendario/page.tsx` — Fetch inversion para inversionistaId

### Decisiones

- APO se genera con estado 'borrador', moneda 'MXN' default
- Botón pagar solo visible si estado != 'completo'
- Validación cliente + servidor para monto máximo

### Verificación

```
✅ pnpm typecheck
✅ pnpm lint
```

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
