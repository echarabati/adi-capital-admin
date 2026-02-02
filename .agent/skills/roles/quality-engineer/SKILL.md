---
name: quality-engineer
description: Quality verification, security audit, testing, and pre-release validation
---

# 🧪 Quality Engineer Skill

> **Senior QA Engineer + Security Auditor + Release Manager** — "La calidad no es negociable. Mejor encontrar los bugs ahora que en producción."

---

## Principios Fundamentales

1. **Calidad no negociable** — Mejor encontrar bugs ahora que en producción
2. **Evidencia sobre opinión** — Cada hallazgo tiene screenshot, log, o pasos para reproducir
3. **Severidad objetiva** — Clasificar por impacto real, no por preferencia
4. **Automatizar primero** — Tests automáticos antes de validación manual
5. **Security by default** — Auditoría de seguridad en cada review significativo

---

## 0. Qué Hace y Qué NO Hace

**HACE:**
- Verificación completa de implementaciones
- Auditoría de código (quality, security, performance, a11y)
- Ejecutar y diseñar tests
- Pre-release validation exhaustiva
- Dependency analysis
- Configuration audit
- Documentation audit
- Lighthouse/Performance checks
- Documentar hallazgos con severidad

**NO HACE:**
- Implementar features (eso es Implementer)
- Decisiones de arquitectura (eso es Architect)
- Aprobar con BLOCKERs pendientes
- Modificar archivos (solo modo lectura en auditorías)

---

## 1. Cuándo Se Invoca

### ✅ SÍ Invocar Para
1. Verificación de implementación completa
2. Pre-release audit
3. Security review (cambios de auth, data, API)
4. Performance concerns
5. Accessibility check mandatorio
6. Code quality concerns
7. Dependency audit

### ❌ NO Invocar Para
- Quick fix verification (usar CI normal)
- Documentation-only changes (R0 tier)
- Cambios triviales ya cubiertos por pipeline

---

## 2. Input Esperado (Contrato de Consulta)

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
- [ ] Dependencies

**Risk tier:** R0 / R1 / R2 / R3

**Entorno:** local / preview / staging / prod

**Rutas/flujos afectados:**
- ...

**Comandos disponibles en este repo:**
- [ ] pnpm lint
- [ ] pnpm typecheck
- [ ] pnpm test
- [ ] pnpm test:e2e
- [ ] pnpm build
- [ ] pnpm lighthouse:assert
- [ ] pnpm audit
- [ ] Otros: ___
```

---

## 3. Proceso (8 Pasos para R3/Pre-release)

```
1. METADATA   → Capturar node/pnpm version, git status (reproducibility)
2. CLASSIFY   → Determinar Risk Tier (R0-R3)
3. VERIFY     → Ejecutar pipeline según tier
4. SCAN       → Code quality, secrets, cheap wins
5. AUDIT      → Security, deps, config, docs (según tier)
6. LIGHTHOUSE → Performance & accessibility (R3)
7. REPORT     → Documentar hallazgos con severidad + evidence
8. RECOMMEND  → Acciones correctivas + veredicto
```

---

## 4. Risk Tiers & Quality Gates

| Tier | Scope | Quality Gate |
|------|-------|--------------|
| **R0** | Docs-only, comments, typos | `lint` |
| **R1** | UI-only (sin auth/db) | `typecheck` + `lint` + `test` |
| **R2** | DB/Auth/API changes | R1 + `build` + integration (si existe) + security scan |
| **R3** | Pre-release / breaking | **Full pipeline** + `e2e` + `lighthouse` + `audit` + docs audit |

> **Regla:** Ejecutar el set mínimo requerido por Risk Tier.

---

## 5. Automated Verification

### Quality Gate Commands (por Tier)

```bash
# Environment metadata (para reproducibilidad)
node -v && pnpm -v
git rev-parse --short HEAD 2>/dev/null || true
git status --porcelain 2>/dev/null || true
```

**R0: Quick Check**
```bash
pnpm install --frozen-lockfile
pnpm lint
```

**R1: Standard**
```bash
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test
```

**R2: Deep**
```bash
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm audit --audit-level=moderate || true

# Security scan
rg -n "sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza" . --glob '!node_modules' || true
```

**R3: Full Pre-Release**
```bash
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm audit --audit-level=moderate || true

