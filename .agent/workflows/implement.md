---
description: Implement workflow - execute issues from backlog through full pipeline
---

# /implement — Issue Execution

> **Flujo:** Bootstrap (Fase 5 — Execution)
> **Anterior:** `/backlog`
> **Siguiente:** `/audit`
> **Propósito:** Ejecutar UN issue del backlog: plan → code → verify → document → close.

---

## Invocación

```bash
/implement ISSUE-XXX           # Pipeline completo
/implement ISSUE-XXX --plan-only   # Solo generar plan
/implement ISSUE-XXX --skip-tests  # Saltar verificación
/implement ISSUE-XXX --verbose     # Output detallado
```

---

## Hard Gates

| Validación | Si falla |
|------------|----------|
| Issue existe | ❌ STOP |
| Status ≠ ✅ Completed | ❌ STOP |
| Status ≠ 🚫 Blocked | ❌ STOP |
| Sin ADR bloqueante | ❌ STOP → `/consult-architect` |
| Dependencias cumplidas | ❌ STOP |

---

## Phase 0: Issue Selection

**Si no se especificó issue:**

// turbo
```bash
# Listar issues pendientes
VERSION=$(ls -d ./docs/backlog/v*/ 2>/dev/null | sort -V | tail -1 | xargs basename 2>/dev/null || echo "none")
if [ "$VERSION" != "none" ]; then
  echo "📋 Issues disponibles ($VERSION):"
  for f in ./docs/backlog/${VERSION}/issues/*.md; do
    ID=$(grep -m1 "^# " "$f" | sed 's/# //' | cut -d: -f1)
    TITLE=$(grep -m1 "^# " "$f" | sed 's/# //' | cut -d: -f2-)
    PRIORITY=$(grep -m1 "Priority:" "$f" | sed 's/.*\*\*Priority:\*\* //')
    STATUS=$(grep -m1 "Status:" "$f" | sed 's/.*\*\*Status:\*\* //')
    echo "| $ID | $TITLE | $PRIORITY | $STATUS |"
  done | grep -v "✅" | head -10
fi
```

**Si usa `--next`:** Tomar primer issue P0/P1 pendiente.
- Filtrar issues con Status ⬜ o 📋
- Ordenar por Priority (P0 primero)
- Tomar el primero
- Continuar

---

## Phase 0.5: Context Status (MANDATORY)

> 🔴 **SIEMPRE MOSTRAR** — El agente DEBE mostrar el estado del contexto al inicio.
>
> Esta información es OBLIGATORIA en cada ejecución del workflow.

**El agente debe mostrar este bloque AL INICIO de su respuesta:**

```markdown
## 📊 Context Status

| Metric | Value | Status |
|--------|-------|--------|
| Conversación | [N] mensajes | 🟢/🟡/🔴 |
| Archivos leídos | [M] archivos | 🟢/🟡/🔴 |
| Contexto estimado | [X]% | 🟢/🟡/🔴 |

**Workflow:** /implement
**Issue:** {ISSUE-ID}
**Timestamp:** [fecha-hora]
```

### Thresholds

| Contexto | Status | Acción |
|----------|--------|--------|
| < 30% | 🟢 OK | Continuar normalmente |
| 30-50% | 🟡 Moderate | Continuar con precaución |
| > 50% | 🔴 HIGH | ⚠️ WARNING — Ver abajo |

### Si contexto > 50%

> ⚠️ **MANDATORY WARNING**
>
> El agente DEBE mostrar esta advertencia y RECOMENDAR nuevo chat.

```markdown
## ⚠️ CONTEXTO ALTO DETECTADO

**Contexto estimado:** [X]% (> 50%)

**🔴 RECOMENDACIÓN: INICIAR NUEVO CHAT**

El contexto de esta conversación está por encima del 50%.
Para asegurar la mejor calidad de resultados:

1. **Commit cambios actuales**: `git add . && git commit -m "WIP: ..."`
2. **Abrir nueva conversación**
3. **Ejecutar `/start`** para cargar contexto fresco

**¿Deseas continuar de todas formas?** (sí/no)
```

**ACTION:** Si usuario dice "no" → STOP workflow.

---

## Phase 1: Context Loading

// turbo
```bash
cat ./.agent/rules/AI_RULES.md
```

// turbo
```bash
cat ./.agent/rules/DOR_DOD.md
```

// turbo
```bash
cat ./.agent/skills/roles/implement/SKILL.md
```

// turbo
```bash
cat ./.agent/project-config.md 2>/dev/null || echo "No project config"
```

// turbo
```bash
# Load reference docs
cat ./docs/reference/INVENTORY.md 2>/dev/null || echo "No INVENTORY"
```

