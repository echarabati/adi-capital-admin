# MOV-008: Detalle de movimiento

> **Issue ID:** MOV-008
> **Priority:** P2
> **Effort:** S
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

## 🎯 Objetivo

Mostrar vista detallada de un movimiento con toda su información.

## User Story

> Como **P-001/P-002**, quiero **ver el detalle de un movimiento** para **conocer todos sus datos y referencias**.

**Implementa:** US-034

---

## 📚 Referencias

- Design: [SCR-052](../../planning/09_DESIGN.md#scr-050051052-movimientos)
- API Contract: `getMovimiento` (07_API_CONTRACTS.md L260-272)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Ver detalle de movimiento
  Given que hago click en un movimiento de la lista
  Then se abre sheet/modal con todos los datos
  And veo: Concepto, Monto, Fecha, Estado, Inversionista, Proyecto
  And veo: usuario que creó, fecha creación, última modificación

Scenario: Ver movimientos relacionados
  Given que el movimiento pertenece a un grupo (grupo_movimiento)
  Then veo sección "Movimientos Relacionados"
  And lista los otros movimientos del mismo grupo
  And puedo navegar a cualquiera de ellos

Scenario: Ver historial de sync
  Given que el movimiento fue sincronizado a Firebase
  Then veo badge "Sincronizado" con fecha/hora
  And si hay error de sync, veo el mensaje de error
```

- [ ] Vista completa con todos los campos del movimiento
- [ ] Sección información general: concepto, monto, moneda, tipo_cambio, fecha
- [ ] Sección referencias: inversionista, inversión, proyecto
- [ ] Sección metadata: created_by, created_at, updated_at
- [ ] Sección grupo: lista de movimientos relacionados (si grupo_movimiento)
- [ ] Sección sync: estado de sincronización Firebase

---

**Dependencias de Issues:**

- Bloqueado por: MOV-001
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Render de todos los campos
- [ ] Integration: Carga movimientos relacionados

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
