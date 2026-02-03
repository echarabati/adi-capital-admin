# DRIVE-003: CMP-006 CurrencyInput

> **Issue ID:** DRIVE-003
> **Priority:** P1
> **Effort:** S
> **Status:** 📋 Backlog
> **Epic:** [E09-EPIC-INTEGRACIONES](../epics/EPIC-INTEGRACIONES.md)

## 🎯 Objetivo

Crear input de monto con selector de moneda integrado.

## User Story

> Como **P-001/P-002**, quiero **ingresar montos con moneda** para **registrar valores en la moneda correcta**.

---

## 📚 Referencias

- Design: [CMP-006](../../planning/09_DESIGN.md#cmp-006-currencyinput)
- Monedas soportadas: MXN, USD, EUR, ILS (PROPOSAL §4)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Input con formato de miles
  Given que ingreso "1000000"
  Then se muestra formateado como "1,000,000"
  And el valor interno es número 1000000

Scenario: Selector de moneda
  Given que abro el dropdown de moneda
  Then veo opciones: MXN, USD, EUR, ILS
  And cada una muestra símbolo y nombre

Scenario: Valor retornado
  Given que ingreso 50000 y selecciono USD
  When el form serializa
  Then obtiene: { amount: 50000, currency: "USD" }

Scenario: Moneda por defecto
  Given que abro el CurrencyInput sin valor inicial
  Then la moneda por defecto es la moneda_base del fondo activo
```

- [ ] Input numérico con formato (separador miles configurable)
- [ ] Dropdown de moneda: MXN, USD, EUR, ILS con símbolos
- [ ] Valor devuelto: `{ amount: number, currency: string }`
- [ ] Moneda default = moneda_base del fondo
- [ ] Soporta `disabled` y `error` states
- [ ] Usado en MovimientoForm y otros forms

## 🔧 Contexto Técnico

**Props:**

```typescript
interface CurrencyInputProps {
  value?: { amount: number; currency: string };
  onChange: (value: { amount: number; currency: string }) => void;
  defaultCurrency?: string;
  currencies?: string[];
  disabled?: boolean;
  error?: string;
}
```

---

**Dependencias de Issues:**

- Bloqueado por: —
- Bloquea a: MOV-002

## 🧪 Tests Requeridos

- [ ] Unit: Formateo de miles
- [ ] Unit: Cambio de moneda
- [ ] Unit: Valor serializado correcto

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
