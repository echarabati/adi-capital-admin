---
description: Dynamic quality audit - select review level based on scope and risk
---

# /audit — Dynamic Quality Audit

> Actúa como **Quality Engineer** para una auditoría adaptada al nivel de riesgo.
> Este workflow es de **solo lectura** — no modifica archivos, solo audita y reporta.
>
> **Los checks detallados están en:** `skills/roles/quality-engineer/SKILL.md`

---

## ⚠️ AGENT ENFORCEMENT RULES (INQUEBRANTABLES)

> **IMPORTANTE:** El agente DEBE seguir estas reglas SIN EXCEPCIÓN.

1. **Ejecutar TODOS los comandos del tier seleccionado** - No omitir ningún check
2. **R3 = TODOS los R2 checks + extras** - No shortcutear
3. **Lighthouse es OBLIGATORIO en R3** - Si no hay servidor, reportar como BLOCKER
4. **Coverage < 80% en R3 = 🔴 NOT READY** - No "READY WITH WARNINGS"
5. **HIGH vuln en deps = 🔴 BLOCKER** - No downgrade a warning
6. **TSConfig check es OBLIGATORIO en R2+** - Ejecutar siempre
7. **Verdict DEBE alinearse con Stop Conditions Matrix** - Si hay BLOCKER → NOT READY

**Si algún check no se puede ejecutar:**
```
❌ BLOCKER: [Check name] no ejecutado - [razón]
   → Verdict = NOT READY hasta resolver
```

---

## Phase 0: Tier Selection

```md
## 🧪 Selecciona nivel de auditoría:

| # | Tier | Scope | Tiempo | Incluye |
|---|------|-------|--------|---------|
| 1 | **R0** | Docs, typos | ~30s | lint |
| 2 | **R1** | UI changes | ~2m | + typecheck + tests |
| 3 | **R2** | DB/Auth/API | ~5m | + build + security + coverage |
| 4 | **R3** | Pre-release | ~10m+ | + e2e + lighthouse + full audit |

**¿Qué nivel?** (1-4)

> 💡 Shortcut: `/audit R2` para saltar selección.
```

---

## Phase 1: Load Context

// turbo
```bash
cat ./.agent/rules/AI_RULES.md
```

// turbo
```bash
cat ./.agent/skills/roles/quality-engineer/SKILL.md
```

---

## Phase 2: Environment & Capabilities

// turbo
```bash
echo "📍 Environment:"
echo "  Node: $(node -v)"
echo "  pnpm: $(pnpm -v)"
echo "  Git: $(git rev-parse --short HEAD 2>/dev/null || echo 'no git')"
echo "  Uncommitted: $(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
```

// turbo
```bash
echo ""
echo "🔍 Capabilities:"
grep -q '"lint"' package.json && echo "  ✅ lint" || echo "  ⬜ lint"
grep -q '"typecheck"' package.json && echo "  ✅ typecheck" || echo "  ⬜ typecheck"
grep -q '"test"' package.json && echo "  ✅ test" || echo "  ⬜ test"
grep -q '"build"' package.json && echo "  ✅ build" || echo "  ⬜ build"
grep -q '"test:e2e"' package.json && echo "  ✅ test:e2e" || echo "  ⬜ test:e2e"
grep -q '"test:coverage"' package.json && echo "  ✅ test:coverage" || echo "  ⬜ test:coverage"
grep -q '"lighthouse"' package.json && echo "  ✅ lighthouse" || echo "  ⬜ lighthouse"
```

```bash
pnpm install --frozen-lockfile
```

---

## Phase 3: Execute Quality Gate

> **Referencia:** Ver `SKILL.md > Quality Gate Commands` para checks completos.

### R0: Quick Check
```bash
pnpm lint
```

### R1: Standard (incluye R0)
```bash
pnpm lint && pnpm typecheck && pnpm test
```

### R2: Deep (incluye R1)

**Core:**
```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

**Dependency Audit (R2+):**
```bash
echo "📦 Dependency Audit:"
pnpm audit --audit-level=high || exit 1
pnpm audit --audit-level=moderate || echo "⚠️ Moderate+ vulns exist (review output)"
pnpm outdated || true
```

**Security Scan (R2+):**
```bash
echo "🔒 Secrets Scan:"
SECRETS=$(rg -n "sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza|ghp_|gho_" . --glob '!node_modules' --glob '!.git' 2>/dev/null | wc -l)
if [ "$SECRETS" -gt 0 ]; then
  echo "❌ BLOCKER: $SECRETS potential secrets found!"
  rg -n "sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza|ghp_|gho_" . --glob '!node_modules' --glob '!.git' 2>/dev/null | head -10
  exit 1
else
  echo "✅ No secrets detected"
