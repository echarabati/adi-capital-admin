# E06 — EPIC-MOVIMIENTOS: Movimientos Financieros

> **Milestone:** v1.0
> **Status:** 📋 Planning
> **Issues:** 11 total (0 done) — includes TEST-002
> **Priority:** P0 (Core)

---

## Objetivo

Implementar registro, confirmación y cancelación de los 18 tipos de movimientos financieros.

## Issues

| ID                                                        | Título                              | Priority | Effort | Status |
| --------------------------------------------------------- | ----------------------------------- | -------- | ------ | ------ |
| [MOV-001](../issues/MOV-001-lista-movimientos.md)         | Lista de movimientos filtrable      | P0       | L      | 📋     |
| [MOV-002](../issues/MOV-002-movimiento-form-base.md)      | CMP-002: MovimientoForm base        | P0       | L      | 📋     |
| [MOV-003](../issues/MOV-003-form-aportaciones.md)         | Form Aportaciones (APO/APO-D)       | P0       | M      | 📋     |
| [MOV-004](../issues/MOV-004-form-distribuciones.md)       | Form Distribuciones (DIS/DEV/FEE)   | P0       | M      | 📋     |
| [MOV-005](../issues/MOV-005-form-inversiones-proyecto.md) | Form Inversiones proyecto (INV/RET) | P1       | M      | 📋     |
| [MOV-006](../issues/MOV-006-form-gastos.md)               | Form Gastos (GAS/GASP)              | P1       | S      | 📋     |
| [MOV-007](../issues/MOV-007-confirmar-cancelar.md)        | Confirmar/Cancelar movimiento       | P0       | M      | 📋     |
| [MOV-008](../issues/MOV-008-detalle-movimiento.md)        | Detalle de movimiento               | P2       | S      | 📋     |
| [MOV-009](../issues/MOV-009-form-socios.md)               | Form Socios (APS/RPS/PRS/DPRS)      | P0       | M      | 📋     |
| [MOV-010](../issues/MOV-010-form-admin.md)                | Form Admin (TRA/CAM/ERR/TSI)        | P0       | M      | 📋     |
| [TEST-002](../issues/TEST-002-e2e-movimientos.md)         | 🧪 E2E Movimientos Flow             | P0       | M      | 📋     |

## Cobertura de Conceptos (18/18)

| Categoría      | Conceptos           | Issue      |
| -------------- | ------------------- | ---------- |
| Inversionistas | APO, APO-D          | MOV-003    |
| Inversionistas | DIS, DEV, FEE       | MOV-004    |
| Proyectos      | INV, INV-D, RET     | MOV-005    |
| Gastos         | GAS, GASP           | MOV-006    |
| Socios         | APS, RPS, PRS, DPRS | MOV-009 ✅ |
| Admin          | TRA, CAM, ERR, TSI  | MOV-010 ✅ |

## Dependencias

- **Requiere:** E05 (INVERSIONES)
- **Bloquea:** E07, E08, E09

## Scope

**Incluido:**

- SCR-050, SCR-051, SCR-052
- FT-010 → FT-016 (Movimientos)
- US-030 → US-049, US-090
- CMP-002, CMP-006, CMP-011
- FLW-001 (Registro de Movimiento)

**Excluido:**

- Wizard de Reparto (E08)
- Sync Firebase (E09)

## Wireframes

- [SCR-051_movimiento_form.png](../../wireframes/SCR-051_movimiento_form.png)

## Referencias

- [09_DESIGN.md - FLW-001](../../planning/09_DESIGN.md#flw-001-registro-de-movimiento)
- [04_BUSINESS_RULES.md - BR-020→029](../../planning/04_BUSINESS_RULES.md)

---

_Epic E06 — Backlog v1.0 — Actualizado: 2026-02-03_
