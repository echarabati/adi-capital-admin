# project-config.template.md

> Template para configuración del proyecto.
> **Uso:** Se crea durante `/setup` en `.gemini/project-config.md`

---

## Template

```markdown
# Project Config

> Configuración específica del proyecto para agentes AI.
> **Generado durante:** /setup

---

## Project Info

**Nombre:** {{nombre_proyecto}}
**Tipo:** {{saas-mvp | internal-tool | landing | custom}}
**Fecha Inicio:** {{fecha}}

---

## Active Skills

### Domains (contexto técnico)
- [x] ui — React/Next.js components, Tailwind
- [x] db — Drizzle ORM, Neon Postgres
- [x] api — Server Actions, API Routes
- [x] security — Auth, validation, permissions
- [x] testing — Vitest, Playwright

### Roles (expertos consultivos)
- [x] architect — Decisiones técnicas, ADRs
- [x] quality-engineer — Auditoría, testing

---

## Stack Overrides

<!-- Si el proyecto difiere del stack estándar -->

| Componente | Estándar | Este Proyecto | Razón |
|------------|----------|---------------|-------|
| — | — | — | — |

---

## Project-Specific Rules

<!-- Reglas adicionales para este proyecto -->

```
1. [Regla específica del proyecto]
2. [Otra regla]
```

---

## Client Context

<!-- Terminología y contexto del cliente -->

**Cliente:** {{nombre_cliente}}
**Industria:** {{industria}}
**Idioma:** {{es-MX | en-US}}
**Formalidad:** {{formal | casual}}

### Terminología del Dominio

| Término | Significado | Usar en lugar de |
|---------|-------------|------------------|
| {{término}} | {{significado}} | {{término genérico}} |

<!-- Ejemplos:
| Partida | Línea de cotización | line item |
| Remisión | Nota de entrega | shipping doc |
| Finiquito | Cierre de proyecto | settlement |
-->

---

## Integrations

<!-- Servicios externos que usa este proyecto -->

| Servicio | Propósito | Docs |
|----------|-----------|------|
| Stripe | Pagos | [stripe.md](docs/integrations/stripe.md) |
| Resend | Emails | [email.md](docs/integrations/email.md) |

---

## Quick Reference

**Docs principales:**
- Design: `docs/design/DESIGN.md`
- Backlog: `docs/backlog/README.md`
- Planning: `docs/planning/`

**Comandos:**
```bash
pnpm dev          # Development
pnpm build        # Build
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
pnpm db:push      # Apply schema
```

---

*Generado por TimeKast Factory — /setup*
```

---

## Cuándo se Crea

- Durante `/setup` workflow
- Una vez por proyecto
- Actualizar manualmente si cambia el stack

---

## Archivos Relacionados

- `AI_RULES.md` — Reglas globales
- `.github/copilot-instructions.md` — Instrucciones Copilot
- `.gemini/skills/` — Skills activos

---

_Template del TimeKast Factory_