fi
```

**TSConfig Check (R2+):**
```bash
echo "📝 TypeScript Config:"
if [ -f "tsconfig.json" ]; then
  grep -q '"strict": true' tsconfig.json && echo "  ✅ strict: true" || echo "  ⚠️ strict: NOT enabled"
  grep -q '"skipLibCheck": true' tsconfig.json && echo "  ⬜ skipLibCheck: true" || echo "  ✅ skipLibCheck: false"
else
  echo "  ❌ No tsconfig.json"
fi
```

**Environment Validation (R2+):**
```bash
echo "🔐 Environment:"
[ -f ".env.example" ] && echo "  ✅ .env.example exists" || echo "  ⚠️ No .env.example"
grep -q "\.env" .gitignore 2>/dev/null && echo "  ✅ .env in .gitignore" || echo "  ❌ .env NOT in .gitignore!"
```

**Coverage (80% threshold):**
```bash
if grep -q '"test:coverage"' package.json; then
  echo "📊 Coverage Analysis:"
  COVERAGE_OUTPUT=$(pnpm test:coverage 2>&1 || true)
  COVERAGE_PCT=$(echo "$COVERAGE_OUTPUT" | grep -E "All files" | grep -oE "[0-9]+(\.[0-9]+)?" | head -1)
  if [ -n "$COVERAGE_PCT" ]; then
    echo "  Coverage: ${COVERAGE_PCT}%"
    node -e "process.exit(Number(process.argv[1]) < 80 ? 1 : 0)" "$COVERAGE_PCT" \
      && echo "  ✅ Meets 80% threshold" \
      || echo "  ⚠️ Below 80% threshold"
  else
    echo "  ⬜ Could not parse coverage %; check output manually"
  fi
else
  echo "⬜ test:coverage not configured"
fi
```

### R3: Full Pre-Release (incluye R2)

**Core + E2E:**
```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:e2e 2>/dev/null || echo "⬜ No E2E configured"
```

**All R2 checks (determinístico):**
```bash
# Dependency Audit
echo "📦 Dependency Audit:"
pnpm audit --audit-level=high || exit 1
pnpm audit --audit-level=moderate || echo "⚠️ Moderate+ vulns"

# Secrets Scan
echo "🔒 Secrets Scan:"
SECRETS=$(rg -n "sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza|ghp_|gho_" . --glob '!node_modules' --glob '!.git' 2>/dev/null | wc -l)
if [ "$SECRETS" -gt 0 ]; then
  echo "❌ BLOCKER: $SECRETS secrets found!"
  exit 1
fi
echo "✅ No secrets"

# Env Validation
echo "🔐 Environment:"
[ -f ".env.example" ] && echo "  ✅ .env.example" || echo "  ⚠️ No .env.example"
grep -q "\.env" .gitignore && echo "  ✅ .env in .gitignore" || echo "  ❌ .env NOT in .gitignore"

# Coverage (R3: BLOCKER if < 80%)
if grep -q '"test:coverage"' package.json; then
  echo "📊 Coverage:"
  COVERAGE_OUTPUT=$(pnpm test:coverage 2>&1 || true)
  COVERAGE_PCT=$(echo "$COVERAGE_OUTPUT" | grep -E "All files" | grep -oE "[0-9]+(\.[0-9]+)?" | head -1)
  if [ -n "$COVERAGE_PCT" ]; then
    echo "  ${COVERAGE_PCT}%"
    node -e "process.exit(Number(process.argv[1]) < 80 ? 1 : 0)" "$COVERAGE_PCT" \
      && echo "  ✅ Meets 80% threshold" \
      || { echo "  ❌ BLOCKER: Below 80% threshold"; exit 1; }
  else
    echo "  ⬜ Could not parse coverage"
  fi
fi
```

**Lighthouse (OBLIGATORIO en R3):**
> ⚠️ Si Lighthouse no se ejecuta, es BLOCKER.

```bash
echo "🔦 Lighthouse (OBLIGATORIO):"
if grep -q '"lighthouse"' package.json; then
  # Verificar si servidor está corriendo
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    pnpm lighthouse:assert || pnpm lighthouse || { echo "❌ BLOCKER: Lighthouse failed"; }
  else
    echo "❌ BLOCKER: Lighthouse requiere servidor en http://localhost:3000"
    echo "   Ejecutar 'pnpm dev' primero, o justificar skip explícitamente"
  fi
else
  echo "⚠️ WARNING: Lighthouse no configurado"
  echo "   Agregar a package.json: \"lighthouse\": \"npx lhci autorun\""
  echo "   Para R3, esto degrada a READY WITH WARNINGS (no READY)"
fi
```

**INVENTORY Validation (R3):**
```bash
echo "📦 INVENTORY Check:"
if [ -f "./docs/reference/INVENTORY.md" ]; then
  echo "  ✅ INVENTORY.md exists"
  pnpm generate:inventory --check 2>/dev/null || echo "  ⚠️ May be outdated - run 'pnpm generate:inventory'"
