# FOND-002: Crear/Editar fondo

> **Issue ID:** FOND-002
> **Priority:** P0
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E02-EPIC-FONDOS](../epics/EPIC-FONDOS.md)

---

## 🎯 Objetivo

Implementar formulario Dialog para crear y editar fondos. Solo Super Admin puede realizar estas acciones.

## User Story

> Como **P-001** (Super Admin), quiero **crear y editar fondos** para **configurar vehículos de inversión**.

**Implementa:** US-001, US-002

---

## 📚 Referencias

**Design:**

- [SCR-011](../../planning/09_DESIGN.md#scr-010011012013-fondos)

**Business Rules:**

- [BR-002: Unicidad de Slug](../../planning/04_BUSINESS_RULES.md#br-002)
- [BR-003: Herencia de Cascada](../../planning/04_BUSINESS_RULES.md#br-003)

---

## ✅ Criterios de Aceptación

- [ ] Botón "+ Nuevo Fondo" visible solo para Super Admin
- [ ] Dialog con campos: Nombre, Moneda Base, Método Cascada
- [ ] Slug se genera automáticamente desde nombre
- [ ] Validación: nombre único, campos requeridos
- [ ] Toast de éxito/error
- [ ] Lista se refresca al guardar

## 🔧 Contexto Técnico

**Archivos a crear:**

- `src/components/fondos/fondo-form.tsx`
- `lib/actions/fondos/mutations.ts` — createFondo, updateFondo

### API Contract

**Action:** `createFondo`

```typescript
type Input = {
  nombre: string;
  monedaBase: 'MXN' | 'USD' | 'EUR' | 'ILS';
  metodoCascada: 'pref_primero' | 'capital_primero';
};
type Output = { success: true; data: { id: string } } | { success: false; error: string };
```

**RBAC:**

- Solo `super_admin`

---

**Dependencias de Issues:**

- Bloqueado por: FOND-001
- Bloquea a: FOND-003

## 🧪 Tests Requeridos

- [ ] Unit: Validación de formulario
- [ ] Integration: Crear fondo con datos válidos
- [ ] Integration: Rechazar duplicado de slug

---

_Creado: 2026-02-03_
