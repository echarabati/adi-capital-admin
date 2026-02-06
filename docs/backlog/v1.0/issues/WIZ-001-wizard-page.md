# WIZ-001: Página Wizard multi-step

> **Issue ID:** WIZ-001
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-06)
> **Epic:** [E08-EPIC-WIZARD](../epics/EPIC-WIZARD.md)

## 🎯 Objetivo

Crear página con wizard de 4 pasos para distribución de capital.

**Implementa:** US-063

---

## 📚 Referencias

- Pantalla: [SCR-060](../../planning/09_DESIGN.md#scr-060-wizard-de-reparto)
- Wireframe: [SCR-060_wizard_reparto.png](../../wireframes/SCR-060_wizard_reparto.png)
- Flow: [FLW-002](../../planning/09_DESIGN.md#flw-002-wizard-de-reparto)

---

## ✅ Criterios de Aceptación

- [x] URL: `/wizard`
- [x] CMP-003: WizardStepper visual
- [x] Step 1: Seleccionar proyecto
- [x] Step 2: Ingresar monto total
- [x] Step 3: Preview cálculo (placeholder WIZ-004)
- [x] Step 4: Confirmación
- [x] Al crear DIS: capturar `destino` (a_pref/a_capital/a_utilidad) — ver INFRA-010

---

**Dependencias:** Bloqueado por MOV-007 ✅. Bloquea WIZ-002→004.

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Created wizard page with 4-step flow for capital distribution
- **WizardStepper (CMP-003):** Mobile-first responsive stepper with completed/active/pending states
- **wizard-queries.ts:** RBAC-aware query for projects with active investors
- **Step 3 Preview:** Placeholder for WIZ-004 CascadaPreview component
- **Step 4 Destino:** Uses `destinoEnum` values from INFRA-010 (a_pref/a_capital/a_utilidad)

**Files created:**

- `components/wizard/WizardStepper.tsx` — CMP-003 reusable stepper
- `src/app/(protected)/wizard/layout.tsx` — Wizard layout
- `src/app/(protected)/wizard/page.tsx` — Main wizard page
- `src/app/(protected)/wizard/wizard-queries.ts` — RBAC-filtered project query
- `src/app/(protected)/wizard/WizardContainer.tsx` — Client state management
- `src/app/(protected)/wizard/steps/Step1SelectProject.tsx`
- `src/app/(protected)/wizard/steps/Step2EnterAmount.tsx`
- `src/app/(protected)/wizard/steps/Step3Preview.tsx`
- `src/app/(protected)/wizard/steps/Step4Confirmation.tsx`

**Files modified:**

- `src/config/navigation.ts` — Added Wizard de Reparto link

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
