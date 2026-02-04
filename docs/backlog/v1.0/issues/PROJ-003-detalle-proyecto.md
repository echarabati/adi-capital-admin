# PROJ-003: Detalle de proyecto con tabs

> **Issue ID:** PROJ-003
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Done (2026-02-04)
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar página de detalle de proyecto con tabs para Inversiones, Movimientos, Documentos.

## User Story

> Como **P-001/P-002**, quiero **ver el detalle de un proyecto** para **gestionar inversiones y movimientos**.

**Implementa:** US-006, US-007, US-008

---

## 📚 Referencias

- Pantalla: [SCR-021](../../planning/09_DESIGN.md#scr-020021022-proyectos)
- Wireframe: [wireframe](../../wireframes/SCR-021_proyecto_detalle.png)

---

## ✅ Criterios de Aceptación

- [x] URL: `/fondos/[fondoId]/proyectos/[id]`
- [x] Header con nombre, código, badge estado
- [x] Tabs: Overview, Inversiones, Movimientos, Documentos
- [x] Tab Overview: posición financiera (placeholder PROJ-004)
- [x] 404 si no existe o sin acceso

---

**Dependencias de Issues:**

- Bloqueado por: PROJ-002
- Bloquea a: PROJ-004, INVE-001

---

## Implementation Notes

**Completed:** 2026-02-04

**Context & Decisions:**

- Followed `FondoLayout` pattern for consistency
- Overview shows stats grid + project info
- Three placeholder tabs for future issues

**Files created:**

- `lib/actions/proyectos/proyectos-queries.ts` — Added `getProyectoById`
- `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/layout.tsx` — Header + tabs
- `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/page.tsx` — Overview tab
- `.../inversiones/page.tsx`, `.../movimientos/page.tsx`, `.../documentos/page.tsx` — Placeholders

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03_
