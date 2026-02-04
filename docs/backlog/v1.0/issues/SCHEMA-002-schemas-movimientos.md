# SCHEMA-002: Crear schemas para movimientos y calendario

> **Issue ID:** SCHEMA-002
> **Priority:** P0
> **Effort:** M
> **Status:** ✅ Completed (2026-02-04)
> **Epic:** [E01-EPIC-SCHEMA](../epics/EPIC-SCHEMA.md)

---

## 🎯 Objetivo

Crear schemas para Movimientos (E-005) con los 18 conceptos, Calendario de Pagos (E-006), Cuentas Bancarias (E-007) y Beneficiarios (E-008).

## User Story

> Como **desarrollador**, quiero **schemas para entidades transaccionales** para **implementar movimientos financieros**.

---

## 📚 Referencias

**Schema:**

- [E-005: Movimientos](../../planning/05_DATA_MODEL.md#e-005-movimientos)
- [E-006: Calendario de Pagos](../../planning/05_DATA_MODEL.md#e-006-calendario-de-pagos)
- [E-007: Cuentas Bancarias](../../planning/05_DATA_MODEL.md#e-007-cuentas-bancarias)
- [E-008: Beneficiarios](../../planning/05_DATA_MODEL.md#e-008-beneficiarios)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Schema de movimientos incluye todos los conceptos
  Given que genero el schema de movimientos
  Then incluye enum con 18 conceptos:
    | Categoría | Conceptos |
    | Inversionistas | APO, APO-D, DIS, DEV, FEE |
    | Proyectos | INV, INV-D, RET |
    | Gastos | GAS, GASP |
    | Socios | APS, RPS, PRS, DPRS |
    | Admin | TRA, CAM, ERR, TSI |

Scenario: Migraciones aplican sin error
  Given que ejecuto pnpm db:generate
  Then genera archivo de migración sin errores
  And pnpm db:migrate aplica correctamente

Scenario: Índices optimizados
  Given que creo índices
  Then existen índices para:
    - movimientos.fondo_id
    - movimientos.proyecto_id
    - movimientos.inversion_id
    - movimientos.fecha
    - calendario_pagos.inversion_id
```

- [x] `lib/db/schema/movimientos.ts` con concepto enum (18 valores)
- [x] `lib/db/schema/calendario-pagos.ts` con estado_call enum
- [x] `lib/db/schema/cuentas-bancarias.ts` con FK a fondos
- [x] `lib/db/schema/beneficiarios.ts` con FK a fondos
- [x] Índices para queries frecuentes
- [x] `pnpm db:generate` ejecuta sin errores

## 🔧 Contexto Técnico

**Conceptos enum (18):**

```typescript
export const conceptoEnum = pgEnum('concepto', [
  // Inversionistas
  'APO',
  'APO-D',
  'DIS',
  'DEV',
  'FEE',
  // Proyectos
  'INV',
  'INV-D',
  'RET',
  // Gastos
  'GAS',
  'GASP',
  // Socios
  'APS',
  'RPS',
  'PRS',
  'DPRS',
  // Admin
  'TRA',
  'CAM',
  'ERR',
  'TSI',
]);
```

---

**Dependencias de Issues:**

- Bloqueado por: SCHEMA-001 ✅
- Bloquea a: FOND-004, FOND-005, MOV-\*, INVE-005

## 🧪 Tests Requeridos

- [x] Integration: Migraciones aplican correctamente

## 🚫 Out of Scope

- Usuarios (SCHEMA-003)

---

## Implementation Notes

**Completed:** 2026-02-04

**Context & Decisions:**

- **Resumen:** Creados 4 schemas transaccionales + 3 enums nuevos
- **Índices:** 8 índices en movimientos para optimizar queries frecuentes
- **Helpers:** Agregado `getMontoPendiente()` en calendario-pagos

**Files modified:**

- `lib/db/schema/enums.ts` — +3 enums: concepto (18 valores), estadoMovimiento, estadoCall

**Files created:**

- `lib/db/schema/movimientos.ts` — 22 cols, 8 índices, 6 FKs
- `lib/db/schema/calendario-pagos.ts` — Capital calls con unique constraint
- `lib/db/schema/cuentas-bancarias.ts` — Cuentas de fondo con balance
- `lib/db/schema/beneficiarios.ts` — Receptores de gastos

**Migration generated:**

- `lib/db/migrations/0003_lucky_thunderbolt_ross.sql` — 4 tablas, 3 enums

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] db:generate: Pass (16 tablas totales)

---

_Creado: 2026-02-03_
_Completado: 2026-02-04_
