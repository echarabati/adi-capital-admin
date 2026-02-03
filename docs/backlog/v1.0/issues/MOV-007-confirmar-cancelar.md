# MOV-007: Confirmar/Cancelar movimiento

> **Issue ID:** MOV-007
> **Priority:** P0
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Implementar confirmación y cancelación de movimientos con actualización de saldos.

**Implementa:** US-031, US-032

---

## 📚 Referencias

- Business Rules: [BR-020→024](../../planning/04_BUSINESS_RULES.md)

---

## ✅ Criterios de Aceptación

- [ ] Botón "Confirmar" en movimiento borrador
- [ ] Dialog de confirmación con preview de efectos
- [ ] Al confirmar: actualizar caches, marcar para sync, cambiar estado
- [ ] Botón "Cancelar" en movimiento confirmado
- [ ] Al cancelar: revertir caches, marcar para sync
- [ ] Movimiento inmutable después de confirmar/cancelar (BR-023)

---

**Dependencias:** Bloqueado por MOV-003→006. Bloquea SYNC-002.

---

_Creado: 2026-02-03_
