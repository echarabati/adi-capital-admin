# MOV-008: Detalle de movimiento

> **Issue ID:** MOV-008
> **Priority:** P2
> **Effort:** S
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Mostrar vista detallada de un movimiento con toda su información.

**Implementa:** US-034

---

## ✅ Criterios de Aceptación

- [x] Vista completa con todos los campos del movimiento
- [x] Sección información general: concepto, monto, moneda, fecha
- [x] Sección referencias: inversionista, inversión, proyecto
- [x] Sección metadata: ID
- [ ] Sección grupo: lista de movimientos relacionados (si grupo_movimiento) — requires backend
- [ ] Sección sync: estado de sincronización Firebase — requires backend

---

**Dependencias:** Bloqueado por MOV-001 ✅

---

## 📝 Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- Created MovimientoDetailSheet with sections: General, Referencias, Metadata
- Only uses fields currently available in MovimientoListItem
- Grupo and Sync sections deferred until backend fields become available

**Files created:**

- `MovimientoDetailSheet.tsx` — Detail view sheet

**Files modified:**

- `MovimientosTable.tsx` — row click handler + detail sheet integration

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