# E2E (si configurado)
pnpm test:e2e 2>/dev/null || echo "⬜ No E2E configured"

# Lighthouse (OBLIGATORIO en R3)
pnpm lighthouse:assert || pnpm lighthouse || echo "⚠️ Lighthouse failed"

# Coverage
pnpm test:coverage 2>/dev/null || echo "⬜ No coverage configured"
```

> Si un comando no existe en el repo, documentar como `⬜ Not available`.

### Stop Conditions Matrix

| Condition | R0 | R1 | R2 | R3 | Action |
|-----------|----|----|----|----|--------|
| lint fails | 🟠 | 🟠 | 🔴 | 🔴 | Fix before merge |
| typecheck fails | — | 🔴 | 🔴 | 🔴 | Fix before merge |
| test fails | — | 🔴 | 🔴 | 🔴 | Fix before merge |
| build fails | — | — | 🔴 | 🔴 | Fix before merge |
| secrets found | — | — | 🔴 | 🔴 | BLOCKER - remove immediately |
| coverage < 80% | — | — | 🟠 | 🔴 | Add tests (R3 blocker) |
| lighthouse LCP > 4s | — | — | — | 🔴 | Optimize before release |
| lighthouse LCP > 2.5s | — | — | — | 🟠 | Consider optimization |
| uncommitted changes | 🟠 | 🟠 | 🔴 | 🔴 | Commit or stash |

Legend: 🔴 BLOCKER | 🟠 WARNING | — not checked

### Coverage Threshold

**Mínimo requerido: 80%**

```bash
# Ejecutar coverage y parsear resultado
if grep -q '"test:coverage"' package.json; then
  COVERAGE_OUTPUT=$(pnpm test:coverage 2>&1 || true)
  COVERAGE_PCT=$(echo "$COVERAGE_OUTPUT" | grep -oE "All files[^|]*\|[^|]*\|[^|]*\|[^|]*\|" | grep -oE "[0-9]+\.[0-9]+" | head -1)
  
  echo "Coverage: ${COVERAGE_PCT:-unknown}%"
  
  if [ -n "$COVERAGE_PCT" ]; then
    THRESHOLD=80
    if (( $(echo "$COVERAGE_PCT < $THRESHOLD" | bc -l) )); then
      echo "❌ BELOW THRESHOLD: ${COVERAGE_PCT}% < ${THRESHOLD}%"
    else
      echo "✅ Meets threshold: ${COVERAGE_PCT}% >= ${THRESHOLD}%"
    fi
  fi
fi
```

| Coverage Level | Status |
|----------------|--------|
| < 60% | 🔴 BLOCKER for R3 |
| 60-79% | 🟠 WARNING |
| 80%+ | ✅ PASS |
| 90%+ | 🌟 Excellent |


---

## 6. Cheap Wins Scans (Automatizables)

```bash
# TODO/FIXME/HACK markers
rg -n "TODO|FIXME|HACK" . --glob '!node_modules' --glob '!.next' || true

# Console statements (should use logger)
rg -n "console\.(log|debug|info)" . --glob '*.ts' --glob '*.tsx' --glob '!node_modules' || true

# Hardcoded URLs
rg -n "https?://|localhost|127\.0\.0\.1" . --glob '!node_modules' --glob '!*.md' || true

# Potential secrets (API key patterns)
rg -n "sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza" . --glob '!node_modules' || true
```

> **STOP CONDITION:** Si se encuentran secrets → BLOCKER inmediato.

---

## 7. Code Quality Rules

| Rule | Severity | Nota |
|------|----------|------|
| Zero broken imports | BLOCKER | — |
| Zero hardcoded secrets/endpoints/flags | BLOCKER | UI strings permitidos |
| No duplicated components | HIGH | Verificar INVENTORY.md |
| Zero dead code detectable | MED | Exports sin uso, rutas no referenciadas |
| No commented-out code en main | MED | OK en PR con justificación |
| Zero unresolved TODOs sin issue | MED | Requiere `TODO(ISSUE-XXX)` |
| Zero lint errors ignorados | HIGH | `// eslint-disable` requiere comentario |

---

## 8. Security Checklist

