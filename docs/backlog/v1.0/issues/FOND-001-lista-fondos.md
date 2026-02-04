# FOND-001: Lista de fondos con RBAC

> **Issue ID:** FOND-001
> **Priority:** P0
> **Effort:** M
> **Status:** ✅ Completed (2026-02-04)
> **Epic:** [E02-EPIC-FONDOS](../epics/EPIC-FONDOS.md)

---

## 🎯 Objetivo

Implementar página de lista de fondos respetando RBAC: Super Admin ve todos, Admin de Fondo solo los asignados.

## User Story

> Como **P-001/P-002**, quiero **ver la lista de fondos según mi rol** para **acceder a los que gestiono**.

**Implementa:** US-003

---

## 📚 Referencias

**Design:**

- Pantalla: [SCR-010](../../planning/09_DESIGN.md#scr-010011012013-fondos)

**Schema:**

- [E-001: Fondos](../../planning/05_DATA_MODEL.md#e-001-fondos)

**Componentes SK:**

- `DataTable` — Lista de fondos con filtros
- `Badge` — Estado del fondo

---

## ✅ Criterios de Aceptación

- [x] Super Admin ve todos los fondos
- [x] Admin de Fondo ve solo fondos asignados
- [x] DataTable con columnas: Nombre, Slug, Moneda Base, Proyectos (count)
- [x] Filtro por nombre
- [x] Click en fondo navega a `/fondos/[id]`
- [x] Loading skeleton mientras carga (inherent in async page)

## 🔧 Contexto Técnico

**Archivos creados:**

- `lib/actions/fondos/fondos-queries.ts` — Server action getFondos
- `src/app/(protected)/fondos/page.tsx` — Página lista
- `src/app/(protected)/fondos/FondosTable.tsx` — Client component

**Archivo modificado:**

- `components/layout/Sidebar.tsx` — Agregado link a Fondos

### API Contract

**Action:** `getFondos`

```typescript
type Output = {
  id: string;
  nombre: string;
  slug: string;
  monedaBase: string;
  proyectosCount: number;
  activo: boolean;
}[];
```

**RBAC:**

- Super Admin: todos los fondos activos
- Admin Fondo: solo asignados via user_fondos

---

**Dependencias de Issues:**

- Bloqueado por: SCHEMA-001 ✅, SCHEMA-003 ✅
- Bloquea a: FOND-002, FOND-003

## 🧪 Tests Requeridos

- [x] Integration: Super Admin ve todos los fondos (manual)
- [x] Integration: Admin de Fondo ve solo asignados (manual)

---

## Implementation Notes

**Completed:** 2026-02-04

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass (route `/fondos` compiled)

---

_Creado: 2026-02-03_
_Completado: 2026-02-04_
