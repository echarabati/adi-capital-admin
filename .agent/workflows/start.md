---
description: Initialize session - load project context and show status
---

# /start — Session Initialization

> Load project context, rules, and available resources for AI-first development.
> Run this at the start of every session.
>
> **TimeKast Factory v2.3** — 2026-02-02

---

## Phase 1: Core Context Loading

// turbo

```bash
cat ./.agent/rules/AI_RULES.md
```

// turbo

```bash
cat ./.agent/rules/SSOT_HIERARCHY.md
```

---

## Phase 2: Project Config & Inventory

// turbo

```bash
cat ./.agent/project-config.md 2>/dev/null || echo "No project-config.md"
```

// turbo

```bash
cat ./docs/reference/INVENTORY.md 2>/dev/null || echo "No INVENTORY.md - run 'pnpm generate:inventory' to create"
```

---

## Phase 3: Backlog Status

> **Prioridad:** BOARD.md (auto-generado, confiable) > README (manual, puede estar desactualizado)

// turbo

```bash
# 1. BOARD.md es la fuente más confiable (auto-actualizado en commits)
if [ -f "./docs/backlog/BOARD.md" ]; then
  echo "📋 Sprint Board (auto-generated):"
  cat ./docs/backlog/BOARD.md
else
  echo "⬜ No BOARD.md - run 'pnpm update-board' to generate"
fi
```

// turbo

```bash
# 2. README del backlog para contexto adicional (puede estar desactualizado)
VERSION=$(ls -d ./docs/backlog/v*/ 2>/dev/null | sort -V | tail -1 | xargs basename 2>/dev/null || echo "none")
if [ "$VERSION" != "none" ]; then
  echo ""
  echo "📄 Backlog README (v$VERSION):"
  echo "---"
  # Solo mostrar primeras 30 líneas del README (resumen)
  head -30 ./docs/backlog/${VERSION}/README.md 2>/dev/null || true
  echo "..."
  echo "(Use 'cat docs/backlog/${VERSION}/README.md' for full context)"
else
  echo "No backlog versions - run /backlog to create"
fi
```

> **Nota:** Si BOARD.md y README difieren, BOARD.md es la fuente de verdad.

---

## Phase 4: Project Status Check

// turbo

```bash
# Git status
git branch --show-current 2>/dev/null || true
git status --short 2>/dev/null || true
```

---

## Phase 5: Available Skills

List available skills for on-demand loading:

### Role Skills

| Skill            | Invocation           | Use Case                                  |
| ---------------- | -------------------- | ----------------------------------------- |
| Discovery Expert | `/discovery`         | Product discovery, requirements gathering |
| Proposal Expert  | `/proposal`          | Client-facing scope document              |
| Docs Expert      | `/docs`              | Generate planning docs (01-06)            |
| Design Expert    | `/design`            | Generate 06_DESIGN.md                     |
| Backlog Expert   | `/backlog`           | Create issues from design                 |
| Implement Expert | `/implement`         | Execute issues through pipeline           |
| Architect        | `/consult-architect` | Technical decisions, ADRs                 |
| Quality Engineer | `/consult-qe`        | Quality review, audits                    |

### Domain Skills (load on demand)

| Skill       | When to Load                  |
| ----------- | ----------------------------- |
| `api/`      | API routes, server actions    |
| `db/`       | Database, Drizzle, migrations |
| `security/` | Auth, RBAC, security review   |
| `testing/`  | Tests, coverage, fixtures     |
| `ui/`       | Components, design system     |

---

## Phase 6: Development Pipeline

### 🚀 Flujo de Desarrollo Completo

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ /discovery  │───►│ /proposal   │───►│   /docs     │
│ Brief       │    │ Cliente     │    │ Técnico     │
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
                   ┌─────────────┐    ┌──────▼──────┐
                   │ /implement  │◄───│  /backlog   │◄──┐
                   │ Code        │    │  Issues     │   │
                   └─────────────┘    └─────────────┘   │
                                                        │
                                      ┌─────────────┐   │
                                      │  /design    │───┘
                                      │  UI/UX      │
                                      └─────────────┘
