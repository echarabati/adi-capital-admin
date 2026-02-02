# Project Config

> Configuración específica del proyecto para agentes AI.
> **Generado durante:** /discovery

---

## Project Info

**Nombre:** Adi Capital Admin
**Tipo:** internal-tool
**Fecha Inicio:** 2026-02-02
**Deadline:** 2026-02-28
**Cliente:** Abraham Cohen

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

## Stack

| Componente | Tecnología |
|------------|------------|
| Frontend | Next.js 16+ (App Router) |
| Estilos | Tailwind CSS v4 |
| Base de datos | Neon PostgreSQL |
| ORM | Drizzle |
| Auth | NextAuth.js v5 |
| Hosting | Vercel |
| Email | Resend |
| Storage docs | Google Drive API |
| Sync móvil | Firebase Admin SDK |

---

## Project-Specific Rules

```
1. Movimientos Ledger = SSOT — saldos se calculan desde movimientos confirmados
2. Estados de movimientos: Borrador → Confirmado → Cancelado
3. Aislamiento de fondos — inversionistas solo ven su fondo
4. Multi-moneda con tipo de cambio manual
5. Sync a Firebase debe mantener compatibilidad con app Flutter existente
```

---

## Client Context

**Cliente:** Abraham Cohen
**Industria:** Finanzas / Private Equity
**Idioma:** es-MX
**Formalidad:** formal

### Terminología del Dominio

| Término | Significado | Usar en lugar de |
|---------|-------------|------------------|
| Fondo | Entidad de inversión (Adi Capital, Kentucky) | Fund |
| Proyecto | Oportunidad de inversión | Deal/Investment |
| Inversionista | Persona que invierte | Investor |
| Inversión | Participación en un proyecto | Investment |
| Movimiento | Transacción financiera (18 tipos) | Transaction |
| Pref | Preferred Return - retorno preferencial | Preferred return |
| Cascada | Método de distribución | Waterfall |
| Reparto | Distribución de capital + utilidades | Distribution |
| Success Fee | Comisión sobre utilidades | Carried interest |
| Admin Fee | Comisión de administración | Management fee |
| Hurdle | Umbral mínimo de retorno | Hurdle rate |
| Compromiso | Capital call / monto comprometido | Commitment |
| Aportación | Pago de capital call | Capital contribution |

---

## Integrations

| Servicio | Propósito | Prioridad |
|----------|-----------|-----------|
| Firebase Admin SDK | Sync datos a app móvil | MVP |
| Google Drive API | Gestión documental | MVP |
| Resend | Emails transaccionales | MVP |

---

## Quick Reference

**Docs principales:**
- Discovery: `docs/planning/00_DISCOVERY_BRIEFING.md`
- Backlog: `docs/backlog/`
- Planning: `docs/planning/`

**Comandos:**
```bash
pnpm dev          # Development
pnpm build        # Build
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
pnpm db:generate  # Generate migration
pnpm db:migrate   # Apply migration
pnpm db:studio    # Drizzle Studio
```

---

*Generado por TimeKast Factory — /discovery*
