# PROJ-005: Estados proyecto

> **Issue ID:** PROJ-005
> **Priority:** P2
> **Effort:** S
> **Status:** 📋 Backlog
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar cambio de estado del proyecto con validaciones correspondientes.

## User Story

> Como **P-001/P-002**, quiero **cambiar el estado del proyecto** para **reflejar su ciclo de vida**.

**Implementa:** US-007

---

## 📚 Referencias

- Business Rules: [BR-008](../../planning/04_BUSINESS_RULES.md#br-008) — Estados y restricciones
- API Contract: `updateProyectoEstado` (07_API_CONTRACTS.md L155-175)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Cerrar inversión
  Given que el proyecto tiene estado "inversion_abierta"
  When cambio a "inversion_cerrada"
  Then no se pueden agregar nuevos inversionistas
  And inversionistas existentes pueden seguir aportando

Scenario: Concluir proyecto
  Given que el proyecto tiene estado "inversion_cerrada"
  When cambio a "concluido"
  Then el sistema pide confirmación
  And muestra advertencia: "No se podrán crear más movimientos"

Scenario: Intentar movimiento en proyecto concluido
  Given que el proyecto está "concluido"
  When intento crear un movimiento para ese proyecto
  Then el sistema rechaza con error "Proyecto concluido no acepta movimientos" (BR-008)

Scenario: Transiciones válidas
  Given los estados
  Then solo son válidas las transiciones:
    | De | A |
    | inversion_abierta | inversion_cerrada |
    | inversion_cerrada | concluido |
    | inversion_cerrada | inversion_abierta |
```

- [ ] Estados: inversion_abierta → inversion_cerrada → concluido
- [ ] Transición inversa solo: cerrada → abierta (reabrir)
- [ ] No se pueden crear movimientos en proyecto concluido (BR-008)
- [ ] Dropdown en header de detalle del proyecto
- [ ] Confirmación con warning antes de cambiar a "concluido"

---

**Dependencias de Issues:**

- Bloqueado por: PROJ-003
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Validación transiciones válidas
- [ ] Integration: Bloqueo de movimientos en concluido

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