// turbo
```bash
# Load glossary if exists
cat ./docs/planning/08_GLOSSARY.md 2>/dev/null || echo "No glossary"
```

---

## Phase 1: Pre-requisites

// turbo
```bash
ISSUE_ID="${1:-ISSUE-001}"

# Verificar proyecto configurado
if [ ! -f "package.json" ]; then
  echo "❌ Proyecto no configurado"
  echo "👉 Ejecuta setup primero"
  exit 1
fi

# Verificar backlog existe
if [ ! -d "docs/backlog" ]; then
  echo "❌ No hay backlog"
  echo "👉 Ejecuta /backlog primero"
  exit 1
fi
```

// turbo
```bash
# Buscar issue
FILES=$(ls ./docs/backlog/*/issues/${ISSUE_ID}*.md 2>/dev/null)
COUNT=$(echo "$FILES" | grep -c . 2>/dev/null || echo 0)

if [ $COUNT -eq 0 ]; then
  echo "❌ Issue no encontrado: ${ISSUE_ID}"
  echo "📌 Issues disponibles:"
  ls ./docs/backlog/*/issues/*.md | head -10
  exit 1
fi

if [ $COUNT -gt 1 ]; then
  echo "❌ Múltiples matches para ${ISSUE_ID}:"
  echo "$FILES"
  echo "🛑 STOP — Clarificar nombre del issue"
  exit 1
fi

echo "✅ Issue encontrado: $FILES"
```

---

## Phase 2: Load Issue

// turbo
```bash
# Cargar issue
cat ./docs/backlog/*/issues/${ISSUE_ID}*.md
```

**Extraer:**
- Title y ID
- Status (verificar no es Completed/Blocked)
- Epic asociado
- AC (checkboxes)
- Dependencias (Blocked By)
- Referencias (SCR/FLW/CMP/US)

---

## Phase 3: Auditoría Previa (OBLIGATORIA)

**Checklist antes de continuar:**

```markdown
## 🔍 Auditoría Previa: {ISSUE-ID}

- [ ] Issue existe en backlog
- [ ] Status != ✅ Completed
- [ ] No está duplicado
- [ ] Dependencias completadas
- [ ] No contradice scope/decisiones previas
- [ ] Alineado con documentación
```

**Si detectas problemas:**
```markdown
⚠️ **Auditoría Previa - Bloqueadores**

**Issue:** {ISSUE-ID}
**Problema:** [descripción]

🛑 Ejecución detenida.
```

---

## Phase 4: Planner (Fase 1 del skill)

**Rol:** Staff Engineer / Tech Lead

// turbo
```bash
# Buscar código relacionado
grep -rl "${FEATURE_KEYWORD}" src/ app/ lib/ 2>/dev/null | head -10
```

// turbo
```bash
# Consultar schema si aplica
cat lib/db/schema/*.ts 2>/dev/null | head -50
```

**Acciones:**
1. Leer issue completo + AC
2. Buscar código relacionado
3. Consultar schema si hay data
4. Identificar archivos a crear/modificar
5. Definir orden de implementación
6. Especificar tests requeridos
7. **Determinar skills a consultar (ver abajo)**
8. **Verificar si hay Architect Gating requerido**

**Output OBLIGATORIO del Plan:**

```markdown
## 📋 Plan: {ISSUE-ID}

**Archivos a crear:**
- path/to/file.ts — propósito

**Archivos a modificar:**
- path/to/existing.ts — qué cambiar

**Orden de implementación:**
1. Paso 1
2. Paso 2

**Tests requeridos:**
- Unit: descripción
- E2E: descripción (si aplica)

**Skills a consultar:** ← OBLIGATORIO
> ui, db, security

**Architect Gating:** Sí/No
```

**Determinar Skills (Reglas):**

| Si el issue toca... | Cargar skill |
|---------------------|-------------|
| Componentes React, Tailwind, forms | `ui` |
| Schema, queries, migrations | `db` |
| Server Actions, API routes | `api` |
| Auth, RBAC, tokens, validation | `security` |
| Tests, mocking, fixtures | `testing` |

**Architect Gating:** Si plan revela auth/cache/API/state ambiguo → `/consult-architect`

---

## 🛑 CHECKPOINT 1: Confirmación del Plan

> ⚠️ **VIOLACIÓN DE WORKFLOW** si continúas sin confirmación.
>
> El agente **DEBE** usar `notify_user` y ESPERAR respuesta real del usuario.
> **Inventar aprobación INVALIDA la implementación.**
> 
> **Consecuencia:** Si te saltas este paso, TODO el trabajo debe revertirse.

❌ **PROHIBIDO (Auto-Approval):**
- Inventar frases como "el usuario aprueba", "LGTM", "user confirms"
- Decir "proceeding with implementation" sin respuesta
- Asumir que silencio = aprobación

