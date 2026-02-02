---
description: Post-implementation quality check - validates changes against issue requirements
---

# /qc — Quality Check

> **Subworkflow de /implement** — Phase 5 obligatorio antes de cerrar.
> **Input:** Issue ID
> **Output:** ✅ PASS / 🛑 STOP / 🔴 FAIL

---

## Load Issue

// turbo
```bash
cat ./docs/backlog/*/issues/${ISSUE_ID}*.md
```

---

## Check 1: Issue Compliance

Para cada AC del issue:
```
[ ] AC1 → ¿Hay código/test que lo implemente?
[ ] AC2 → ¿Hay código/test que lo implemente?
...
```

**Verdict:** ✅ All covered / 🔴 Missing AC#

---

## Check 2: Tests Exist

// turbo
```bash
git diff --cached --name-only | grep -E "\.test\.(ts|tsx)$" || echo "⚠️ No test files in changes"
```

**Rules:**
- Nuevo endpoint → DEBE tener test
- Nuevo componente → Al menos smoke test  
- Bug fix → Test que previene regresión

---

## Check 3: Patterns

Cargar skills según archivos modificados:
```bash
# Si cambios en components/
cat ./.agent/skills/domains/ui/SKILL.md | grep -A5 "SIEMPRE:\|NUNCA:"

# Si cambios en lib/db/
cat ./.agent/skills/domains/db/SKILL.md | grep -A5 "SIEMPRE:\|NUNCA:"

# Si cambios en lib/actions/
cat ./.agent/skills/domains/api/SKILL.md | grep -A5 "SIEMPRE:\|NUNCA:"
```

Verificar cambios siguen SIEMPRE/NUNCA.

---

## Check 4: Rules

// turbo
```bash
cat ./.agent/rules/AI_RULES.md | grep -B1 -A2 "PROHIBIDO\|NUNCA"
```

Verificar cambios no violan ninguna regla.

---

## Check 5: Duplication (🛑 STOP si detecta)

// turbo
```bash
cat ./docs/reference/INVENTORY.md
```

**Verificar:**
- ¿Componente similar ya existe?
- ¿Hook duplicado?
- ¿Server action duplicada?

> **Si duplicación detectada:**
> ```
> 🛑 STOP — Posible duplicación detectada:
> - [nombre del componente/hook/action existente]
> - [lo que se creó nuevo]
> 
> ¿Confirmar que es intencional? (s/n)
> ```

---

## Check 6: Lint/Types

// turbo
```bash
pnpm lint && pnpm typecheck
```

---

## Check 7: Breaking Changes (si modificó lib/ o types/)

```bash
# Verificar cambios en exports públicos
git diff --cached lib/ types/ 2>/dev/null | grep -E "^[-+]export" || echo "No public exports changed"
```

> **Si breaking change detectado:**
> 🛑 STOP — Documentar migración — Confirmar con usuario

---

## Check 8: Migration Check (si modificó schema)

```bash
# Si hay cambios en schema
if git diff --cached --name-only | grep -q "lib/db/schema"; then
  echo "⚠️ Schema changed - checking for migration..."
  ls -la lib/db/migrations/*.sql 2>/dev/null | tail -3 || echo "No migrations found"
fi
```

---

## Check 9: Scope Creep

Comparar cambios vs AC del issue:
- ¿Implementó features no solicitadas?
- ¿Agregó dependencias no necesarias?
- ¿Refactorizó código fuera de scope?

> **Si scope creep:**
> 🛑 STOP — Reportar al usuario — Confirmar o revertir

---

## Output: QC Report

```markdown
## 🧪 QC Report: {ISSUE_ID}

| Check | Status | Notes |
|-------|--------|-------|
| Issue Compliance | ✅/🔴 | |
| Tests Exist | ✅/⚠️ | |
| Patterns | ✅/🔴 | |
| Rules | ✅/🔴 | |
| Duplication | ✅/🛑 | |
| Lint/Types | ✅/🔴 | |
| Breaking Changes | ✅/🛑/N/A | |
| Migration | ✅/🔴/N/A | |
| Scope Creep | ✅/🛑 | |

**Verdict:** ✅ PASS / 🛑 NEEDS CONFIRM / 🔴 FAIL
```

---

## Stop Conditions

| Condition | Action |
|-----------|--------|
| 🔴 FAIL | NO continuar a Phase 6 — Fix primero |
| 🛑 STOP | Esperar confirmación del usuario |
| ✅ PASS | Continuar a Phase 6: Cierre |

---

_Sub-workflow de /implement — Phase 5_
