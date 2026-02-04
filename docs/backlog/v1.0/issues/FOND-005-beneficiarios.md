# FOND-005: CRUD Beneficiarios

> **Issue ID:** FOND-005
> **Priority:** P1
> **Effort:** S
> **Status:** ✅ Completed (2026-02-04)
> **Epic:** [E02-EPIC-FONDOS](../epics/EPIC-FONDOS.md)

---

## 🎯 Objetivo

Implementar CRUD de beneficiarios para registrar gastos.

## User Story

> Como **P-001/P-002**, quiero **gestionar beneficiarios del fondo** para **registrar pagos de gastos a terceros**.

**Implementa:** US-025, US-026

---

## 📚 Referencias

**Design:**

- Pantalla: [SCR-013](../../planning/09_DESIGN.md#scr-010011012013-fondos)

**Schema:**

- [E-008: Beneficiarios](../../planning/05_DATA_MODEL.md#e-008-beneficiarios)

**Business Rules:**

- [BR-019: Nombre único](../../planning/04_BUSINESS_RULES.md#br-019)

---

## ✅ Criterios de Aceptación

- [x] Tab "Beneficiarios" en detalle de fondo
- [x] DataTable con: Nombre, Banco, Número Cuenta, CLABE
- [x] Botón "+ Nuevo Beneficiario" abre Dialog
- [x] Validación: nombre único dentro del fondo (BR-019)
- [x] Editar beneficiario existente

## 🔧 Contexto Técnico

**Archivos creados:**

- `lib/validations/beneficiarios/beneficiario-validation.ts`
- `lib/actions/beneficiarios/beneficiarios-queries.ts`
- `lib/actions/beneficiarios/beneficiarios-mutations.ts`
- `src/app/(protected)/fondos/[id]/beneficiarios/BeneficiarioFormDialog.tsx`
- `src/app/(protected)/fondos/[id]/beneficiarios/BeneficiariosTable.tsx`

**Archivos modificados:**

- `src/app/(protected)/fondos/[id]/beneficiarios/page.tsx`

---

**Dependencias de Issues:**

- Bloqueado por: FOND-003 ✅, SCHEMA-002 ✅
- Bloquea a: MOV-006 (Form Gastos)

## 🧪 Tests Requeridos

- [x] Integration: CRUD completo de beneficiario (manual)

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
