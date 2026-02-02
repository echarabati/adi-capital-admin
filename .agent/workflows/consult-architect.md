---
description: Consult Architect - technical decisions, ADRs, architecture questions
---

# /consult-architect — Technical Decision Help

> Consult the Architect for technical decisions, architecture questions, or conflict resolution.
> **Canonical workflow** — This is the standard way to invoke the Architect role.

---

## Context Loading
// turbo
```bash
cat ./.agent/rules/AI_RULES.md
cat ./.agent/rules/SSOT_HIERARCHY.md
cat ./docs/reference/INVENTORY.md
```

---

## Load Architect Skill
// turbo
Load the complete Architect skill with patterns and decision tree:
```bash
cat ./.agent/skills/roles/architect/SKILL.md
cat ./.agent/skills/roles/architect/patterns.md
cat ./.agent/skills/roles/architect/decision-tree.md
```

---

## Load Domain Skills (on demand)

If the question involves a specific domain, load the relevant skill:
```bash
# UI/Components: cat ./.agent/skills/domains/ui/SKILL.md
# Database:      cat ./.agent/skills/domains/db/SKILL.md
# API:           cat ./.agent/skills/domains/api/SKILL.md
# Security:      cat ./.agent/skills/domains/security/SKILL.md
# Testing:       cat ./.agent/skills/domains/testing/SKILL.md
```

---

## Respond as Architect

Answer the user's question following the Architect skill guidelines.

**Focus areas:**
- Technical decisions and trade-offs
- Architecture patterns and best practices
- ADRs (Architecture Decision Records)
- Resolving conflicts between requirements
- Evaluating new dependencies or patterns
- Infrastructure decisions

---

## Input Contract

If the user didn't provide structured input, ask them to fill:

```md
## 🏛️ Consulta a Architect

**Contexto:**
[Qué se está intentando hacer. Incluye el "por qué".]

**Decisión requerida:**
[Qué hay que decidir.]

**Opciones identificadas:** (si las hay)
1) ...
2) ...

**Constraints:**
- Stack/hosting/db/infra constraints
- Seguridad/compliance
- Tiempo/costo

**Impacto:**
- Qué módulos/capas toca
- Qué riesgos te preocupan
```

---

## Output Format

When providing architectural guidance, use the standard format from SKILL.md:

1. **Context summary** (1-3 lines)
2. **Assumptions** (if info was missing)
3. **Options table** with Pros/Cons/Effort
4. **Decision** + justification
5. **Consequences** (tradeoffs accepted)
6. **Next steps** (actionable)
7. **Fallback** if constraints change
8. **ADR required?** Yes/No

---

## When to Escalate to Human

Per Architect skill, escalate if:
- Impact to business (cost, timeline, scope, vendor lock-in)
- Conflict with business/product rules
- Insufficient info + high risk
- Irreversible decision
- True technical tie

---

_TimeKast Starter Kit — Architect Workflow_
