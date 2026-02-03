# E07 — EPIC-CALCULOS: Cálculos Automáticos

> **Milestone:** v1.0
> **Status:** 📋 Planning
> **Issues:** 4 total (0 done)
> **Priority:** P1

---

## Objetivo

Implementar cálculo automático de Pref diario, Success Fee y recálculo en cancelaciones.

## Issues

| ID                                                      | Título                      | Priority | Effort | Status |
| ------------------------------------------------------- | --------------------------- | -------- | ------ | ------ |
| [CALC-001](../issues/CALC-001-cron-pref.md)             | Cron Pref diario            | P1       | M      | 📋     |
| [CALC-002](../issues/CALC-002-success-fee.md)           | Cálculo Success Fee         | P1       | M      | 📋     |
| [CALC-003](../issues/CALC-003-saldo-compromiso.md)      | Saldo compromiso automático | P2       | S      | 📋     |
| [CALC-004](../issues/CALC-004-recalculo-cancelacion.md) | Recálculo en cancelación    | P1       | M      | 📋     |

## Dependencias

- **Requiere:** E06 (MOVIMIENTOS)
- **Bloquea:** E08 (WIZARD)

## Scope

**Incluido:**

- FT-020, FT-021, FT-022, FT-023
- US-060 → US-070
- BR-030 → BR-043
- ADR-004 (Vercel Cron)

**Excluido:**

- Wizard de Reparto (E08)

## Referencias

- [06_ARCHITECTURE.md - ADR-004](../../planning/06_ARCHITECTURE.md#adr-004)
- [04_BUSINESS_RULES.md - BR-030→043](../../planning/04_BUSINESS_RULES.md)

---

_Epic E07 — Backlog v1.0_
