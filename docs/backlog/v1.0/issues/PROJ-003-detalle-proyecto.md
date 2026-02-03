# PROJ-003: Detalle de proyecto con tabs

> **Issue ID:** PROJ-003
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar página de detalle de proyecto con tabs para Inversiones, Movimientos, Documentos.

## User Story

> Como **P-001/P-002**, quiero **ver el detalle de un proyecto** para **gestionar inversiones y movimientos**.

**Implementa:** US-006, US-007, US-008

---

## 📚 Referencias

- Pantalla: [SCR-021](../../planning/09_DESIGN.md#scr-020021022-proyectos)
- Wireframe: [wireframe](../../wireframes/SCR-021_proyecto_detalle.png)

---

## ✅ Criterios de Aceptación

- [ ] URL: `/fondos/[fondoId]/proyectos/[id]`
- [ ] Header con nombre, código, badge estado
- [ ] Tabs: Overview, Inversiones, Movimientos, Documentos
- [ ] Tab Overview: posición financiera (placeholder PROJ-004)
- [ ] 404 si no existe o sin acceso

---

**Dependencias de Issues:**

- Bloqueado por: PROJ-002
- Bloquea a: PROJ-004, INVE-001

---

_Creado: 2026-02-03_
