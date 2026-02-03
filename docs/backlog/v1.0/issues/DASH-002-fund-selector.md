# DASH-002: CMP-007 FundSelector

> **Issue ID:** DASH-002
> **Priority:** P2
> **Effort:** S
> **Status:** 📋 Backlog
> **Epic:** [E10-EPIC-PANEL](../epics/EPIC-PANEL.md)

## 🎯 Objetivo

Crear dropdown en header para filtrar por fondo activo.

## User Story

> Como **P-001/P-002**, quiero **seleccionar el fondo activo** para **filtrar todas las vistas**.

---

## 📚 Referencias

- Design: [SCR-001](../../planning/09_DESIGN.md#scr-001-dashboard)
- Business Rules: [BR-052](../../planning/04_BUSINESS_RULES.md#br-052) — Multi-fondo

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Super Admin ve todos los fondos
  Given que soy Super Admin
  When abro el FundSelector
  Then veo todos los fondos: Adi Capital, Kentucky, etc.

Scenario: Admin de Fondo ve solo asignados
  Given que soy Admin de Fondo asignado a Kentucky
  When abro el FundSelector
  Then solo veo "Kentucky"
  And el dropdown está disabled (un solo fondo)

Scenario: Selección persiste entre sesiones
  Given que selecciono "Adi Capital"
  When cierro y reabro el navegador
  Then el fondo "Adi Capital" sigue seleccionado

Scenario: Cambio de fondo afecta queries
  Given que estoy viendo proyectos de Kentucky
  When cambio el selector a "Adi Capital"
  Then la lista de proyectos se actualiza mostrando solo Adi Capital
```

- [ ] Dropdown en header (derecha de breadcrumbs)
- [ ] Lista fondos del usuario según RBAC
- [ ] Persiste selección en cookie (server-readable)
- [ ] Afecta queries globales vía context/middleware
- [ ] Si solo hay 1 fondo: mostrar como texto, no dropdown

---

**Dependencias de Issues:**

- Bloqueado por: FOND-001
- Bloquea a: DASH-001

## 🧪 Tests Requeridos

- [ ] Unit: Render según rol
- [ ] Integration: Cambio refresca datos

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
