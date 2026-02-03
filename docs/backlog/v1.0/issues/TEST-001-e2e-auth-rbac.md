# TEST-001: E2E Auth + RBAC

> **Issue ID:** TEST-001
> **Priority:** P0
> **Effort:** M (3 pts)
> **Status:** 📋 Backlog
> **Epic:** [E02-EPIC-FONDOS](../epics/EPIC-FONDOS.md)

## 🎯 Objetivo

Validar flujo completo de autenticación y aislamiento de fondos por rol.

## Tipo de Issue

> **QA Issue** — Ejecutar después de completar E02 (FONDOS)

---

## 📚 Referencias

- Business Rules: [BR-050](../../planning/04_BUSINESS_RULES.md#br-050) — RBAC
- Roles: [02_PERSONAS.md](../../planning/02_PERSONAS.md)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Super Admin ve todos los fondos
  Given que estoy autenticado como Super Admin (Abraham)
  When navego a /fondos
  Then veo "Adi Capital" y "Kentucky" en la lista

Scenario: Admin de Fondo ve solo asignados
  Given que estoy autenticado como Admin de Fondo (Olga, solo Kentucky)
  When navego a /fondos
  Then veo solo "Kentucky"
  And no veo "Adi Capital"

Scenario: Intentar acceder a fondo no autorizado
  Given que estoy autenticado como Admin de Fondo (Kentucky only)
  When navego a /fondos/{adi-capital-id}
  Then recibo error 403 Forbidden
  And soy redirigido a /dashboard

Scenario: Login fallido
  Given que ingreso credenciales incorrectas
  Then veo mensaje "Credenciales inválidas"
  And no se crea sesión

Scenario: Persistencia de sesión
  Given que estoy autenticado
  When cierro y reabro el navegador
  Then sigo autenticado (cookie válida)
```

- [ ] Super Admin accede a ambos fondos
- [ ] Admin de Fondo accede solo a fondos asignados
- [ ] Protección de rutas funciona correctamente
- [ ] Login/Logout funcionan
- [ ] Sesión persiste en cookie

---

## 🔧 Contexto Técnico

**Test Files:**

- `tests/e2e/auth.spec.ts`
- `tests/e2e/rbac.spec.ts`

**Commands:**

```bash
pnpm test:e2e tests/e2e/auth.spec.ts
pnpm test:e2e tests/e2e/rbac.spec.ts
```

**Setup:**

- Crear usuarios de prueba: super_admin@test.com, admin_kentucky@test.com
- Seed data con 2 fondos

---

**Dependencias de Issues:**

- Bloqueado por: SCHEMA-003, FOND-001
- Bloquea a: — (pero requerido para /audit R2 de E02)

---

_Creado: 2026-02-03 — QE Strategy_
