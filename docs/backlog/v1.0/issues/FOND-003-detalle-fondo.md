# FOND-003: Detalle de fondo con tabs

> **Issue ID:** FOND-003
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E02-EPIC-FONDOS](../epics/EPIC-FONDOS.md)

---

## 🎯 Objetivo

Implementar página de detalle de fondo con tabs para Proyectos, Cuentas Bancarias y Beneficiarios.

## User Story

> Como **P-001/P-002**, quiero **ver el detalle de un fondo con secciones** para **gestionar toda su información**.

---

## 📚 Referencias

**Design:**

- Pantalla: [SCR-011](../../planning/09_DESIGN.md#scr-010011012013-fondos)

---

## ✅ Criterios de Aceptación

- [ ] URL: `/fondos/[id]`
- [ ] Header con nombre del fondo y badge moneda
- [ ] Tabs: Proyectos, Cuentas Bancarias, Beneficiarios
- [ ] Tab Proyectos muestra DataTable de proyectos
- [ ] Tab Cuentas muestra lista (placeholder para FOND-004)
- [ ] Tab Beneficiarios muestra lista (placeholder para FOND-005)
- [ ] 404 si fondo no existe o no tiene acceso

## 🔧 Contexto Técnico

**Archivos a crear:**

- `src/app/(protected)/fondos/[id]/page.tsx`
- `src/app/(protected)/fondos/[id]/layout.tsx` — Tabs
- `src/components/fondos/fondo-header.tsx`

---

**Dependencias de Issues:**

- Bloqueado por: FOND-002
- Bloquea a: FOND-004, FOND-005, PROJ-001

## 🧪 Tests Requeridos

- [ ] E2E: Navegar a detalle de fondo

---

_Creado: 2026-02-03_
