# FOND-004: CRUD Cuentas Bancarias

> **Issue ID:** FOND-004
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-04)
> **Epic:** [E02-EPIC-FONDOS](../epics/EPIC-FONDOS.md)

---

## 🎯 Objetivo

Implementar CRUD de cuentas bancarias dentro del tab de detalle de fondo.

## User Story

> Como **P-001/P-002**, quiero **gestionar cuentas bancarias del fondo** para **registrar movimientos contra ellas**.

**Implementa:** US-022, US-023, US-024

---

## 📚 Referencias

**Design:**

- Pantalla: [SCR-012](../../planning/09_DESIGN.md#scr-010011012013-fondos)

**Schema:**

- [E-007: Cuentas Bancarias](../../planning/05_DATA_MODEL.md#e-007-cuentas-bancarias)

**Componentes Nuevos:**

- `CMP-014: CuentaBancariaForm`

---

## ✅ Criterios de Aceptación

- [x] Tab "Cuentas Bancarias" en detalle de fondo
- [x] DataTable con: Banco, Número, CLABE, Moneda, Saldo
- [x] Botón "+ Nueva Cuenta" abre Dialog
- [x] Form: Banco, Número, CLABE, Moneda
- [x] Editar cuenta existente
- [x] Saldo es read-only (calculado desde movimientos)

## 🔧 Contexto Técnico

**Archivos creados:**

- `lib/validations/cuentas-bancarias/cuenta-bancaria-validation.ts`
- `lib/actions/cuentas-bancarias/cuentas-bancarias-queries.ts`
- `lib/actions/cuentas-bancarias/cuentas-bancarias-mutations.ts`
- `src/app/(protected)/fondos/[id]/cuentas/CuentaBancariaFormDialog.tsx`
- `src/app/(protected)/fondos/[id]/cuentas/CuentasBancariasTable.tsx`

**Archivos modificados:**

- `src/app/(protected)/fondos/[id]/cuentas/page.tsx`

---

**Dependencias de Issues:**

- Bloqueado por: FOND-003 ✅, SCHEMA-002 ✅
- Bloquea a: MOV-001 (filtro por cuenta)

## 🧪 Tests Requeridos

- [x] Integration: CRUD completo de cuenta (manual)

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
