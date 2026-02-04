# SCHEMA-001: Crear schemas Drizzle para entidades core

> **Issue ID:** SCHEMA-001
> **Priority:** P0
> **Effort:** L
> **Status:** ✅ Completed (2026-02-04)
> **Epic:** [E01-EPIC-SCHEMA](../epics/EPIC-SCHEMA.md)

---

## 🎯 Objetivo

Crear schemas Drizzle para las entidades core del sistema: Fondos (E-001), Proyectos (E-002), Inversionistas (E-003) e Inversiones (E-004), incluyendo enums compartidos y relaciones.

## User Story

> Como **desarrollador**, quiero **schemas Drizzle type-safe** para **implementar CRUD sin errores de tipos**.

---

## 📚 Referencias

**Schema:**

- [E-001: Fondos](../../planning/05_DATA_MODEL.md#e-001-fondos)
- [E-002: Proyectos](../../planning/05_DATA_MODEL.md#e-002-proyectos)
- [E-003: Inversionistas](../../planning/05_DATA_MODEL.md#e-003-inversionistas)
- [E-004: Inversiones](../../planning/05_DATA_MODEL.md#e-004-inversiones)

**Starter Kit Base:**

- `lib/db/schema/users.ts` — Patrón existente

---

## ✅ Criterios de Aceptación

- [x] Archivo `lib/db/schema/enums.ts` con todos los enums compartidos
- [x] Archivo `lib/db/schema/fondos.ts` con tabla y relaciones
- [x] Archivo `lib/db/schema/proyectos.ts` con FK a fondos
- [x] Archivo `lib/db/schema/inversionistas.ts` con tabla multi-fondo
- [x] Archivo `lib/db/schema/inversiones.ts` con FK a proyecto e inversionista
- [x] `pnpm db:generate` ejecuta sin errores
- [x] `pnpm typecheck` pasa

## 🔧 Contexto Técnico

**Archivos a crear:**

- `lib/db/schema/enums.ts` — Enums: moneda, metodoCascada, estadoProyecto
- `lib/db/schema/fondos.ts` — Tabla fondos con capital_socios
- `lib/db/schema/proyectos.ts` — Con herencia de cascada
- `lib/db/schema/inversionistas.ts` — Con tabla NxM inversionistas_fondos
- `lib/db/schema/inversiones.ts` — Con config Admin Fee

**Patrón de ID:**

```typescript
id: text('id')
  .primaryKey()
  .$defaultFn(() => createId());
```

---

**Dependencias de Issues:**

- Bloqueado por: — (primer issue)
- Bloquea a: SCHEMA-002, todos los FOND-_, PROJ-_, INV-_, INVE-_

## ⚠️ Edge Cases

- N/A para schema setup

## 🧪 Tests Requeridos

- [x] Unit: N/A para schemas
- [x] Integration: Verificar que migraciones aplican correctamente

## 🚫 Out of Scope

- Movimientos (SCHEMA-002)
- Server Actions (E02+)

---

## Implementation Notes

**Completed:** 2026-02-04

**Context & Decisions:**

- **Resumen:** Creados 5 archivos de schema para entidades core + 6 enums compartidos
- **Patrón:** Usamos UUID (como `users.ts`) en lugar de CUID mencionado en docs
- **auditFields:** Se reutilizó el helper existente en `lib/db/helpers/audit-fields.ts`
- **Helpers:** Se agregaron funciones `getPrefPendiente()` y `getSaldoCompromiso()` en inversiones

**Files created:**

- `lib/db/schema/enums.ts` — 6 enums: moneda, metodoCascada, estadoProyecto, tipoAdminFee, baseAdminFee, metodoAdminFee
- `lib/db/schema/fondos.ts` — Tabla fondos (12 cols) + relations
- `lib/db/schema/proyectos.ts` — Tabla proyectos (14 cols) + FK fondo_id + índice
- `lib/db/schema/inversionistas.ts` — Tabla inversionistas (12 cols) + pivot table inversionistas_fondos
- `lib/db/schema/inversiones.ts` — Tabla inversiones (18 cols) + FKs + helpers

**Files modified:**

- `lib/db/schema/index.ts` — Agregados exports para nuevos schemas

**Migration generated:**

- `lib/db/migrations/0002_real_falcon.sql` — 5 tablas, 6 enums

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] db:generate: Pass (12 tablas totales)

---

_Creado: 2026-02-03_
_Completado: 2026-02-04_