**Mostrar al usuario:**

```md
## 📋 Plan de Implementación: {ISSUE-ID}

**Archivos a crear:**
- [lista]

**Archivos a modificar:**
- [lista]

**Tests requeridos:**
- [lista]

**Skills a consultar:**
- [lista]

---

| # | Opción | Acción |
|---|--------|--------|
| 1 | **continuar** | Proceder a implementar |
| 2 | **ajustar** | Modificar plan y presentar de nuevo |
| 3 | **cancelar** | Abortar workflow |

**¿Qué quieres hacer?** (1-3)
```

**🛑 STOP AQUÍ — Usar `notify_user` y esperar respuesta antes de Phase 5.**

---

## Phase 5: Implementer (Fase 2 del skill)

**Rol:** Senior Full-Stack Engineer

**Cargar SOLO los skills del plan:**

> ⚠️ **NO CARGAR skills que no están en el plan.**

```markdown
# Ejemplo: Si el plan dice "Skills a consultar: ui, db"
// turbo
cat ./.agent/skills/domains/ui/SKILL.md
cat ./.agent/skills/domains/db/SKILL.md

# NO cargar security, api, testing si no están en el plan
```

**Skills disponibles:** `ui`, `db`, `api`, `security`, `testing` (en `.agent/skills/domains/*/SKILL.md`)

**Acciones:**
1. Leer plan de Fase 4
2. **Cargar SOLO los skills listados en el plan**
3. Implementar EXACTAMENTE lo del plan
4. NO adelantar trabajo de otros issues
5. Cumplir TODOS los AC
6. Documentar desviaciones

**Control de flujo:**
```bash
/pause ISSUE-XXX    # Para pausar
/park "[idea]"      # Para ideas descubiertas
```

**Handoff:**
```markdown
🔄 **Handoff: Implementer → Verifier**
Issue: {ISSUE-ID}
Archivos creados: [lista]
Archivos modificados: [lista]
Tests pendientes: [del plan]
```

---

## Phase 6: Verifier (Fase 3 del skill)

**Rol:** Senior QA Engineer

// turbo
```bash
pnpm typecheck
```

// turbo
```bash
pnpm lint
```

// turbo
```bash
pnpm build
```

**Escribir tests especificados en plan:**
- Unit tests → `*.test.ts`
- E2E tests → `e2e/*.spec.ts`

// turbo
```bash
pnpm test
```

**Si hay errores:**
1. Corregir
2. Re-ejecutar validaciones
3. Repetir hasta ✅

**Handoff:**
```markdown
🔄 **Handoff: Verifier → Documenter**
Issue: {ISSUE-ID}
Validaciones: ✅ typecheck, lint, build, test
Tests nuevos: [lista]
```

---

## Phase 7: Documenter (Fase 4 del skill)

**Rol:** Technical Writer

**Documentación código:**
1. JSDoc a funciones públicas nuevas
2. README si feature visible
3. CHANGELOG entry

**Bitácora en issue.md:**
4. Decisiones tomadas
5. Problemas y soluciones
6. Desviaciones del plan
7. Notas para mantenimiento

**PR Description:**
8. Título: Conventional Commits
9. Descripción estructurada
10. Checklist de review
11. `Closes #{issue-number}`

---

## 🛑 CHECKPOINT 2: Confirmación antes de Cerrar

> ⚠️ **VIOLACIÓN DE WORKFLOW** si continúas sin confirmación.
>
> El agente **DEBE** usar `notify_user` y ESPERAR respuesta real del usuario.
> **Inventar aprobación INVALIDA la implementación.**
> 
> **Consecuencia:** Si te saltas este paso, TODO el trabajo debe revertirse.

❌ **PROHIBIDO (Auto-Approval):**
- Inventar frases como "el usuario aprueba", "LGTM", "user confirms"
- Marcar "Done" sin que el usuario diga "ok", "done", "approve", "1", etc.
- Cerrar sin mostrar QC Report completo
- Cerrar con AC incompletos

**Antes de mostrar opciones, generar tabla de AC:**

```md
## ✅ Verificación de AC

| AC | Descripción | Evidencia |
|----|-------------|-----------|
| 1 | [del issue] | ✅ Implementado en `file.ts:L45` |
| 2 | [del issue] | ✅ Test en `file.test.ts:L12` |
```

**Regla:** Si hay CUALQUIER AC sin evidencia ✅, NO mostrar opción de cerrar.

**Mostrar al usuario:**

