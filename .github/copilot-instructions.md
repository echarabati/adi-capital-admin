# TimeKast Factory 2.0 — Copilot Instructions

> **Referencia rápida para GitHub Copilot y agentes AI.**
> Para flujos de trabajo, ver `.agent/workflows/`.
> Para reglas completas, ver `AI_RULES.md` (SSOT).
> Para skills por dominio, ver `.gemini/skills/`.

---

## 🏭 TimeKast Factory

Este proyecto usa **TimeKast Factory 2.0** — metodología AI-first con skills y workflows autocontenidos.

**SSOT Hierarchy:**

```
AI_RULES.md → .gemini/skills/ → .agent/workflows/ → code
```

---

## 🚨 Security Notice — CVE-2025-55182

**RCE crítico en React Server Components (React2Shell)**

- **Versión requerida:** Next.js ≥ 16.0.7
- **Antes de PR:** `pnpm list next` → verificar versión parchada
- **NO aprobar PRs** con versiones vulnerables

---

## Stack Tecnológico

| Capa      | Tecnología                 |
| --------- | -------------------------- |
| Framework | Next.js 16+ (App Router)   |
| Lenguaje  | TypeScript (strict mode)   |
| ORM       | Drizzle ORM                |
| Database  | Neon Postgres (serverless) |
| Auth      | NextAuth.js v5             |
| UI        | Tailwind CSS + shadcn/ui   |
| Hosting   | Vercel                     |

---

## Arquitectura 2.0

### Skills (en lugar de Agents)

```
.gemini/skills/
├── domains/          # Domain knowledge
│   ├── ui/           # React, Tailwind, accesibilidad
│   ├── db/           # Drizzle, schema, migrations
│   └── api/          # Server Actions, validation
└── roles/            # Role-based behaviors
    ├── discovery/    # Entender proyecto
    ├── docs/         # Generar documentación
    ├── design/       # Especificación UI/UX
    ├── backlog/      # Crear issues
    ├── implement/    # Ejecutar issues
    └── architect/    # Decisiones técnicas
```

### Workflows

```
.agent/workflows/
├── start.md          # Inicializar sesión
├── discovery.md      # Entender proyecto
├── docs.md           # Generar docs 01-05
├── design.md         # Generar 06_DESIGN
├── backlog.md        # Crear issues
├── implement.md      # Ejecutar issue
├── park.md           # Guardar ideas
└── audit.md          # Verificar calidad
```

---

## 🚀 Flujos de Trabajo

### Bootstrap (Nuevo Proyecto)

```
/start → /discovery → /docs → /design → /backlog → /implement
```

### Desarrollo Diario

```bash
/implement AUTH-001       # Implementar issue específico
/park "idea para después" # Guardar idea sin interrumpir
/audit                    # Verificar calidad
```

### SSOT Chain

```
Discovery Brief → docs (01-05) → design (06) → backlog → code
```

---

## 📋 Quick Reference

### Estados de Issues

| Status      | Emoji | Significado   |
| ----------- | ----- | ------------- |
| Backlog     | 📋    | Pendiente     |
| In Progress | 🚧    | En desarrollo |
| Blocked     | 🚫    | Bloqueado     |
| Completed   | ✅    | Terminado     |

### Prioridades

| Priority | Significado                   |
| -------- | ----------------------------- |
| P0       | Blocker — sin esto no hay MVP |
| P1       | MVP crítico                   |
| P2       | Importante                    |
| P3       | Nice-to-have                  |

### Cuándo Escalar

```
🏛️ /consult-architect si:
- Decisión de arquitectura
- Tradeoff técnico (cache, auth, state)
- API contract indefinido
- Performance vs complexity

✅ Decidir autónomamente:
- Implementación dentro del scope
- Refactoring sin cambio de comportamiento
- Agregar tests
- Fixes de lint/types
```

---

## ⚠️ Reglas Críticas

```
1. NUNCA implementar sin leer el issue primero
2. SIEMPRE verificar: pnpm typecheck && pnpm lint && pnpm build
3. Drizzle schema es SSOT → Zod deriva del schema
4. Markdown backlog es SSOT → No inventar features
5. Cerrar issues con Implementation Notes
6. Conventional commits siempre
```

---

## Comandos de Verificación

```bash
pnpm typecheck        # TypeScript
pnpm lint             # ESLint
pnpm test             # Vitest
pnpm test:e2e         # Playwright
pnpm build            # Build completo
```

---

## Jerarquía de Documentos

| Prioridad  | Documento                     |
| ---------- | ----------------------------- |
| 1 (máxima) | `AI_RULES.md`                 |
| 2          | `.gemini/skills/domains/*.md` |
| 3          | `.gemini/skills/roles/*.md`   |
| 4          | `.agent/workflows/*.md`       |
| 5          | Este archivo                  |

> **Si hay conflicto → manda AI_RULES.md**

---

## Compatibilidad Multi-IDE

| IDE             | Usa                                              |
| --------------- | ------------------------------------------------ |
| VS Code, Cursor | `.github/copilot-instructions.md` (este archivo) |
| Antigravity     | `.agent/workflows/` + `.gemini/skills/`          |

> **Nota:** Este archivo es un **pointer** a la documentación completa.
> Para contexto completo, cargar `AI_RULES.md` y skills relevantes.

---

_TimeKast Factory 2.0_
