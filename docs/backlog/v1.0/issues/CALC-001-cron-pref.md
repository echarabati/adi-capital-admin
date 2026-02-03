# CALC-001: Cron Pref diario

> **Issue ID:** CALC-001
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
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

- [ ] API route `/api/cron/pref`
- [ ] Ejecuta diariamente a 00:00 UTC
- [ ] Fórmula: `pref_diario = (capital_aportado × tasa_pref / 100) / 365`
- [ ] Actualiza `pref_acumulado` y `pref_acumulado_hasta`
- [ ] Logging estructurado
- [ ] Endpoint manual para retry

---

**Dependencias:** Bloqueado por MOV-007.

---

_Creado: 2026-02-03_
