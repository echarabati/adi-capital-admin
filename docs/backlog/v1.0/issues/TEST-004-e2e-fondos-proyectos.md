# TEST-004: E2E Fondos y Proyectos

> **Issue ID:** TEST-004
> **Priority:** P1
> **Effort:** M (3 pts)
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E02-EPIC-FONDOS](../epics/EPIC-FONDOS.md)

## 🎯 Objetivo

Validar flujo completo de CRUD de Fondos y Proyectos, incluyendo navegación anidada y tabs.

## Tipo de Issue

> **QA Issue** — Ejecutar después de completar E02 y E03 epics

---

## 📚 Referencias

- Issues: FOND-001 ✅, FOND-002 ✅, FOND-003 ✅, FOND-004 ✅, FOND-005 ✅
- Issues: PROJ-001 ✅, PROJ-002 ✅, PROJ-003 ✅, PROJ-004 ✅, PROJ-005 ✅

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Crear un fondo nuevo
  Given que estoy autenticado como Super Admin
  When navego a /fondos y click "Nuevo Fondo"
  And lleno el formulario con datos válidos
  Then el fondo aparece en la lista

Scenario: Navegar a detalle de fondo
  Given que existe el fondo "Adi Capital"
  When click en la fila del fondo
  Then veo la página de detalle con tabs

Scenario: Crear proyecto dentro de un fondo
  Given que estoy en /fondos/{id}
  When navego al tab "Proyectos"
  And click "Nuevo Proyecto"
  And lleno el formulario con datos válidos
  Then el proyecto aparece en la lista del fondo

Scenario: Navegar a detalle de proyecto
  Given que existe un proyecto en el fondo
  When click en la fila del proyecto
  Then veo detalle con tabs (Inversiones, Movimientos, Documentos)

Scenario: CRUD Cuentas Bancarias
  Given que estoy en /fondos/{id}/cuentas
  When creo una nueva cuenta bancaria
  Then la cuenta aparece en la lista
  And puedo editarla y eliminarla

Scenario: CRUD Beneficiarios
  Given que estoy en /fondos/{id}/beneficiarios
  When creo un nuevo beneficiario
  Then el beneficiario aparece en la lista
  And puedo editarlo y eliminarlo
```

- [x] Crear/editar/eliminar fondos funciona
- [x] Navegación anidada fondo → proyectos funciona
- [x] Crear/editar proyectos dentro de fondo funciona
- [x] Tabs de detalle de proyecto funcionan
- [x] CRUD de cuentas bancarias y beneficiarios funciona

---

## 🔧 Contexto Técnico

**Test Files:**

- `tests/e2e/fondos-crud.spec.ts`
- `tests/e2e/proyectos-crud.spec.ts`

**Commands:**

```bash
pnpm test:e2e tests/e2e/fondos-crud.spec.ts tests/e2e/proyectos-crud.spec.ts
```

---

**Dependencias de Issues:**

- Bloqueado por: FOND-001-005 ✅, PROJ-001-005 ✅
- Bloquea a: — (pero requerido para /audit R2 de E02+E03)

---

## Implementation Notes

**Completed:** 2026-02-05

**Context & Decisions:**

- **Resumen:** Fixed 2 failing E2E tests by improving wait strategies
- **Problema 1:** Fondos create test failed because table didn't refresh immediately after dialog closed (revalidation timing)
- **Problema 2:** Proyectos edit test timed out waiting for dialog to close
- **Solución:** Used `expect.poll()` for robust polling instead of immediate assertions

**Files modified:**

- `tests/e2e/fondos-crud.spec.ts` — Used `expect.poll()` for table content verification
- `tests/e2e/proyectos-crud.spec.ts` — Added codigo field check + polling for dialog close

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] E2E Tests: 11/11 passing (22.5s)

---

_Creado: 2026-02-05 — Por solicitud de QA_