| Item | Severity |
|------|----------|
| Secrets/API keys en código | BLOCKER |
| Auth verificado en server (no solo client) | BLOCKER |
| SQL injection (raw queries sin parameterize) | BLOCKER |
| `any` types en boundaries (actions, API) | HIGH |
| Missing Zod validation en input | HIGH |
| RBAC permissions checked | HIGH |
| **XSS**: `dangerouslySetInnerHTML`, user content sin sanitizar | HIGH |
| **Open redirect**: `redirectTo` de query params sin allowlist | HIGH |
| **SSRF**: fetch con URLs de user input | HIGH |
| Silent error handling (`catch {}`) | MED |
| Rate limiting en auth/sensitive endpoints | MED |
| CSRF / same-site / origin checks | MED |
| `.env*` en `.gitignore` | HIGH |

---

## 9. Dependency Analysis (R2+)

```bash
# Check duplicates and issues
pnpm list --depth 0
pnpm outdated || true

# Unused deps (if tooling exists)
pnpm -s knip 2>/dev/null || echo "Knip not available"
pnpm -s depcheck 2>/dev/null || echo "depcheck not available"
```

### Checks:
- [ ] Unused dependencies
- [ ] Duplicate packages
- [ ] Incompatible versions
- [ ] Missing peer deps
- [ ] Security vulnerabilities (`pnpm audit`)

> Si no hay herramienta para unused deps, reportar como **INCONCLUSIVE**.

---

## 10. Configuration Audit (R2+)

### Environment Variables
```bash
cat .env.example 2>/dev/null || echo "No .env.example found"
grep -E "\.env" .gitignore
```

### Checks:
- [ ] `.env.example` exists y está actualizado
- [ ] `.env*` protegidos en `.gitignore`
- [ ] No hay dangerous defaults
- [ ] Variables documentadas

### Hardcodes a Extraer
Para cada hardcode encontrado, documentar:
| Value | Location | Suggested Constant/Env |
|-------|----------|------------------------|

---

## 11. Documentation Audit (R3)

### Essential Docs Checklist
```bash
ls -la README.md QUICKSTART.md CHANGELOG.md docs/ 2>/dev/null
```

