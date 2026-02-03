# INV-001: Lista de inversionistas

> **Issue ID:** INV-001
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E04-EPIC-INVERSIONISTAS](../epics/EPIC-INVERSIONISTAS.md)

---

## 🎯 Objetivo

Implementar lista de inversionistas con filtros por fondo y nombre.

## User Story

> Como **P-001/P-002**, quiero **ver la lista de inversionistas** para **gestionar su información**.

**Implementa:** US-011

---

## ✅ Criterios de Aceptación

- [ ] URL: `/inversionistas`
- [ ] DataTable: Nombre, Email, Fondos (tags), Es Fundador (badge)
- [ ] Filtro por fondo (respeta RBAC)
- [ ] Filtro por nombre/email
- [ ] Click navega a `/inversionistas/[id]`

---

**Dependencias:** Bloqueado por FOND-003. Bloquea INV-002, INV-003.

---

_Creado: 2026-02-03_
