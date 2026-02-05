# SCHEMA-004: Corregir drift en Proyectos y Fondos

> **Issue ID:** SCHEMA-004
> **Priority:** P0 (Bloqueante)
> **Effort:** M (3 pts)
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

## 🎯 Objetivo

Corregir drift entre schemas actuales y documentación 05_DATA_MODEL.md.
Agregar campos faltantes críticos para cálculos financieros y UI.

## Tipo de Issue

> **Schema Fix** — Detectado durante TEST-004, bloquea cálculos de Pref y tests.

---

## 📚 Referencias

- Data Model: [05_DATA_MODEL.md](../../planning/05_DATA_MODEL.md)
- Discovery: [00_DISCOVERY_BRIEFING.md](../../planning/00_DISCOVERY_BRIEFING.md)

---

## ⚠️ Drift Detectado

### Proyectos (🔴 CRÍTICO)

| Campo              | Actual | Doc | Impacto                      |
| ------------------ | ------ | --- | ---------------------------- |
| `codigo`           | ❌     | ✅  | Identificador visual PRJ-XXX |
| `tasaPref`         | ❌     | ✅  | 🔴 Cálculo diario de Pref    |
| `fechaInicio`      | ❌     | ✅  | Timeline proyecto            |
| `fechaTerminacion` | ❌     | ✅  | Timeline proyecto            |

### Fondos (🟢 Minor)

| Campo  | Actual | Doc | Impacto                     |
| ------ | ------ | --- | --------------------------- |
| `slug` | ❌     | ✅  | URL-friendly (nice-to-have) |

---

## ✅ Criterios de Aceptación

### Proyectos (Required)

- [ ] Agregar `codigo: text('codigo').notNull()`
- [ ] Agregar `tasaPref: decimal('tasa_pref', { precision: 5, scale: 2 }).notNull().default('12.00')`
- [ ] Agregar `fechaInicio: timestamp('fecha_inicio')`
- [ ] Agregar `fechaTerminacion: timestamp('fecha_terminacion')`
- [ ] Agregar índice único `UNIQUE(fondo_id, codigo)`
- [ ] Actualizar form de crear/editar proyecto
- [ ] Actualizar validación Zod

### Fondos (Optional)

- [ ] Agregar `slug: text('slug')` (computed from nombre si no se provee)

### Migration

- [ ] Generar migration con `pnpm db:generate`
- [ ] Aplicar con `pnpm db:migrate`
- [ ] Proyectos existentes reciben `codigo` auto-generado

---

## 🔧 Contexto Técnico

**Archivos a modificar:**

1. `lib/db/schema/proyectos.ts` — Agregar campos
2. `lib/db/schema/fondos.ts` — Agregar slug (opcional)
3. `lib/validations/proyectos/*.ts` — Actualizar Zod
4. `src/app/(protected)/fondos/[id]/proyectos/ProyectoFormDialog.tsx` — Agregar campos al form
5. `lib/actions/proyectos/proyectos-mutations.ts` — Manejar nuevos campos

**Commands:**

```bash
pnpm db:generate  # Genera migration
pnpm db:migrate   # Aplica migration
```

---

**Dependencias de Issues:**

- Bloqueado por: —
- Bloquea a: CALC-001, CALC-002, TEST-004, WIZ-002, WIZ-003

---

## 🔴 Risk Assessment

**Risk Level:** 🟡 MEDIUM

- Requiere migration de DB
- Proyectos existentes necesitan valores defaults
- Afecta forms de crear/editar proyecto
- `tasaPref` es CRÍTICO para todo el sistema de cálculos

---

_Detectado: 2026-02-05 durante implementación de TEST-004_
_Auditado: 2026-02-05 — fondos, proyectos, inversiones revisados_
