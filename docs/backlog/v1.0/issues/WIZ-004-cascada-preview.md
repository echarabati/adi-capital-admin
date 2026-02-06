# WIZ-004: CMP-004 CascadaPreview

> **Issue ID:** WIZ-004
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-06)
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

- [x] DataTable: Inversionista, A Pref, A Capital, A Utilidad, Fee, Total
- [x] Totales en footer (suma = monto distribuido)
- [x] Badge con método usado (pref_primero/capital_primero)
- [x] Loading state mientras calcula
- [ ] Botón "Confirmar y Generar Movimientos" — WIZ-005
- [ ] Todos los movimientos generados comparten `grupo_movimiento` (BR-025) — WIZ-005
- [ ] Toast de éxito con link a lista de movimientos filtrada por grupo — WIZ-005

---

**Dependencias:** Bloqueado por WIZ-002 ✅, WIZ-003 ✅.

## 🧪 Tests Requeridos

- [ ] Unit: Cálculo de totales — Pure functions tested in WIZ-002/003
- [ ] Integration: Movimientos generados comparten grupo — WIZ-005

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Created CascadaPreview component with DataTable, footer totals, method badge
- **Pattern:** Uses native HTML table for flexibility
- **Data flow:** WizardContainer fetches inversiones on project selection, passes to Step3Preview
- **Note:** AC5-7 (confirm button, grupo_movimiento, toast) deferred to WIZ-005

**Files created:**

- `components/wizard/CascadaPreview.tsx` — Preview component

**Files modified:**

- `wizard/steps/Step3Preview.tsx` — Real calculation integration
- `wizard/WizardContainer.tsx` — Inversiones data fetching
- `wizard/wizard-queries.ts` — `getInversionesForCascada()`

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
