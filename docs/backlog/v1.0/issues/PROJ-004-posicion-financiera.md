# PROJ-004: Posición financiera del proyecto

> **Issue ID:** PROJ-004
> **Priority:** P2
> **Effort:** S
> **Status:** ✅ Done (2026-02-04)
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

- [x] Card en tab Overview de detalle proyecto
- [x] Métricas: Inversión Recibida, Gastos, Retornos, Utilidad/Pérdida
- [x] Fórmula: Utilidad = Retornos - Inversión - Gastos (BR-009)
- [x] Valores actualizados al cargar página
- [x] Color: verde para utilidad positiva, rojo para negativa

---

**Dependencias de Issues:**

- Bloqueado por: PROJ-003, MOV-007 (para tener datos)
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Cálculo de utilidad
- [ ] Unit: Render con valores positivos/negativos

---

## Implementation Notes

**Completed:** 2026-02-04

**Context & Decisions:**

- Integrated Utilidad card into existing overview page
- BR-009 formula: Utilidad = Retornos - Inversión - Gastos
- Green (#10b981) for gains, Red (#ef4444) for losses

**Files modified:**

- `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/page.tsx` — Added Utilidad card

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
