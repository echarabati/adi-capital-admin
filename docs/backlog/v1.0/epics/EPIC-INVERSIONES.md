# E05 — EPIC-INVERSIONES: Inversiones y Calendario

> **Milestone:** v1.0
> **Status:** 📋 Planning
> **Issues:** 6 total (0 done)
> **Priority:** P1

---

## Objetivo

Implementar CRUD de inversiones con configuración de Admin Fee y calendario de capital calls.

## Issues

| ID                                                    | Título                                       | Priority | Effort | Status |
| ----------------------------------------------------- | -------------------------------------------- | -------- | ------ | ------ |
| [INVE-001](../issues/INVE-001-lista-inversiones.md)   | Lista inversiones por proyecto/inversionista | P1       | M      | 📋     |
| [INVE-002](../issues/INVE-002-crear-inversion.md)     | Crear inversión con config fees              | P1       | L      | 📋     |
| [INVE-003](../issues/INVE-003-detalle-inversion.md)   | Detalle con estado compromiso                | P1       | M      | 📋     |
| [INVE-004](../issues/INVE-004-compromiso-progress.md) | CMP-009: CompromisoProgress                  | P2       | S      | 📋     |
| [INVE-005](../issues/INVE-005-calendario-pagos.md)    | CRUD Calendario pagos                        | P1       | M      | 📋     |
| [INVE-006](../issues/INVE-006-registrar-pago.md)      | Registrar pago de capital call               | P1       | S      | 📋     |

## Dependencias

- **Requiere:** E03 (PROYECTOS), E04 (INVERSIONISTAS)
- **Bloquea:** E06 (MOVIMIENTOS)

## Scope

**Incluido:**

- SCR-040, SCR-041, SCR-042, SCR-043
- FT-004 (Inversiones), FT-005 (Calendario)
- US-014 → US-021
- CMP-009, CMP-010, CMP-016, CMP-017

**Excluido:**

- Movimientos (E06)
- Cálculo Pref (E07)

## Referencias

- [09_DESIGN.md - SCR-040/041/042/043](../../planning/09_DESIGN.md#scr-040041042043-inversiones)
- [04_BUSINESS_RULES.md - BR-013→018](../../planning/04_BUSINESS_RULES.md)

---

_Epic E05 — Backlog v1.0_
