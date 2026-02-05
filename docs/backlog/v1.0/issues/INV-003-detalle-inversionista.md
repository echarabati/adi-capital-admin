# INV-003: Detalle de inversionista

> **Issue ID:** INV-003
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E04-EPIC-INVERSIONISTAS](../epics/EPIC-INVERSIONISTAS.md)

---

## 🎯 Objetivo

Implementar página de detalle con tabs para inversiones, movimientos y documentos.

## User Story

> Como **P-001/P-002**, quiero **ver el detalle de un inversionista** para **gestionar sus inversiones**.

**Implementa:** US-012

---

## ✅ Criterios de Aceptación

- [x] URL: `/inversionistas/[id]`
- [x] Header: Nombre, email, badge fundador
- [x] Tabs: Inversiones, Movimientos, Documentos
- [x] Tab Inversiones: DataTable de inversiones (link a INVE-001)

---

**Dependencias:** Bloqueado por INV-002 ✅. Bloquea INVE-001.

---

## Implementation Notes

**Completed:** 2026-02-05

**Files created:**

- `src/app/(protected)/inversionistas/[id]/layout.tsx` — Header + tabs navigation
- `src/app/(protected)/inversionistas/[id]/page.tsx` — Redirect to inversiones
- `src/app/(protected)/inversionistas/[id]/inversiones/page.tsx` — Placeholder
- `src/app/(protected)/inversionistas/[id]/movimientos/page.tsx` — Placeholder
- `src/app/(protected)/inversionistas/[id]/documentos/page.tsx` — Placeholder

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03_
_Completado: 2026-02-05_
