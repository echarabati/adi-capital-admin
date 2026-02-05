# CALC-001: Cron Pref diario

> **Issue ID:** CALC-001
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-06)
> **Epic:** [E07-EPIC-CALCULOS](../epics/EPIC-CALCULOS.md)

## 🎯 Objetivo

Implementar cron job que calcula Pref diario para todas las inversiones activas.

**Implementa:** US-060→062

---

## 📚 Referencias

- [ADR-004: Vercel Cron](../../planning/06_ARCHITECTURE.md#adr-004)
- [BR-030→032](../../planning/04_BUSINESS_RULES.md)

---

## ✅ Criterios de Aceptación

- [x] API route `/api/cron/pref`
- [x] Ejecuta diariamente a 00:00 UTC
- [x] Fórmula: `pref_diario = (capital_aportado × tasa_pref / 100) / 365`
- [x] Actualiza `pref_acumulado` y `pref_acumulado_hasta`
- [x] Logging estructurado
- [x] Endpoint manual para retry

---

**Dependencias:** Bloqueado por MOV-007. ✅

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Cron endpoint para cálculo diario de Pref implementado siguiendo ADR-004
- **Schema:** Added `prefAcumuladoHasta` timestamp field to track last calculation date
- **Auth:** Dual auth - CRON_SECRET for Vercel Cron, session for manual retry
- **Formula:** Uses investment-specific `prefRate`, falls back to `proyectos.tasaPref`

**Files created:**

- `src/app/api/cron/pref/route.ts` — Cron endpoint with POST/GET handlers
- `vercel.json` — Vercel Cron config (daily at 00:00 UTC)
- `tests/unit/pref-calculation.test.ts` — 14 unit tests for formula

**Files modified:**

- `lib/db/schema/inversiones.ts` — Added `prefAcumuladoHasta` field

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Tests: 14/14 passing

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
