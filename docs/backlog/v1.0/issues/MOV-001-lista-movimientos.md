# MOV-001: Lista de movimientos filtrable

> **Issue ID:** MOV-001
> **Priority:** P0
> **Effort:** L
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar página de lista de movimientos con filtros avanzados.

## User Story

> Como **P-001/P-002**, quiero **ver todos los movimientos con filtros** para **monitorear transacciones**.

**Implementa:** US-033

---

## 📚 Referencias

- Pantalla: [SCR-050](../../planning/09_DESIGN.md#scr-050051052-movimientos)
- Wireframe: [SCR-051_movimiento_form.png](../../wireframes/SCR-051_movimiento_form.png)

---

## ✅ Criterios de Aceptación

- [x] URL: `/movimientos`
- [x] DataTable: Fecha, Concepto (badge), Monto, Moneda, Estado (badge), Fondo
- [x] Filtros: Concepto, Estado, Fecha desde/hasta, Fondo
- [x] Respetar RBAC (Admin de Fondo solo ve su fondo)
- [x] Click abre Sheet con detalle (MOV-008) — Placeholder listo
- [x] Botón "+ Nuevo Movimiento" abre form — Placeholder listo (MOV-002)

---

**Dependencias:** Bloqueado por INVE-003 ✅. Bloquea MOV-002, MOV-008.

---

## 📝 Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Resumen:** Página `/movimientos` con DataTable filtrable y badges de colores
- **Patrón:** Seguí patrón de `InversionistasTable` para consistencia
- **RBAC:** Query filtra por `userFondos` para admin_fondo
- **Placeholders:** Botón "Nuevo" y click-to-detail listos para MOV-002/MOV-008

**Files created:**

- `lib/actions/movimientos/movimientos-queries.ts` — Query con RBAC y filtros
- `lib/validations/movimientos/movimientos-validation.ts` — Zod + labels
- `src/app/(protected)/movimientos/MovimientosTable.tsx` — DataTable component
- `src/app/(protected)/movimientos/page.tsx` — Server page

**Files modified:**

- `src/config/navigation.ts` — Agregado link "Movimientos"

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
