---
description: Initialize session - load project context and show status
---

# /start — Session Initialization

> Load project context, rules, and available resources for AI-first development.
> Run this at the start of every session.
>
> **TimeKast Factory v2.2** — 2026-01-30

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
| Skill | Invocation | Use Case |
|-------|------------|----------|
| Discovery Expert | `/discovery` | Product discovery, requirements gathering |
| Proposal Expert | `/proposal` | Client-facing scope document |
| Docs Expert | `/docs` | Generate planning docs (01-06) |
| Design Expert | `/design` | Generate 06_DESIGN.md |
| Backlog Expert | `/backlog` | Create issues from design |
| Implement Expert | `/implement` | Execute issues through pipeline |
| Architect | `/consult-architect` | Technical decisions, ADRs |
| Quality Engineer | `/consult-qe` | Quality review, audits |

### Domain Skills (load on demand)
| Skill | When to Load |
|-------|--------------|
| `api/` | API routes, server actions |
| `db/` | Database, Drizzle, migrations |
| `security/` | Auth, RBAC, security review |
| `testing/` | Tests, coverage, fixtures |
| `ui/` | Components, design system |

---

## Phase 6: Available Workflows

| Workflow | Purpose |
|----------|---------|
| `/start` | Initialize session (this) |
| `/discovery` | Understand problem, generate Discovery Brief |
| `/proposal` | Generate client-facing scope document |
| `/docs` | Generate planning docs (01-06) |
| `/design` | Generate 06_DESIGN.md |
| `/backlog` | Create issues from design |
| `/implement` | Execute issue through pipeline |
| `/park` | Capture ideas without interrupting flow |
| `/audit` | Quality audit (R0-R3 tiers) |
| `/consult-architect` | Technical decisions, ADRs |
| `/consult-qe` | Quality review |

---

## Phase 7: Output Summary

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
| Action | Command |
|--------|---------|
| Implement feature | `/implement AUTH-001` |
| Create issues | `/backlog` |
| Technical decision | `/consult-architect` |
| Quality review | `/audit` |
| Park idea | `/park "idea"` |

### 💡 Suggested Next
Based on project status:
- If issues in progress → Continue with `/implement {ISSUE-ID}`
- If clean state → "Ready for `/implement` or `/audit`"
- If uncommitted changes → "Review changes before proceeding"
```

### 💡 ¿Qué quieres hacer?

| # | Acción | Workflow | Ejemplo |
|---|--------|----------|---------|
| 1 | Entender problema | `/discovery` | Genera Discovery Brief |
| 2 | Crear propuesta (cliente) | `/proposal` | Documento de alcance |
| 3 | Generar docs de planning | `/docs` | 01_FEATURE_MAP → 06_DESIGN |
| 4 | Crear issues del diseño | `/backlog` | Convierte diseño en issues |
| 5 | Implementar feature | `/implement ISSUE-ID` | `/implement AUTH-001` |
| 6 | Guardar idea | `/park "idea"` | Ideas para después |
| 7 | Auditoría de calidad | `/audit` | Te preguntará tier (R0-R3) |

**Consultar expertos:**

| # | Experto | Workflow | Cuándo |
|---|---------|----------|--------|
| 8 | Arquitecto | `/consult-architect` | Decisiones de schema, patterns, trade-offs |
| 9 | Quality Engineer | `/consult-qe` | Revisión de calidad, security |

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
