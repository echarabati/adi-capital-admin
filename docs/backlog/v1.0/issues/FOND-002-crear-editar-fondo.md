# FOND-002: Crear/Editar fondo

> **Issue ID:** FOND-002
> **Priority:** P0
> **Effort:** M
> **Status:** ✅ Completed (2026-02-04)
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

- [x] Botón "+ Nuevo Fondo" visible solo para Super Admin
- [x] Dialog con campos: Nombre, Moneda Base, Método Cascada
- [x] Slug se genera automáticamente desde nombre
- [x] Validación: nombre único, campos requeridos
- [x] Toast de éxito/error
- [x] Lista se refresca al guardar (revalidatePath)

## 🔧 Contexto Técnico

**Archivos creados:**

- `lib/validations/fondos/fondo-validation.ts` — Zod schemas
- `lib/actions/fondos/fondos-mutations.ts` — createFondo, updateFondo
- `src/app/(protected)/fondos/FondoFormDialog.tsx` — Dialog form

**Archivos modificados:**

- `FondosTable.tsx` — Botón "Nuevo" + acción editar
- `page.tsx` — Pass userRole prop

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

- Bloqueado por: FOND-001 ✅
- Bloquea a: FOND-003

## 🧪 Tests Requeridos

- [x] Unit: Validación de formulario (via Zod)
- [x] Integration: Crear fondo con datos válidos (manual)
- [x] Integration: Rechazar duplicado de nombre (manual)

---

## Implementation Notes

**Completed:** 2026-02-04

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03_
_Completado: 2026-02-04_
