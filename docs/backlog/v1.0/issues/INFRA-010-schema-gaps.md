# INFRA-010: Schema gaps - destino y audit_log

> **Issue ID:** INFRA-010
> **Priority:** P2
> **Effort:** M
> **Status:** ✅ Completed (2026-02-06)
> **Epic:** [E07-EPIC-CALCULOS](../epics/EPIC-CALCULOS.md)

## 🎯 Objetivo

Agregar campos faltantes en schema para completar funcionalidad de cancelación de movimientos.

## User Story

> Como **Sistema**, quiero **registrar el destino de distribuciones y mantener un audit trail** para **soportar reversiones completas y trazabilidad**.

**Origen:** CALC-004 Implementation Notes

---

## 📚 Referencias

- Issue relacionado: [CALC-004](./CALC-004-recalculo-cancelacion.md)
- Business Rules: BR-024 (cancelación necesita destino), BR-023 (audit trail)

---

## ✅ Criterios de Aceptación

### A) Campo `destino` en movimientos

- [x] Agregar campo `destino` enum ('a_pref', 'a_capital', 'a_utilidad') a movimientos schema
- [x] Generar migración
- [ ] Actualizar form de distribuciones para capturar destino → [WIZ-001](./WIZ-001-wizard-page.md)
- [x] Conectar `cancelMovimiento` con destino para reversión DIS

### B) Tabla audit_log

- [x] Crear tabla `audit_log` con campos: id, entity_type, entity_id, action, user_id, timestamp, metadata
- [x] Integrar logging en `cancelMovimiento`
- [ ] (Opcional) UI para ver audit trail → Post-MVP

---

**Dependencias de Issues:**

- Bloqueado por: —
- Bloquea a: —
- Follow-up: [WIZ-001](./WIZ-001-wizard-page.md) (UI destino)

## 🧪 Tests Requeridos

- [x] Unit: Reversión DIS con destino (reversal-calculation.test.ts)
- [x] Migration: Schema correctamente aplicado

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Context & Decisions:**

- **Resumen:** Schema additions for destino enum/field and audit_log table
- **Migration:** `0003_same_jack_power.sql` applied
- **UI:** Form destino delegated to WIZ-001 (Wizard de Reparto)
- **Audit UI:** Post-MVP

**Files created:**

- `lib/db/schema/audit-log.ts` — New audit_log table
- `lib/actions/audit/audit-log.ts` — logAuditEvent utility
- `lib/db/migrations/0003_same_jack_power.sql` — Migration

**Files modified:**

- `lib/db/schema/enums.ts` — destinoEnum
- `lib/db/schema/movimientos.ts` — destino field
- `lib/db/schema/index.ts` — export
- `lib/actions/movimientos/movimientos-mutations.ts` — destino + audit

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Tests: 16 passing
- [x] Migration: Applied

---

_Creado: 2026-02-06 — Completado: 2026-02-06_
