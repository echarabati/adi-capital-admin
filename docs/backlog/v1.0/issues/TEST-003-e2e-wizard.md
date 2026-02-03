# TEST-003: E2E Wizard Reparto

> **Issue ID:** TEST-003
> **Priority:** P0
> **Effort:** L (5 pts)
> **Status:** 📋 Backlog
> **Epic:** [E08-EPIC-WIZARD](../epics/EPIC-WIZARD.md)

## 🎯 Objetivo

Validar flujo completo del Wizard de Reparto incluyendo cálculos de cascada y generación de movimientos.

## Tipo de Issue

> **QA Issue** — Ejecutar después de completar E08 (WIZARD)

---

## 📚 Referencias

- Business Rules: [BR-030→040](../../planning/04_BUSINESS_RULES.md#br-030) — Cascada
- Flow: [FLW-002](../../planning/09_DESIGN.md#flw-002-wizard-de-reparto)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Wizard con método Pref Primero (Adi Capital)
  Given que el fondo usa método "pref_primero"
  And hay un proyecto con $100,000 a distribuir
  And Juan tiene capital_aportado = $50,000 y pref_acumulado = $5,000
  And María tiene capital_aportado = $50,000 y pref_acumulado = $3,000
  When ejecuto el Wizard con monto $20,000
  Then primero se paga el Pref:
    | Inversionista | Pref Pagado | Capital Devuelto |
    | Juan          | $5,000      | $5,000           |
    | María         | $3,000      | $7,000           |
  And el total cuadra: $5k + $3k + $5k + $7k = $20k

Scenario: Wizard con método Capital Primero (Kentucky)
  Given que el fondo usa método "capital_primero"
  And mismo escenario anterior
  When ejecuto el Wizard con monto $20,000
  Then primero se devuelve Capital proporcional
  And luego se paga Pref con el resto

Scenario: Success Fee sobre utilidades
  Given que el proyecto tiene success_fee_pct = 20%
  And Juan invirtió $50,000 y recibe distribución de $70,000
  Then la utilidad de Juan es $20,000
  And el Success Fee es $4,000 (20% de $20k)
  And se genera movimiento FEE por $4,000

Scenario: Preview antes de confirmar
  Given que estoy en el paso 3 del Wizard
  Then veo el desglose por inversionista:
    | Inversionista | Pref | Capital | Utilidad | Fee | Total |
  And puedo revisar antes de confirmar

Scenario: Confirmar genera movimientos
  Given que confirmo el reparto
  Then se generan N movimientos DIS (uno por inversionista)
  And se generan movimientos FEE si hay utilidades
  And todos comparten el mismo grupo_movimiento
```

- [ ] Cascada Pref Primero funciona correctamente
- [ ] Cascada Capital Primero funciona correctamente
- [ ] Success Fee se calcula solo sobre utilidades
- [ ] Preview muestra desglose correcto
- [ ] Confirmar genera movimientos agrupados
- [ ] Totales cuadran (sin centavos perdidos)

---

## 🔧 Contexto Técnico

**Test Files:**

- `tests/e2e/wizard.spec.ts`
- `tests/unit/cascade.test.ts` (cálculos unitarios)

**Setup:**

- 2 fondos con diferente método de cascada
- Proyecto con inversionistas y pref acumulado
- Seed de datos financieros de prueba

**Commands:**

```bash
pnpm test:e2e tests/e2e/wizard.spec.ts
pnpm test tests/unit/cascade.test.ts
```

---

## 📊 Validación Manual Adicional

> Este issue requiere **validación manual** con casos del cliente:

1. Tomar caso real de distribución de Sheets
2. Simular en el sistema
3. Comparar resultados vs cálculo original
4. Documentar diferencias (si las hay)

---

**Dependencias de Issues:**

- Bloqueado por: WIZ-001 → WIZ-004
- Bloquea a: — (pero requerido para /audit R2 de E08)

---

_Creado: 2026-02-03 — QE Strategy_
