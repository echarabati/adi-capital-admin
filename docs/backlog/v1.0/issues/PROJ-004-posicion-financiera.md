# PROJ-004: Posición financiera del proyecto

> **Issue ID:** PROJ-004
> **Priority:** P2
> **Effort:** S
> **Status:** 📋 Backlog
> **Epic:** [E03-EPIC-PROYECTOS](../epics/EPIC-PROYECTOS.md)

---

## 🎯 Objetivo

Implementar CMP-008 (ProjectPositionCard) mostrando resumen financiero del proyecto.

## User Story

> Como **P-001/P-002**, quiero **ver la posición financiera del proyecto** para **entender su estado económico**.

**Implementa:** US-008

---

## 📚 Referencias

- Design: [SCR-021](../../planning/09_DESIGN.md#scr-020021-proyectos)
- Business Rules: [BR-009](../../planning/04_BUSINESS_RULES.md#br-009) — Cálculo posición financiera

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Ver posición financiera
  Given que abro el detalle del proyecto "Marina Tower"
  Then veo ProjectPositionCard con 4 métricas
  And muestra: Inversión Recibida = $500,000
  And muestra: Gastos = $50,000
  And muestra: Retornos = $0
  And muestra: Utilidad/Pérdida = -$50,000

Scenario: Cálculo de utilidad
  Given que el proyecto tiene:
    | Concepto | Monto |
    | Inversión Recibida | $500,000 |
    | Gastos | $50,000 |
    | Retornos | $600,000 |
  Then Utilidad = $600,000 - $500,000 - $50,000 = $50,000
  And el valor se muestra en verde con signo +

Scenario: Pérdida
  Given que Retornos < (Inversión + Gastos)
  Then Utilidad muestra valor negativo en rojo
```

- [ ] Card en tab Overview de detalle proyecto
- [ ] Métricas: Inversión Recibida, Gastos, Retornos, Utilidad/Pérdida
- [ ] Fórmula: Utilidad = Retornos - Inversión - Gastos (BR-009)
- [ ] Valores actualizados al cargar página
- [ ] Color: verde para utilidad positiva, rojo para negativa

---

**Dependencias de Issues:**

- Bloqueado por: PROJ-003, MOV-007 (para tener datos)
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Cálculo de utilidad
- [ ] Unit: Render con valores positivos/negativos

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
