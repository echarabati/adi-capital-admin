# PROJ-001: Lista de proyectos

> **Issue ID:** PROJ-001
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Done (2026-02-04)
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar lista de proyectos por fondo con filtros y navegación a detalle.

## User Story

> Como **P-001/P-002**, quiero **ver los proyectos de un fondo** para **gestionarlos**.

**Implementa:** US-006

---

## 📚 Referencias

- Pantalla: [SCR-020](../../planning/09_DESIGN.md#scr-020021022-proyectos)
- Schema: [E-002](../../planning/05_DATA_MODEL.md#e-002-proyectos)

---

## ✅ Criterios de Aceptación

- [x] URL: `/fondos/[fondoId]/proyectos`
- [x] DataTable con: Código, Nombre, Estado, Tasa Pref, Inversionistas (count)
- [x] Filtro por estado (Abierto/Cerrado/Concluido)
- [x] Filtro por nombre/código
- [x] Badge coloreado por estado
- [x] Click navega a `/fondos/[fondoId]/proyectos/[id]`

---

**Dependencias de Issues:**

- Bloqueado por: FOND-003
- Bloquea a: PROJ-002, PROJ-003

---

## Implementation Notes

**Completed:** 2026-02-04

**Context & Decisions:**

- Followed existing `CuentasBancariasTable` pattern for consistency
- Used subquery for investor count to avoid N+1 queries
- Estado badge colors: activo=green, cerrado=gray, en_desarrollo=blue

**Files created:**

- `lib/actions/proyectos/proyectos-queries.ts` — Server query with RBAC
- `src/app/(protected)/fondos/[id]/proyectos/ProyectosTable.tsx` — Client table component

**Files modified:**

- `src/app/(protected)/fondos/[id]/proyectos/page.tsx` — Server component

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03_
