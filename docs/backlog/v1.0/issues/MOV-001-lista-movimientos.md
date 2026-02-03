# MOV-001: Lista de movimientos filtrable

> **Issue ID:** MOV-001
> **Priority:** P0
> **Effort:** L
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar página de lista de movimientos con filtros avanzados.

## User Story

> Como **P-001/P-002**, quiero **ver todos los movimientos con filtros** para **monitorear transacciones**.

**Implementa:** US-033

---

## 📚 Referencias

- Pantalla: [SCR-050](../../planning/09_DESIGN.md#scr-050051052-movimientos)
- Wireframe: [SCR-051_movimiento_form.png](../../wireframes/SCR-051_movimiento_form.png)

---

## ✅ Criterios de Aceptación

- [ ] URL: `/movimientos`
- [ ] DataTable: Fecha, Concepto (badge), Monto, Moneda, Estado (badge), Fondo
- [ ] Filtros: Concepto, Estado, Fecha desde/hasta, Fondo
- [ ] Respetar RBAC (Admin de Fondo solo ve su fondo)
- [ ] Click abre Sheet con detalle (MOV-008)
- [ ] Botón "+ Nuevo Movimiento" abre form

---

**Dependencias:** Bloqueado por INVE-003. Bloquea MOV-002, MOV-008.

---

_Creado: 2026-02-03_
