# SCHEMA-001: Crear schemas Drizzle para entidades core

> **Issue ID:** SCHEMA-001
> **Priority:** P0
> **Effort:** L
> **Status:** 📋 Backlog
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

- [ ] Archivo `lib/db/schema/enums.ts` con todos los enums compartidos
- [ ] Archivo `lib/db/schema/fondos.ts` con tabla y relaciones
- [ ] Archivo `lib/db/schema/proyectos.ts` con FK a fondos
- [ ] Archivo `lib/db/schema/inversionistas.ts` con tabla multi-fondo
- [ ] Archivo `lib/db/schema/inversiones.ts` con FK a proyecto e inversionista
- [ ] `pnpm db:generate` ejecuta sin errores
- [ ] `pnpm typecheck` pasa

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

- [ ] Unit: N/A para schemas
- [ ] Integration: Verificar que migraciones aplican correctamente

## 🚫 Out of Scope

- Movimientos (SCHEMA-002)
- Server Actions (E02+)

---

_Creado: 2026-02-03_
