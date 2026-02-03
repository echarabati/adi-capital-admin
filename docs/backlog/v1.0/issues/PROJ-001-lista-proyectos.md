# PROJ-001: Lista de proyectos

> **Issue ID:** PROJ-001
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar lista de proyectos por fondo con filtros y navegación a detalle.

## User Story

> Como **P-001/P-002**, quiero **ver los proyectos de un fondo** para **gestionarlos**.

**Implementa:** US-006

---

## 📚 Referencias

- Pantalla: [SCR-020](../../planning/09_DESIGN.md#scr-020021022-proyectos)
- Schema: [E-002](../../planning/05_DATA_MODEL.md#e-002-proyectos)

---

## ✅ Criterios de Aceptación

- [ ] URL: `/fondos/[fondoId]/proyectos`
- [ ] DataTable con: Código, Nombre, Estado, Tasa Pref, Inversionistas (count)
- [ ] Filtro por estado (Abierto/Cerrado/Concluido)
- [ ] Filtro por nombre/código
- [ ] Badge coloreado por estado
- [ ] Click navega a `/fondos/[fondoId]/proyectos/[id]`

---

**Dependencias de Issues:**

- Bloqueado por: FOND-003
- Bloquea a: PROJ-002, PROJ-003

---

_Creado: 2026-02-03_
