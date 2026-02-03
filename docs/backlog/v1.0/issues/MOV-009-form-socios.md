# MOV-009: Form Movimientos Socios (APS/RPS/PRS/DPRS)

> **Issue ID:** MOV-009
> **Priority:** P0
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E06-EPIC-MOVIMIENTOS](../epics/EPIC-MOVIMIENTOS.md)

---

## 🎯 Objetivo

Implementar variantes del form de movimiento para operaciones exclusivas de socios/fundadores.

## User Story

> Como **P-001/P-002**, quiero **registrar movimientos de socios** para **gestionar capital de fundadores**.

---

## 📚 Referencias

**Schema:**

- [E-005: Movimientos](../../planning/05_DATA_MODEL.md#e-005-movimientos)

**Business Rules:**

- [BR-012](../../planning/04_BUSINESS_RULES.md#br-012) — Solo fundadores pueden recibir estos conceptos
- [BR-027](../../planning/04_BUSINESS_RULES.md#br-027) — Validaciones por concepto

**API Contract:**

- `createMovimiento` con conceptos socios (07_API_CONTRACTS.md L282-306)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Registrar aporte de socio
  Given que soy Admin
  And selecciono concepto "APS" (Aporte Socio)
  When selecciono un inversionista que NO es fundador
  Then el sistema muestra error "Solo fundadores pueden recibir este tipo de movimiento"

Scenario: APS válido
  Given que selecciono un inversionista que ES fundador
  And ingreso monto $50,000 USD
  When guardo el movimiento
  Then se crea en estado borrador
  And queda listo para confirmar
```

- [ ] Conceptos soportados: APS, RPS, PRS, DPRS
- [ ] Validación: inversionista.esFundador = true (BR-012)
- [ ] Form muestra campos: Inversionista (filter fundadores), Monto, Fecha, Descripción
- [ ] Para PRS/DPRS: campo adicional de porcentaje
- [ ] Toast error si inversionista no es fundador

## 🔧 Contexto Técnico

**Conceptos:**
| Código | Nombre | Descripción |
|--------|--------|-------------|
| APS | Aporte Socio | Capital del fundador |
| RPS | Retorno Socio | Devolución a fundador |
| PRS | Participación Socio | Utilidad a fundador |
| DPRS | Dev. Part. Socio | Devolución de participación |

**Archivos a crear/modificar:**

- `src/components/movimientos/form-socios.tsx`
- Integrar en `MovimientoForm` switch de concepto

---

**Dependencias de Issues:**

- Bloqueado por: MOV-002 (form base)
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Validación fundador
- [ ] Integration: Crear APS para fundador exitoso
- [ ] Integration: Rechazar APS para no-fundador

## 🚫 Out of Scope

- Cálculo de porcentaje automático (Post-MVP)

---

_Creado: 2026-02-03 — Remediación GAP-03_
