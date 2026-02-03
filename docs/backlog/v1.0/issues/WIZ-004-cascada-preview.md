# WIZ-004: CMP-004 CascadaPreview

> **Issue ID:** WIZ-004
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E08-EPIC-WIZARD](../epics/EPIC-WIZARD.md)

## 🎯 Objetivo

Crear componente de preview del cálculo de cascada antes de confirmar, y generar movimientos agrupados.

## User Story

> Como **P-001/P-002**, quiero **ver el desglose antes de confirmar** para **validar que la distribución es correcta**.

**Implementa:** US-035, US-066, US-067

---

## 📚 Referencias

- Wireframe: [SCR-060_wizard_reparto.png](../../wireframes/SCR-060_wizard_reparto.png)
- API Contract: `ejecutarReparto` (07_API_CONTRACTS.md L418-441)
- Business Rules: [BR-025](../../planning/04_BUSINESS_RULES.md#br-025) — Agrupación de movimientos

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Preview de distribución
  Given que calculé una distribución de $500,000 para 5 inversionistas
  When veo el CascadaPreview
  Then veo DataTable con: Inversionista, A Pref, A Capital, A Utilidad, Fee, Total
  And los totales en footer suman $500,000

Scenario: Generar movimientos agrupados
  Given que confirmo la distribución
  When el sistema genera los movimientos
  Then todos comparten el mismo grupo_movimiento (US-035)
  And puedo ver la distribución completa desde cualquier movimiento del grupo
```

- [ ] DataTable: Inversionista, A Pref, A Capital, A Utilidad, Fee, Total
- [ ] Totales en footer (suma = monto distribuido)
- [ ] Badge con método usado (pref_primero/capital_primero)
- [ ] Loading state mientras calcula
- [ ] Botón "Confirmar y Generar Movimientos"
- [ ] Todos los movimientos generados comparten `grupo_movimiento` (BR-025)
- [ ] Toast de éxito con link a lista de movimientos filtrada por grupo

---

**Dependencias:** Bloqueado por WIZ-002, WIZ-003.

## 🧪 Tests Requeridos

- [ ] Unit: Cálculo de totales
- [ ] Integration: Movimientos generados comparten grupo

---

_Creado: 2026-02-03 — Actualizado: Remediación GAP-01_
