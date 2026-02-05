# INVE-004: Compromiso Progress Bar

> **Issue ID:** INVE-004
> **Priority:** P2
> **Effort:** S
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E05-EPIC-INVERSIONES](../epics/EPIC-INVERSIONES.md)

## 🎯 Objetivo

Mostrar visualmente el progreso del compromiso de inversión.

## User Story

> Como **P-001/P-002**, quiero **ver el progreso visual del compromiso** para **identificar rápidamente el estado de cada inversión**.

**Implementa:** US-016

---

## 📚 Referencias

- Business Rules: [BR-017](../../planning/04_BUSINESS_RULES.md#br-017) — Estados del compromiso
- Design: [SCR-040](../../planning/09_DESIGN.md#scr-040-inversiones)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Compromiso pendiente
  Given que inversión tiene compromiso $100,000 y aportado $0
  Then progress bar muestra 0%
  And color es gris
  And badge muestra "Pendiente"

Scenario: Compromiso parcial
  Given que aportado = $60,000 de $100,000
  Then progress bar muestra 60%
  And color es azul
  And badge muestra "Parcial"

Scenario: Compromiso completado
  Given que aportado = $100,000 = compromiso
  Then progress bar muestra 100%
  And color es verde
  And badge muestra "Completado"

Scenario: Compromiso excedido
  Given que aportado = $120,000 > compromiso $100,000
  Then progress bar muestra 100% con indicador de exceso
  And color es amarillo con icono warning
  And badge muestra "Excedido +$20k"
```

- [x] Progress bar con porcentaje visual
- [x] Colores: gris (0%), azul (1-99%), verde (100%), amarillo (>100%)
- [x] Badge con estado textual
- [x] Tooltip con montos exactos: "Aportado: $X / Compromiso: $Y"
- [x] Indicador de monto excedido si aplica

---

**Dependencias de Issues:**

- Bloqueado por: CALC-003
- Bloquea a: —

## 🧪 Tests Requeridos

- [x] Unit: Render por cada estado
- [x] Unit: Cálculo porcentaje correcto

---

## Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Resumen:** Creado componente `CompromisoProgress` que muestra barra de progreso visual con 4 estados
- **Decisiones:** Usamos colores semánticos (gris/azul/verde/amarillo) para fácil identificación visual
- **Dependencia:** La lógica de `calculateEstado` ya existía en `inversiones-queries.ts`, por lo que CALC-003 no era bloqueante real

**Files created:**

- `src/app/(protected)/inversiones/[id]/_components/CompromisoProgress.tsx` — Componente de progreso
- `tests/unit/compromiso-progress.test.ts` — 14 unit tests

**Files modified:**

- `src/app/(protected)/inversiones/[id]/page.tsx` — Integración del componente

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Tests: 14 passing

---

_Creado: 2026-02-03 — Completado: 2026-02-05_
