# FOND-004: CRUD Cuentas Bancarias

> **Issue ID:** FOND-004
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
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

- [ ] Tab "Cuentas Bancarias" en detalle de fondo
- [ ] DataTable con: Banco, Número, CLABE, Moneda, Saldo
- [ ] Botón "+ Nueva Cuenta" abre Dialog
- [ ] Form: Banco, Número, CLABE, Moneda
- [ ] Editar cuenta existente
- [ ] Saldo es read-only (calculado desde movimientos)

## 🔧 Contexto Técnico

**Archivos a crear:**

- `src/app/(protected)/fondos/[id]/cuentas/page.tsx`
- `src/components/fondos/cuenta-bancaria-form.tsx`
- `lib/actions/cuentas-bancarias/` — CRUD actions

---

**Dependencias de Issues:**

- Bloqueado por: FOND-003, SCHEMA-002
- Bloquea a: MOV-001 (filtro por cuenta)

## 🧪 Tests Requeridos

- [ ] Integration: CRUD completo de cuenta

---

_Creado: 2026-02-03_
