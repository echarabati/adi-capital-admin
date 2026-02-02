---
description: Consult QE - quality review, security audit, pre-release validation
---

# /consult-qe — Quality Engineering Review

> Request quality verification, security audit, or pre-release validation.
> **Canonical workflow** — Standard way to invoke the Quality Engineer role.

---

## Context Loading
// turbo
```bash
cat ./.agent/rules/AI_RULES.md
cat ./docs/reference/INVENTORY.md
```

---

## Load Quality Engineer Skill
// turbo
```bash
cat ./.agent/skills/roles/quality-engineer/SKILL.md
```

---

## Load Domain Skills (on demand)

If the review involves specific domains:
```bash
# Security-heavy: cat ./.agent/skills/domains/security/SKILL.md
# Testing:        cat ./.agent/skills/domains/testing/SKILL.md
# DB changes:     cat ./.agent/skills/domains/db/SKILL.md
# API changes:    cat ./.agent/skills/domains/api/SKILL.md
```

---

## Input Contract

Ask the user to provide (if not already given):

```md
## 🧪 Solicitud de Quality Review

**Scope:**
- [ ] PR / [ ] Issue / [ ] Release tag: ___

**Tipo de cambio:**
- [ ] UI-only
- [ ] DB/Schema
- [ ] Auth/RBAC
- [ ] API/Server Actions
- [ ] Infra/Config

**Risk tier:** R0 / R1 / R2 / R3

**Entorno:** local / preview / staging / prod

**Rutas/flujos afectados:**
- ...

**Comandos disponibles:**
- [ ] pnpm lint
- [ ] pnpm typecheck
- [ ] pnpm test
- [ ] pnpm test:e2e
- [ ] pnpm build
```

---

## Process

1. **Classify** — Determine Risk Tier (R0-R3)
2. **Execute** — Run Quality Gate for that tier
3. **Audit** — Review code for security, quality, patterns
4. **Report** — Generate Quality Report with findings
5. **Verdict** — READY / READY WITH WARNINGS / NOT READY

---

## Output Format

Use the standard Quality Report format from SKILL.md:

```markdown
## 🧪 Quality Report

**Scope:** [PR-XXX / Issue / v1.2.0]
**Risk Tier:** R#
**Date:** YYYY-MM-DD

### Automated Checks
[table]

### Findings
[table with severity, category, description, location, evidence]

### Coverage Statement
**Probado:** [qué se verificó]
**NO probado:** [qué quedó fuera]

### Recommendations
1. ...

### Verdict
✅ / 🟡 / 🔴 + justificación
```

---

## When to Escalate

Escalate to human if:
- Multiple BLOCKERs found
- Security vulnerability confirmed
- Unclear if issue is business-critical
- Need access to staging/prod for verification

---

_TimeKast Starter Kit — Quality Engineer Workflow_
