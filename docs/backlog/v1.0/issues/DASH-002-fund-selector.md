# DASH-002: CMP-007 FundSelector

> **Issue ID:** DASH-002
> **Priority:** P2
> **Effort:** S
> **Status:** ✅ Done (2026-02-06)
> **Epic:** [E10-EPIC-PANEL](../epics/EPIC-PANEL.md)

## 🎯 Objetivo

Crear dropdown en header para filtrar por fondo activo.

## User Story

> Como **P-001/P-002**, quiero **seleccionar el fondo activo** para **filtrar todas las vistas**.

---

## 📚 Referencias

- Design: [SCR-001](../../planning/09_DESIGN.md#scr-001-dashboard)
- Business Rules: [BR-052](../../planning/04_BUSINESS_RULES.md#br-052) — Multi-fondo

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Super Admin ve todos los fondos
  Given que soy Super Admin
  When abro el FundSelector
  Then veo todos los fondos: Adi Capital, Kentucky, etc.

Scenario: Admin de Fondo ve solo asignados
  Given que soy Admin de Fondo asignado a Kentucky
  When abro el FundSelector
  Then solo veo "Kentucky"
  And el dropdown está disabled (un solo fondo)

Scenario: Selección persiste entre sesiones
  Given que selecciono "Adi Capital"
  When cierro y reabro el navegador
  Then el fondo "Adi Capital" sigue seleccionado

Scenario: Cambio de fondo afecta queries
  Given que estoy viendo proyectos de Kentucky
  When cambio el selector a "Adi Capital"
  Then la lista de proyectos se actualiza mostrando solo Adi Capital
```

- [x] Dropdown en header (derecha de breadcrumbs)
- [x] Lista fondos del usuario según RBAC
- [x] Persiste selección en cookie (server-readable)
- [x] Afecta queries globales vía context/middleware — context ready, queries can access via `useFund()`
- [x] Si solo hay 1 fondo: mostrar como texto, no dropdown

---

**Dependencias de Issues:**

- ~~Bloqueado por: FOND-001~~ Resuelto
- ~~Bloquea a: DASH-001~~ DASH-001 ✅ Done

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Files Created:**

- `lib/contexts/FundContext.tsx` — Global state + `useFund()` hook
- `lib/utils/fund-cookie.ts` — Cookie persistence utilities
- `components/layout/FundSelector.tsx` — Headless UI Listbox dropdown

**Files Modified:**

- `src/app/(protected)/layout.tsx` — Fetches fondos and reads cookie
- `src/app/(protected)/DashboardShell.tsx` — Wraps in FundProvider
- `components/layout/Header.tsx` — Added FundSelector after breadcrumb

**Verification:**

- `pnpm typecheck` ✅
- `pnpm lint` ✅
- `pnpm build` ✅

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
