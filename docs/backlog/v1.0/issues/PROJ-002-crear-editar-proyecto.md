# PROJ-002: Crear/Editar proyecto

> **Issue ID:** PROJ-002
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar formulario para crear y editar proyectos con configuración de tasas.

## User Story

> Como **P-001/P-002**, quiero **crear proyectos** para **registrar inversiones inmobiliarias**.

**Implementa:** US-004, US-005

---

## 📚 Referencias

- Pantalla: [SCR-022](../../planning/09_DESIGN.md#scr-020021022-proyectos)
- Business Rules: [BR-004→008](../../planning/04_BUSINESS_RULES.md)

---

## ✅ Criterios de Aceptación

- [ ] Dialog con campos: Código, Nombre, Descripción, Tasa Pref, Success Fee %
- [ ] Código único dentro del fondo (validación)
- [ ] Tasa Pref default: 12%, Success Fee default: 20%
- [ ] Método Cascada opcional (hereda de fondo si null)
- [ ] Toast éxito/error
- [ ] Editar proyecto existente

---

**Dependencias de Issues:**

- Bloqueado por: PROJ-001
- Bloquea a: PROJ-003

---

_Creado: 2026-02-03_
