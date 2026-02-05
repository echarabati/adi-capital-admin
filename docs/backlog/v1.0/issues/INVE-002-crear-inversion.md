# INVE-002: Crear inversión con config fees

> **Issue ID:** INVE-002
> **Priority:** P1
> **Effort:** L
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E05-EPIC-INVERSIONES](../epics/EPIC-INVERSIONES.md)

## 🎯 Objetivo

Implementar formulario complejo para crear inversión con configuración de Admin Fee.

## User Story

> Como **P-001/P-002**, quiero **crear inversiones** para **vincular inversionistas con proyectos**.

**Implementa:** US-014, US-015

---

## ✅ Criterios de Aceptación

- [x] Seleccionar inversionista (si viene desde proyecto) o proyecto (si viene desde inversionista)
- [x] Validación: inversionista debe pertenecer al fondo del proyecto (BR-013)
- [x] Código único autogenerado (UUID)
- [x] Campo compromiso requerido
- [x] Config Admin Fee: Tipo (one_time/anual), %, Base, Método, Presentación
- [x] Toast éxito/error

---

**Dependencias:** Bloqueado por INVE-001. Bloquea INVE-003, INVE-005.

---

## Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Resumen:** Implemented form dialog for creating inversiones with Admin Fee configuration
- **Patrón:** Followed `ProyectoFormDialog.tsx` pattern for form dialogs
- **BR-013:** Server-side validation ensures inversionista belongs to proyecto's fondo
- **Admin Fee:** Collapsible section with 4 config fields (Tipo, %, Base, Método)
- **Código:** Uses auto-generated UUID from database

**Files created:**

- `lib/validations/inversiones/inversion-validation.ts` — Zod schema
- `lib/actions/inversiones/inversiones-mutations.ts` — Server actions
- `InversionFormDialog.tsx` — Form dialog component

**Files modified:**

- `inversiones-queries.ts` — Added `getInversionistasByFondo` for dropdown
- `InversionesTable.tsx` — Added create button and dialog integration
- `page.tsx` — Fetches inversionistas for form dropdown

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass
- [x] Tests: N/A (E2E in TEST-002)

---

_Creado: 2026-02-03_