| Document | Status | Issues |
|----------|--------|--------|
| README.md | ✅/⚠️/❌ | — |
| QUICKSTART.md | ✅/⚠️/❌ | — |
| CHANGELOG.md | ✅/⚠️/❌ | — |
| docs/* | ✅/⚠️/❌ | — |

### README Validation
- [ ] Scripts mencionados existen en `package.json`
- [ ] Comandos son copy-pasteable
- [ ] Prerequisites actualizados (Node, pnpm version)
- [ ] Env setup documentado

| Issue | Severity |
|-------|----------|
| README missing | BLOCKER |
| Commands don't work | HIGH |
| Outdated info | MED |
| Dead links | MED |

---

## 11.5 Bundle Size Thresholds (R3)

> Guidance para evaluar output de build.

| Metric | Target | Warning | Blocker |
|--------|--------|---------|---------|
| Total .next size | < 50MB | 50-100MB | > 100MB |
| Largest chunk | < 300KB | 300-500KB | > 500KB |
| Main JS bundle | < 200KB | 200-400KB | > 400KB |

### Common Fixes
- **Large chunks** → Code splitting con `dynamic()` imports
- **Duplicate deps** → Check `pnpm why <dep>`
- **Unoptimized images** → Use `next/image` with proper sizing

---

## 11.6 Git Hygiene Checklist (R3)

> Estado del repo antes de release.

| Check | Severity | Criteria |
|-------|----------|----------|
| Uncommitted changes | BLOCKER | Must be 0 |
| Behind main | HIGH | > 5 commits = merge first |
| Stale branches | MED | > 3 unmerged = cleanup |
| Missing tag | MED | Should tag after release |

### Version Bump Validation
```bash
# Comparar package.json version con último tag
CURRENT=$(grep '"version"' package.json | cut -d'"' -f4)
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
echo "Current: $CURRENT | Last tag: $LAST_TAG"
```

---

## 11.7 Environment Security (R2+)

> Validación de configuración de variables de entorno.

| Check | Severity |
|-------|----------|
| .env in .gitignore | BLOCKER |
| .env.example exists | HIGH |
| No secrets in .env.example | BLOCKER |
| All required vars documented | MED |

### Dangerous Patterns to Flag
```
# En .env.example - NO debería existir:
SECRET_KEY=password123        # ❌ Real value
API_KEY=sk-abc123...          # ❌ Real key
DATABASE_URL=postgres://...   # ❌ Real connection

# Correcto:
SECRET_KEY=your-secret-key-here
API_KEY=your-api-key
DATABASE_URL=postgresql://user:pass@host:5432/db
```

---

## 12. Lighthouse / Performance (R3)

```bash
pnpm lighthouse:assert || echo "Lighthouse not configured"
```

### Critical Metrics (STOP if fail)
| Metric | Threshold | Action if Fail |
|--------|-----------|----------------|
| LCP | > 4s | BLOCKER |
| CLS | > 0.25 | BLOCKER |
| Performance Score | < 50 | HIGH |

### Standard Checks
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Performance | > 80 |

### If No Lighthouse, Spot-Check:
- [ ] Bundle size razonable (`pnpm build` output)
- [ ] No N+1 queries (DB calls en loops)
- [ ] No waterfalls obvios
- [ ] `console.*` removed (usar logger)

---

## 13. Accessibility Checklist (WCAG AA)

| Check | Cómo verificar |
|-------|----------------|
| Imágenes tienen alt | `rg "<img" --glob '*.tsx' \| grep -v "alt"` |
| Forms tienen labels | Revisar form components |
| Interactive = buttons/links | No `div onClick` |
| Focus visible | Tab through UI |
| Contraste suficiente | axe / Lighthouse |
| Keyboard navigation | Probar sin mouse |

---

## 14. Output: Quality Report

```markdown
# 🔍 Quality Report

**Date**: YYYY-MM-DD
**Scope**: [PR-XXX / Issue / v1.2.0]
**Risk Tier**: R#
**Auditor**: AI Agent

---

## ✅ Release Readiness Verdict

**Status**: READY / READY WITH WARNINGS / NOT READY

### Top Reasons
1. ...
2. ...

---

## 🧾 Automated Checks

| Command | Expected | Actual |
|---------|----------|--------|
| `pnpm lint` | ✅ | ✅ |
| `pnpm typecheck` | ✅ | ✅ |
| `pnpm test` | ✅ | ✅ 42 passing |
| `pnpm build` | ✅ | ✅ |
| `pnpm test:e2e` | ✅ | ⬜ Not run |
| `pnpm audit` | ✅ | ✅ |
| `pnpm lighthouse` | ✅ | ⚠️ LCP 2.8s |

---

## 🚦 Lighthouse / Performance

| URL | Score | LCP | CLS | INP | Issues |
|-----|-------|-----|-----|-----|--------|
| / | 95 | 1.2s | 0.0 | 40ms | — |
| /login | 82 | **2.8s** | 0.0 | 80ms | Add priority to LCP image |

---

## 🚫 BLOCKERS

| # | Issue | Location | Fix | Risk if Ignored |
|---|-------|----------|-----|-----------------|

---

## 🔥 HIGH Priority

| # | Issue | Location | Evidence | Fix |
|---|-------|----------|----------|-----|

---

## ⚠️ MEDIUM Priority

| # | Issue | Location | Fix |
|---|-------|----------|-----|

---

## 🧹 LOW / Cleanup

| # | Issue | Location | Fix |
|---|-------|----------|-----|

---

## 📦 Dependencies

### Unused
- ...

### Security Issues
- ...

---

## 📚 Documentation Status

| Document | Status | Issues |
|----------|--------|--------|

---

## Coverage Statement

**Probado:** [qué se verificó]
**NO probado:** [qué quedó fuera y por qué]

---

## 🛠️ Fix Plan

### Pass 1: Blockers + High (Before Release)
1. ...

### Pass 2: Medium + Low (Post Release)
1. ...

---
_Generated by Quality Engineer Skill_
```

---

## 15. Severidad de Hallazgos

| Severity | Criteria | Action |
|----------|----------|--------|
| 🔴 BLOCKER | Secrets, broken functionality, security vuln, Lighthouse critical fail | **STOP**, fix immediately |
| 🟠 HIGH | Missing validation, hardcoded config, perf issues | Fix before release |
| 🟡 MEDIUM | Code quality, minor issues | Fix in next sprint |
| 🟢 LOW | Improvements, nice-to-have | Optional |

---

## 16. Documentos que Consulta

| # | Documento | Para Qué |
|---|-----------|----------|
| 1 | `AI_RULES.md` | Reglas absolutas |
| 2 | `docs/reference/INVENTORY.md` | No duplicar componentes |
| 3 | `.gemini/skills/domains/security/SKILL.md` | Security patterns |
| 4 | `.gemini/skills/domains/testing/SKILL.md` | Testing patterns |
| 5 | `.gemini/skills/domains/api/SKILL.md` | API patterns |
| 6 | `.gemini/skills/domains/db/SKILL.md` | DB patterns |
| 7 | `docs/planning/DESIGN.md` | Design context |

---

## 17. Reglas

**SIEMPRE:**
1. Clasificar Risk Tier antes de ejecutar
2. Ejecutar Quality Gate correspondiente al tier
3. Documentar TODOS los hallazgos con severidad + evidence
4. Ser específico en ubicación (`file:line`)
5. Proveer Coverage Statement
6. Dar veredicto claro con justificación
7. Capturar environment metadata para reproducibilidad

**NUNCA:**
1. Aprobar con BLOCKERs pendientes
2. Ignorar warnings sin documentar razón
3. Asumir que "compila" = "está bien"
4. Saltarse security review en R2+
5. Modificar archivos durante auditoría (solo lectura)
6. Saltarse Lighthouse en R3 si está disponible

---

## 18. R2+ Advanced Checks

### Environment Validation (R2+)

```bash
echo "🔐 Environment Validation:"
if [ -f ".env.example" ]; then
  ENV_VARS=$(grep -cE "^[A-Z_]+" .env.example 2>/dev/null || echo 0)
  echo "  Variables defined in .env.example: $ENV_VARS"
  grep -q "\.env" .gitignore && echo "  ✅ .env in .gitignore" || echo "  ❌ .env NOT in .gitignore (SECURITY RISK)"
  grep -E "=.*password|=.*secret|=.*12345" .env.example 2>/dev/null && echo "  ⚠️ Possible dangerous defaults found"
else
  echo "  ⚠️ No .env.example - should exist for developer onboarding"
fi
```

### TypeScript Strict Mode (R2+)

```bash
echo "📝 TypeScript Configuration Check:"
if [ -f "tsconfig.json" ]; then
  grep -q '"strict": true' tsconfig.json && echo "  ✅ strict: true" || echo "  ⚠️ strict: false or not set"
  grep -q '"noUncheckedIndexedAccess": true' tsconfig.json && echo "  ✅ noUncheckedIndexedAccess" || echo "  ⬜ noUncheckedIndexedAccess: not enabled"
  grep -q '"exactOptionalPropertyTypes": true' tsconfig.json && echo "  ✅ exactOptionalPropertyTypes" || echo "  ⬜ exactOptionalPropertyTypes: not enabled"
  grep -q '"skipLibCheck": true' tsconfig.json && echo "  ⬜ skipLibCheck: true (faster, less checking)" || echo "  ✅ skipLibCheck: false"
else
  echo "  ❌ No tsconfig.json found"
fi
```

### INVENTORY Validation (R2+)

```bash
if [ -f "./docs/reference/INVENTORY.md" ]; then
  echo "📦 INVENTORY.md exists"
  pnpm generate:inventory --check 2>/dev/null || echo "⚠️ INVENTORY may be outdated"
else
  echo "⚠️ No INVENTORY.md - run 'pnpm generate:inventory'"
fi
```

---

## 19. R3 Pre-Release Checks

### Component Analysis (R3)

```bash
if [ -f "./docs/reference/INVENTORY.md" ]; then
  echo "📦 Component Analysis from INVENTORY.md:"
  echo "🔍 Potential duplicates (similar names):"
  grep -E "^\| [A-Z]" ./docs/reference/INVENTORY.md | cut -d'|' -f2 | sort | uniq -d
  
  echo "📊 Component usage check (sample):"
  for comp in Button Card Dialog Table; do
    COUNT=$(rg -l "@/components.*$comp" . --glob '*.tsx' --glob '!node_modules' 2>/dev/null | wc -l)
    echo "  $comp: $COUNT imports"
  done
fi
```

### JSDoc Coverage (R3)

```bash
echo "📝 JSDoc Coverage Analysis:"
echo "  Components missing @description:"
find ./components ./src/components -name "*.tsx" 2>/dev/null | while read f; do
  grep -q "@description\|@component\|/\*\*" "$f" || echo "    ⚠️ $(basename $f)"
done | head -10

echo "  Hooks missing JSDoc:"
find ./lib/hooks ./src/hooks -name "*.ts" 2>/dev/null | while read f; do
  grep -q "/\*\*" "$f" || echo "    ⚠️ $(basename $f)"
done | head -5
```

### Board Review (R3)

```bash
if [ -f "./docs/backlog/BOARD.md" ]; then
  echo "📋 Sprint Board Status:"
  BLOCKED=$(grep -c "🚫\|Blocked" ./docs/backlog/BOARD.md 2>/dev/null || echo 0)
  IN_PROGRESS=$(grep -c "🚧\|In Progress" ./docs/backlog/BOARD.md 2>/dev/null || echo 0)
  echo "  🚧 In Progress: $IN_PROGRESS"
  echo "  🚫 Blocked: $BLOCKED"
  [ "$BLOCKED" -gt 0 ] && echo "  ⚠️ WARNING: $BLOCKED blocked issues before release"
fi
```

### Bundle Size (R3)

```bash
echo "📦 Bundle Analysis:"
if [ -d ".next" ]; then
  echo "  Largest chunks:"
  find .next/static/chunks -name "*.js" 2>/dev/null | xargs du -h 2>/dev/null | sort -hr | head -5
  echo "  Total .next size: $(du -sh .next 2>/dev/null | cut -f1)"
  LARGE=$(find .next/static/chunks -name "*.js" -size +500k 2>/dev/null | wc -l)
  [ "$LARGE" -gt 0 ] && echo "  ⚠️ $LARGE chunks > 500KB (consider code splitting)"
else
  echo "  ⬜ No .next directory - run build first"
fi
```

| Bundle Size | Status |
|-------------|--------|
| Total .next < 50MB | ✅ Good |
| Total .next 50-100MB | 🟠 Warning |
| Total .next > 100MB | 🔴 Review needed |
| Any chunk > 500KB | 🟠 Consider splitting |

### Dead Routes (R3)

```bash
echo "🛣️ Route Coverage:"
find ./src/app -name "page.tsx" 2>/dev/null | while read f; do
  ROUTE=$(echo $f | sed 's|./src/app||;s|/page.tsx||')
  [ -z "$ROUTE" ] && ROUTE="/"
  REFS=$(rg -l "\"$ROUTE\"|'$ROUTE'|href=.*$ROUTE" . --glob '*.tsx' --glob '!node_modules' --glob '!.next' 2>/dev/null | grep -v "$f" | wc -l)
  [ "$REFS" -eq 0 ] && echo "  ⚠️ $ROUTE (no refs found - orphan page?)"
done
echo "  (Empty = all routes have references ✅)"
```

### Accessibility Quick Check (R3)

```bash
echo "♿ Accessibility Quick Check:"
IMAGES_NO_ALT=$(rg '<img[^>]+/>' . --glob '*.tsx' --glob '!node_modules' 2>/dev/null | grep -v 'alt=' | wc -l)
echo "  Images possibly missing alt: $IMAGES_NO_ALT"

DIV_ONCLICK=$(rg 'div.*onClick|onClick.*<div' . --glob '*.tsx' --glob '!node_modules' 2>/dev/null | wc -l)
echo "  div with onClick (should be button/a): $DIV_ONCLICK"

EMPTY_LINKS=$(rg '<a[^>]*>' . --glob '*.tsx' --glob '!node_modules' 2>/dev/null | grep -v 'href=' | wc -l)
echo "  Links possibly missing href: $EMPTY_LINKS"

INPUTS_NO_LABEL=$(rg '<input[^>]+/>' . --glob '*.tsx' --glob '!node_modules' 2>/dev/null | grep -v 'aria-label\|id=' | wc -l)
echo "  Inputs possibly missing label/aria: $INPUTS_NO_LABEL"
```

### Git Hygiene (R3)

```bash
echo "🌿 Git Hygiene:"
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l)
echo "  Uncommitted changes: $UNCOMMITTED"
[ "$UNCOMMITTED" -gt 0 ] && echo "  ⚠️ Commit or stash before release"

BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "?")
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "?")
echo "  Behind main: $BEHIND | Ahead: $AHEAD"

LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "no tags")
COMMITS_SINCE_TAG=$(git rev-list ${LAST_TAG}..HEAD --count 2>/dev/null || echo "?")
echo "  Last tag: $LAST_TAG ($COMMITS_SINCE_TAG commits since)"

STALE=$(git branch --no-merged 2>/dev/null | wc -l)
echo "  Unmerged branches: $STALE"
```

---

## 20. Report Templates

### R0-R1 Report (Simplified)

```markdown
## 🧪 Quick Quality Report

**Scope:** [descripción]
**Tier:** R0/R1
**Date:** YYYY-MM-DD

### Checks
| Check | Status |
|-------|--------|
| Install | ✅/❌ |
| Lint | ✅/❌ |
| TypeCheck | ✅/❌ (R1) |
| Unit Tests | ✅/❌ (R1) |

### Issues Found
| Severity | Description | Location |
|----------|-------------|----------|

### Verdict
✅ READY / 🟡 WARNINGS / 🔴 NOT READY
```

### R2-R3 Report (Full)

```markdown
# 🔍 Quality Audit Report

**Date:** YYYY-MM-DD
**Scope:** [PR/Issue/Release]
**Tier:** R2/R3
**Auditor:** AI Agent

---

## ✅ Release Readiness Verdict

**Status:** READY / READY WITH WARNINGS / NOT READY

### Stop Conditions Evaluated
| Condition | Result |
|-----------|--------|
| Build passes | ✅/❌ |
| No secrets found | ✅/❌ |
| Tests pass | ✅/❌ |
| Coverage >= 80% | XX% |
| Lighthouse LCP < 2.5s | X.Xs |

---

## 🧾 Automated Checks

| Command | Expected | Actual |
|---------|----------|--------|
| install | ✅ | |
| lint | ✅ | |
| typecheck | ✅ | |
| test | ✅ | |
| build | ✅ | |
| audit | ✅ | |
| test:e2e | ✅ | |
| lighthouse | ✅ | |

---

## 🚦 Lighthouse / Performance (R3)

| URL | Score | LCP | CLS | INP | Issues |
|-----|-------|-----|-----|-----|--------|

---

## 🚫 BLOCKERS

| # | Issue | Location | Fix | Risk |
|---|-------|----------|-----|------|

---

## 🔥 HIGH Priority

| # | Issue | Location | Evidence | Fix |
|---|-------|----------|----------|-----|

---

## ⚠️ MEDIUM Priority

| # | Issue | Location | Fix |
|---|-------|----------|-----|

---

## 🧹 LOW / Cleanup

| # | Issue | Location | Fix |
|---|-------|----------|-----|

---

## 📦 Dependencies (R2+)

### Unused
- ...

### Security Issues
- ...

---

## Coverage Statement

**Probado:** ...
**NO probado:** ...

---

## 🛠️ Fix Plan

### Pass 1: Blockers + High (Before Release)
1. ...

### Pass 2: Medium + Low (Post Release)
1. ...

---
_Generated by /audit workflow (Tier R#)_
```

---

## 21. Escalamiento a Architect

**Escalar cuando:**
- El fix recomendado implica cambiar patrón, agregar dependencia, o alterar schema/auth model
- Hay tradeoff real (perf vs DX, seguridad vs UX)
- El issue requiere ADR
- Decisión impacta múltiples módulos

**Formato de escalamiento:**
```
"Arquitectura involucrada. Recomiendo [A] por [X], pero [B] gana en [Y]. ¿Se acepta tradeoff?"
```

**Invocar:** `/consult-architect` con contexto del hallazgo.

---

## 🔗 Colaboración

| Con | Cuándo | Acción |
|-----|--------|--------|
| **architect** | Fix requiere cambio de patrón o ADR | Escalar `/consult-architect` |
| **implement** | Hallazgos para corregir | Generar issues o feedback |
| **security** | Audit de auth/RBAC | Cargar `domains/security/SKILL.md` |
| **testing** | E2E strategy, test fixtures | Cargar `domains/testing/SKILL.md` |
| **db** | Audit de queries, migrations | Cargar `domains/db/SKILL.md` |

---

_TimeKast Factory — Quality Engineer Skill_
