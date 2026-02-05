# INVE-003: Detalle de inversión

> **Issue ID:** INVE-003
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E05-EPIC-INVERSIONES](../epics/EPIC-INVERSIONES.md)

## 🎯 Objetivo

Mostrar detalle de inversión con estado del compromiso, Pref acumulado y tabs.

## User Story

> Como **P-001/P-002**, quiero **ver el detalle de una inversión** para **monitorear su estado**.

**Implementa:** US-016

---

## ✅ Criterios de Aceptación

- [x] URL: `/inversiones/[id]`
- [x] Header: Código, inversionista, proyecto
- [x] Cards: Compromiso, Capital Aportado, Pref Acumulado, Pref Pagado
- [x] Tabs: Overview, Movimientos, Calendario
- [x] CMP-009 CompromisoProgress (placeholder para INVE-004)

---

**Dependencias:** Bloqueado por INVE-002. Bloquea INVE-004, INVE-005, MOV-001.

---

## Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Resumen:** Created full detail page for inversiones with tabbed navigation
- **Patrón:** Followed `inversionistas/[id]/layout.tsx` pattern for layout
- **Stats:** 4 cards showing Compromiso, Aportado, Pref Acumulado, Pref Pagado
- **Tabs:** Resumen (overview), Movimientos (placeholder), Calendario (placeholder)

**Files created:**

- `src/app/(protected)/inversiones/[id]/layout.tsx` — Header, cards, tabs
- `src/app/(protected)/inversiones/[id]/page.tsx` — Overview with config display
- `src/app/(protected)/inversiones/[id]/movimientos/page.tsx` — Placeholder
- `src/app/(protected)/inversiones/[id]/calendario/page.tsx` — Placeholder

**Files modified:**

- `lib/actions/inversiones/inversiones-queries.ts` — Added `InversionDetail` type and `getInversionById`

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass
- [x] Tests: N/A (E2E in TEST-002)

---

_Creado: 2026-02-03_