else
  echo "  ⚠️ No INVENTORY.md - run 'pnpm generate:inventory'"
fi
```

**Docs Audit (R3):**
```bash
echo "📚 Documentation:"
[ -f "README.md" ] && echo "  ✅ README.md" || echo "  ❌ No README.md"
[ -f "CHANGELOG.md" ] && echo "  ✅ CHANGELOG.md" || echo "  ⬜ No CHANGELOG.md"
[ -d "docs" ] && echo "  ✅ docs/ directory" || echo "  ⬜ No docs/"
```

**Board Review (R3):**
```bash
if [ -f "./docs/backlog/BOARD.md" ]; then
  echo "📋 Board Status:"
  BLOCKED=$(grep -c "🚫\|Blocked" ./docs/backlog/BOARD.md 2>/dev/null || echo 0)
  [ "$BLOCKED" -gt 0 ] && echo "  ⚠️ $BLOCKED blocked issues" || echo "  ✅ No blocked issues"
fi
```

**Bundle Size (R3):**
```bash
if [ -d ".next" ]; then
  echo "📦 Bundle Size:"
  echo "  Total: $(du -sh .next 2>/dev/null | cut -f1)"
  LARGE=$(find .next/static/chunks -name "*.js" -size +500k 2>/dev/null | wc -l)
  [ "$LARGE" -gt 0 ] && echo "  ⚠️ $LARGE chunks > 500KB" || echo "  ✅ No oversized chunks"
fi
```

**Git Hygiene (R3):**
```bash
echo "🌿 Git Hygiene:"
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l)
[ "$UNCOMMITTED" -gt 0 ] && echo "  ⚠️ $UNCOMMITTED uncommitted changes" || echo "  ✅ Clean working tree"
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "no tags")
echo "  Last tag: $LAST_TAG"
```


---

## Phase 4: Summary Report

> ⚠️ **VERDICT DECISION RULES (OBLIGATORIO):**
> 
> El agente DEBE aplicar estas reglas al determinar el veredicto:
> 
> | Condición | Verdict |
> |-----------|---------|
> | ANY check con exit 1 | 🔴 NOT READY |
> | HIGH vuln en deps (producción) | 🔴 NOT READY |
> | Secrets encontrados | 🔴 NOT READY |
> | Coverage < 80% en R3 | 🔴 NOT READY |
> | Lighthouse no ejecutado en R3 | 🔴 NOT READY (o justificación explícita) |
> | Solo warnings (no blockers) | 🟡 READY WITH WARNINGS |
> | Todo pasa sin warnings | ✅ READY |
> 
> **NUNCA dar READY o READY WITH WARNINGS si hay un BLOCKER.**

**Mostrar resumen estructurado:**

```md
## 🔍 Audit Summary (R#)

| Check | Status | Notes |
|-------|--------|-------|
| lint | ✅/❌ | |
| typecheck | ✅/❌ | |
| test | ✅/❌ | |
| build | ✅/❌ | (R2+) |
| security | ✅/❌ | (R2+) |
| coverage | XX% | 80% min |
| e2e | ✅/❌/⬜ | (R3) |
| lighthouse | ✅/❌/⬜ | (R3) |

**Coverage:** XX% (threshold: 80%)
**Lighthouse LCP:** X.Xs (threshold: 2.5s)

### Blockers
- [list if any - if this section has items, verdict MUST be NOT READY]

### Warnings
- [list if any]

### Verdict
✅ READY / 🟡 READY WITH WARNINGS / 🔴 NOT READY
[Justificación basada en Verdict Decision Rules]
```

---

## Phase 5: Stop Conditions

> Ver `SKILL.md > Stop Conditions Matrix` para reglas completas.

| Condition | R0 | R1 | R2 | R3 |
|-----------|----|----|----|----| 
| lint fails | 🟠 | 🟠 | 🔴 | 🔴 |
| typecheck fails | — | 🔴 | 🔴 | 🔴 |
| test fails | — | 🔴 | 🔴 | 🔴 |
| build fails | — | — | 🔴 | 🔴 |
| secrets found | — | — | 🔴 | 🔴 |
| coverage < 80% | — | — | 🟠 | 🔴 |
| lighthouse LCP > 4s | — | — | — | 🔴 |

---

## Shortcuts

```bash
/audit        # Interactive tier selection
/audit R0     # Quick lint check
/audit R1     # Standard for UI changes  
/audit R2     # Deep for API/DB/Auth
/audit R3     # Full pre-release
```

---

## Escalation

Si fix requiere cambio de arquitectura/schema:
→ Ejecutar `/consult-architect`

---

_TimeKast Starter Kit — Audit Workflow (Orchestrator)_