```

### ¿Dónde estás?

| Si tienes...         | Siguiente paso           | Workflow              |
| -------------------- | ------------------------ | --------------------- |
| Nada / idea inicial  | Entender el problema     | `/discovery`          |
| Discovery Brief      | Propuesta para cliente   | `/proposal`           |
| Propuesta aprobada   | Documentación técnica    | `/docs`               |
| Docs 01-05 completos | Especificación UI/UX     | `/design`             |
| Design 06 completo   | Crear issues del backlog | `/backlog`            |
| Issues en backlog    | Implementar código       | `/implement ISSUE-ID` |

---

## Phase 7: Available Workflows

### Bootstrap Pipeline

| Workflow     | Purpose                        | Prerequisito      | Output                       |
| ------------ | ------------------------------ | ----------------- | ---------------------------- |
| `/discovery` | Entender problema y requisitos | Input del usuario | `00_DISCOVERY_BRIEF.md`      |
| `/proposal`  | Propuesta para cliente         | Discovery Brief   | `docs/proposal/PROPOSAL.md`  |
| `/docs`      | Documentación técnica (01-05)  | Proposal aprobada | `docs/planning/01-05_*.md`   |
| `/design`    | Especificación UI/UX           | Docs 01-05        | `docs/planning/06_DESIGN.md` |
| `/backlog`   | Crear issues del diseño        | Design 06         | Issues en `docs/backlog/`    |
| `/implement` | Implementar issue              | Issue ID          | Código + tests               |

### Utilities

| Workflow             | Purpose               | Cuándo usar                      |
| -------------------- | --------------------- | -------------------------------- |
| `/start`             | Inicializar sesión    | Al comenzar cada sesión          |
| `/park`              | Guardar ideas         | Cuando surge algo fuera de scope |
| `/audit`             | Quality audit (R0-R3) | Pre-release o post-epic          |
| `/consult-architect` | Decisiones técnicas   | Schema, patterns, trade-offs     |
| `/consult-qe`        | Quality review        | Security, performance            |

---

## Phase 8: Output Summary

Present to user:

```markdown
## 🚀 Session Initialized

### 📋 Loaded Context

- [x] AI_RULES.md
- [x] SSOT_HIERARCHY.md
- [x] project-config.md (or note if missing)
- [x] INVENTORY.md (or note if missing)

### 📊 Project Status

- **Project:** [name from project-config]
- **Branch:** [current branch]
- **Uncommitted changes:** [yes/no]

### 📋 Backlog Status

- **Version:** [v1.0 or latest]
- **Open issues:** [count] (📋 Backlog)
- **In progress:** [count] (🚧 In Progress)
- **Blocked:** [count] (🚫 Blocked)

### 🛠️ Available Actions

| Action             | Command               |
| ------------------ | --------------------- |
| Implement feature  | `/implement AUTH-001` |
| Create issues      | `/backlog`            |
| Technical decision | `/consult-architect`  |
| Quality review     | `/audit`              |
| Park idea          | `/park "idea"`        |

### 💡 Suggested Next

Based on project status:

- If issues in progress → Continue with `/implement {ISSUE-ID}`
- If clean state → "Ready for `/implement` or `/audit`"
- If uncommitted changes → "Review changes before proceeding"
```

### 💡 ¿Qué quieres hacer?

**📍 Bootstrap (proyectos nuevos):**

| #   | Paso                  | Workflow              | Descripción                |
| --- | --------------------- | --------------------- | -------------------------- |
| 1   | Entender problema     | `/discovery`          | Genera Discovery Brief     |
| 2   | Crear propuesta       | `/proposal`           | Documento para cliente     |
| 3   | Documentación técnica | `/docs`               | 01-05 planning docs        |
| 4   | Diseño UI/UX          | `/design`             | 06_DESIGN.md               |
| 5   | Crear issues          | `/backlog`            | Convierte diseño en issues |
| 6   | Implementar           | `/implement ISSUE-ID` | Código + tests             |

**🔧 Desarrollo (proyectos existentes):**

| #   | Acción              | Workflow              | Cuándo                    |
| --- | ------------------- | --------------------- | ------------------------- |
| 7   | Implementar feature | `/implement AUTH-001` | Tienes issue en backlog   |
| 8   | Guardar idea        | `/park "idea"`        | Surge algo fuera de scope |
| 9   | Auditoría           | `/audit`              | Pre-release o post-epic   |

**🏛️ Consultar expertos:**

| #   | Experto          | Workflow             | Cuándo                         |
| --- | ---------------- | -------------------- | ------------------------------ |
| 10  | Arquitecto       | `/consult-architect` | Decisiones de schema, patterns |
| 11  | Quality Engineer | `/consult-qe`        | Revisión de calidad, security  |

---

## Optional: Deep Context Loading

If user asks for more context or working on specific area:

```bash
# Load specific domain skill
cat ./.agent/skills/domains/[domain]/SKILL.md

# Load project design (if exists)
cat ./docs/planning/DESIGN.md 2>/dev/null || true
```

---

## Notes

- **Always load AI_RULES.md** — Critical rules for agent behavior
- **Check INVENTORY.md** — Prevents duplicate component creation
- **Check project-config** — Project metadata and stack info
- **Skills are on-demand** — Don't load all skills at once (too much context)

---

_TimeKast Starter Kit — Session Initialization Workflow_
