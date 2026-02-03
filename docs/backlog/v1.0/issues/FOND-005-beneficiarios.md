# FOND-005: CRUD Beneficiarios

> **Issue ID:** FOND-005
> **Priority:** P1
> **Effort:** S
> **Status:** 📋 Backlog
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

- [ ] Tab "Beneficiarios" en detalle de fondo
- [ ] DataTable con: Nombre, Banco, Número Cuenta, CLABE
- [ ] Botón "+ Nuevo Beneficiario" abre Dialog
- [ ] Validación: nombre único dentro del fondo
- [ ] Editar beneficiario existente

## 🔧 Contexto Técnico

**Archivos a crear:**

- `src/app/(protected)/fondos/[id]/beneficiarios/page.tsx`
- `src/components/fondos/beneficiario-form.tsx`
- `lib/actions/beneficiarios/` — CRUD actions

---

**Dependencias de Issues:**

- Bloqueado por: FOND-003, SCHEMA-002
- Bloquea a: MOV-006 (Form Gastos)

## 🧪 Tests Requeridos

- [ ] Integration: CRUD completo de beneficiario

---

_Creado: 2026-02-03_