```md
## ✅ Implementación Completada: {ISSUE-ID}

**Archivos creados:**
- [lista]

**Archivos modificados:**
- [lista]

**Tests nuevos:**
- [lista]

**Verificación:**
- typecheck ✅
- lint ✅
- build ✅
- tests ✅

**Acceptance Criteria:** [tabla de AC con evidencia]

---

| # | Opción | Acción |
|---|--------|--------|
| 1 | **completar** | Marcar issue como Done |
| 2 | **revisar** | Ajustar antes de cerrar |
| 3 | **cancelar** | Dejar en progreso |

**¿Qué quieres hacer?** (1-3)
```

**🛑 STOP AQUÍ — Usar `notify_user` y esperar respuesta antes de Phase 6.**

---

## Phase 5: Quality Check (OBLIGATORIO)

> ⚠️ **NO PUEDES cerrar issue sin QC Report completo.**
> Ejecutar /qc ANTES de mostrar opciones de cierre.

```bash
cat ./.agent/workflows/qc.md
```

**Ejecutar:** `/qc {ISSUE_ID}`

| Resultado | Acción |
|-----------|--------|
| ✅ PASS | Continuar a Phase 6 |
| 🛑 STOP | Esperar confirmación |
| 🔴 FAIL | Fix antes de continuar |

---

## Phase 6: Cierre del Issue (OBLIGATORIO)

> ⚠️ El issue NO está completo hasta editar el archivo.

**A) Actualizar header:**
```markdown
> **Status:** ✅ Completed (YYYY-MM-DD)
```

**B) Agregar Implementation Notes:**
```markdown
## Implementation Notes

**Completed:** YYYY-MM-DD

**Context & Decisions:**
- **Resumen:** [qué se logró]
- **Ajustes:** [cambios durante sesión]
- **Decisiones:** [por qué X patrón]
- **Bloqueadores:** [problemas y resolución]

**Files created:**
- `path/to/new.ts` — [propósito]

**Files modified:**
- `path/to/existing.ts` — [qué cambió]

**Verification:**
- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass
- [x] Tests: X passing
```

**C) Marcar AC como completados:**
```markdown
- [x] Criterio 1
- [x] Criterio 2
```

**D) Verificar cierre:**
// turbo
```bash
grep -q "Status.*Completed" ./docs/backlog/*/issues/${ISSUE_ID}*.md && echo "✅ Issue cerrado correctamente"
```

---

## Phase 9: Handoff

```markdown
## ✅ {ISSUE-ID} Completado

Archivos: creados [X], modificados [Y]
Tests: passing
PR: `feat(scope): description ({ISSUE-ID})`

**Próximo:** `/implement {NEXT-ID}` o `/audit`
```
```

---

## Flujo Completo

```
/start → /discovery → /docs → /design → /backlog → /implement → /audit
                                                        ↑
                                                    YOU ARE HERE
```

**SSOT Chain:**
```
Discovery Brief → docs (01-08) → design (09) → backlog → code
```

---

## Reglas del Agente

**SIEMPRE:**
1. Auditoría Previa antes de cualquier código
2. Plan antes de implementar
3. **CHECKPOINT 1: Pedir confirmación antes de implementar**
4. Verificar antes de documentar
5. **CHECKPOINT 2: Pedir confirmación antes de cerrar**
6. Cerrar issue con Implementation Notes
7. Cumplir TODOS los AC
8. Conventional commits

**NUNCA:**
1. Implementar sin plan
2. **Implementar sin confirmación REAL del usuario (CHECKPOINT 1)**
3. **Inventar aprobación del usuario ("user approves", "LGTM", etc.)**
4. Adelantar trabajo de otros issues
5. **Cerrar issue sin confirmación REAL del usuario (CHECKPOINT 2)**
6. **Cerrar issue sin ejecutar /qc primero**
7. **Cerrar issue con AC incompletos**
8. Dejar issue sin cerrar
9. Ignorar errores de typecheck/lint
10. Commits sin conventional format

---

## Gates/Escalation

| Trigger | Acción |
|---------|--------|
| Auth/cache/API/state ambiguo | `/consult-architect` |
| Schema change | Cargar db skill |
| Security concern | Cargar security skill |

---

## Stop Conditions

| Condición | Acción |
|-----------|--------|
| Plan no confirmado | 🛑 STOP — Usar `notify_user` y esperar |
| Cierre no confirmado | 🛑 STOP — Usar `notify_user` y esperar |
| **Auto-aprobación detectada** | 🔴 VIOLACIÓN — Revertir implementación |
| **QC no ejecutado antes de cierre** | 🛑 STOP — Ejecutar /qc primero |
| **AC incompletos** | 🛑 STOP — No mostrar opción de cerrar |
| Issue no encontrado/duplicado | 🛑 STOP — Clarificar ID |
| Issue completado/bloqueado | 🛑 STOP — No continuar |
| Tests/pre-commit fallan | 🛑 STOP — Fix primero |

---

_TimeKast Factory — Implement Workflow_
