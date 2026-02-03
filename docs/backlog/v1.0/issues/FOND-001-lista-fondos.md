# FOND-001: Lista de fondos con RBAC

> **Issue ID:** FOND-001
> **Priority:** P0
> **Effort:** M
> **Status:** 📋 Backlog
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

- [ ] Super Admin ve todos los fondos
- [ ] Admin de Fondo ve solo fondos asignados
- [ ] DataTable con columnas: Nombre, Slug, Moneda Base, Proyectos (count)
- [ ] Filtro por nombre
- [ ] Click en fondo navega a `/fondos/[id]`
- [ ] Loading skeleton mientras carga

## 🔧 Contexto Técnico

**Archivos a crear:**

- `src/app/(protected)/fondos/page.tsx` — Página lista
- `lib/actions/fondos/queries.ts` — Server action getFondos

### API Contract

**Action:** `getFondos`

```typescript
type Input = void;
type Output = {
  fondos: {
    id: string;
    nombre: string;
    slug: string;
    monedaBase: string;
    proyectosCount: number;
  }[];
};
```

**RBAC:**

- Super Admin: todos
- Admin Fondo: solo asignados via user_fondos

---

**Dependencias de Issues:**

- Bloqueado por: SCHEMA-001, SCHEMA-003
- Bloquea a: FOND-002, FOND-003

## 🧪 Tests Requeridos

- [ ] Integration: Super Admin ve todos los fondos
- [ ] Integration: Admin de Fondo ve solo asignados

---

_Creado: 2026-02-03_
