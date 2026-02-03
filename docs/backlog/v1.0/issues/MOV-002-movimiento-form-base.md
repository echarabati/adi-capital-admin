# MOV-002: CMP-002 MovimientoForm base

> **Issue ID:** MOV-002
> **Priority:** P0
> **Effort:** L
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Crear componente base de formulario de movimiento que se adapta según el concepto seleccionado, con soporte multi-moneda.

## User Story

> Como **P-001/P-002**, quiero **registrar movimientos de diferentes tipos** para **llevar contabilidad del fondo**.

**Implementa:** US-030, US-090

---

## 📚 Referencias

- Pantalla: [SCR-051](../../planning/09_DESIGN.md#scr-050051052-movimientos)
- Wireframe: [SCR-051_movimiento_form.png](../../wireframes/SCR-051_movimiento_form.png)
- Business Rules: [BR-020→029](../../planning/04_BUSINESS_RULES.md), [BR-050](../../planning/04_BUSINESS_RULES.md#br-050)
- API Contract: `createMovimiento` (07_API_CONTRACTS.md L273-306)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Seleccionar concepto de movimiento
  Given que abro el form de nuevo movimiento
  Then veo CMP-011 ConceptoSelector con 18 conceptos organizados por categoría
  And puedo filtrar por categoría (Inversionistas, Proyectos, Gastos, Socios, Admin)

Scenario: Registrar monto en moneda diferente a base
  Given que el fondo tiene moneda base USD
  And registro un movimiento en MXN por $175,000
  When ingreso tipo de cambio 17.50
  Then el sistema calcula monto_moneda_base = $10,000 USD (US-090)

Scenario: Guardar como borrador
  Given que completo los campos requeridos
  When hago click en "Guardar Borrador"
  Then el movimiento se guarda con estado = 'borrador'
  And puedo editarlo antes de confirmar
```

- [ ] Sheet lateral para form de movimiento
- [ ] Step 1: CMP-011 ConceptoSelector (grid de badges por categoría)
- [ ] Step 2: Campos dinámicos según concepto
- [ ] Campos base: Monto (CMP-006), Fecha, Descripción
- [ ] Campo tipo_cambio visible si moneda ≠ moneda_base_fondo (US-090)
- [ ] Cálculo automático: monto_moneda_base = monto / tipo_cambio
- [ ] Validación con Zod
- [ ] Guardar como borrador

---

**Dependencias de Issues:**

- Bloqueado por: MOV-001, DRIVE-003
- Bloquea a: MOV-003→010

## 🧪 Tests Requeridos

- [ ] Unit: Validación por concepto
- [ ] Unit: Cálculo tipo de cambio
- [ ] Integration: Crear borrador exitoso

---

_Creado: 2026-02-03 — Actualizado: Remediación US-090_
