# INV-004: Marcar como fundador

> **Issue ID:** INV-004
> **Priority:** P2
> **Effort:** S
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E04-EPIC-INVERSIONISTAS](../epics/EPIC-INVERSIONISTAS.md)

---

## 🎯 Objetivo

Permitir marcar inversionistas como fundadores con porcentaje de propiedad.

## User Story

> Como **P-001**, quiero **marcar fundadores** para **habilitar movimientos de socios (APS, RPS)**.

**Implementa:** US-010

---

## ✅ Criterios de Aceptación

- [x] Checkbox "Es Fundador" en form inversionista
- [x] Campo "Porcentaje Propiedad" visible solo si es fundador
- [x] Validación: porcentaje entre 0-100
- [ ] Solo fundadores pueden tener movimientos APS/RPS (BR-012) — Futuro: Epic MOV

---

**Dependencias:** Bloqueado por INV-002 ✅.

---

## Implementation Notes

**Completed:** 2026-02-05

**Context:**

- El checkbox "Es Fundador" ya existía desde INV-002
- Se agregó campo `porcentaje_propiedad` al schema
- La validación BR-012 (solo fundadores APS/RPS) se implementará en Epic Movimientos

**Files modified:**

- `lib/db/schema/inversionistas.ts` — +porcentajePropiedad field
- `lib/validations/inversionistas/inversionista-validation.ts` — +validation 0-100
- `lib/actions/inversionistas/inversionistas-mutations.ts` — +field handling
- `lib/actions/inversionistas/inversionistas-queries.ts` — +type and select
- `src/app/(protected)/inversionistas/InversionistaFormDialog.tsx` — +conditional field

**Migration:**

- `lib/db/migrations/0002_gifted_james_howlett.sql`

**Parked:**

- PARK-001: Tabla de configuración para feature flags

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Migration: Applied

---

_Creado: 2026-02-03_
_Completado: 2026-02-05_
