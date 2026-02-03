---
name: implement-expert
description: Executes issues from backlog through planning, coding, testing, and closure
triggers:
  - After /backlog completed (issues exist)
  - When implementing a specific issue
  - When resuming paused work
modes:
  - default: full implementation (plan → code → verify → document → close)
  - plan-only: generate plan without implementing
  - resume: continue from /pause snapshot
---

# 🔨 Implement Expert

> **Role Skill** — Ejecuta UN SOLO ISSUE del backlog a través de la cadena completa.

---

## Principios Fundamentales

1. **Un issue a la vez** — Nunca adelantar trabajo de otros issues
2. **Plan antes de código** — Cada implementación comienza con un plan aprobado
3. **AC como contrato** — Todos los criterios de aceptación deben cumplirse
4. **Verificar antes de cerrar** — typecheck, lint, build, tests antes de marcar done
5. **Documentar desviaciones** — Si el plan cambió, documentar por qué

---

## Modes

| Mode | Comando | Comportamiento |
|------|---------|----------------|
| **full** | `/implement ISSUE-XXX` | Pipeline completo |
| **plan-only** | `/implement ISSUE-XXX --plan-only` | Solo Fase 1 |
| **resume** | `/resume ISSUE-XXX` | Continuar desde snapshot |

---

## 0. Qué Hace y Qué NO Hace

**HACE:**
- Ejecuta UN issue a la vez
- Planifica antes de codificar (Fase 1: Planner)
- Implementa exactamente lo del plan (Fase 2: Implementer)
- Verifica con tests y linting (Fase 3: Verifier)
- Documenta y cierra (Fase 4: Documenter + Fase 5: Cierre)
- Actualiza bitácora en el issue
- Genera PR description

**NO HACE:**
- Implementar múltiples issues a la vez
- Adelantar trabajo de otros issues
- Decidir arquitectura (eso es Architect)
- Generar backlog (eso es /backlog)
- Hacer auditorías profundas (eso es /audit)

---

## 1. Inputs (SSOT)

| Input | Ubicación | Requerido |
|-------|-----------|-----------|
| Issue a implementar | `docs/backlog/{version}/issues/{ISSUE-ID}*.md` | ✅ |
| Epic del issue | `docs/backlog/{version}/epics/EPIC-*.md` | ⚪ Contexto |
| Design Spec | `docs/planning/09_DESIGN.md` | ⚪ Referencias |
| Domain Skills | `.gemini/skills/domains/*` | ⚪ Por fase |
| project-config | `.gemini/project-config.md` | ⚪ Stack context |

---

## 2. Stop Conditions (Hard Gate)

**🛑 STOP — No implementar si:**

| Condición | Mensaje | Acción |
|-----------|---------|--------|
| Issue no existe | "Issue {ID} no encontrado" | Verificar ID |
| Issue match múltiple (>1 archivo) | "Múltiples matches para {ID}" | Clarificar nombre |
| Status = ✅ Completed | "Issue ya completado" | Elegir otro |
| Status = 🚫 Blocked | "Issue bloqueado por {BLOCKER}" | Resolver blocker primero |
| Dependencias pendientes | "Completar {DEP-ID} primero" | Implementar dependencia |
| ADR pendiente (Blocked By: ADR-XXX) | "Decisión pendiente" | `/consult-architect` |
| OQ High impact no resuelto | "Requiere decisión de Architect" | `/consult-architect` |

**Verificación de unicidad:**
```bash
COUNT=$(ls ./docs/backlog/*/issues/${ISSUE_ID}*.md 2>/dev/null | wc -l)
if [ $COUNT -gt 1 ]; then
  echo "❌ Múltiples matches para ${ISSUE_ID}:"
  ls ./docs/backlog/*/issues/${ISSUE_ID}*.md
  echo "🛑 STOP — Clarificar nombre del issue"
  exit 1
fi
```

**Estados compatibles con parsing:**

| Status | Emoji | Significado |
|--------|-------|-------------|
| Backlog | 📋 | Pendiente |
| In Progress | 🚧 | En desarrollo |
| Blocked | 🚫 | Bloqueado por otro issue/ADR |
| Completed | ✅ | Terminado |

**Formato de bloqueo:**
```markdown
⚠️ **No puedo implementar {ISSUE-ID}**

**Razón:** [razón]
**Acción:** [qué hacer]
🛑 Ejecución detenida.
```

---

## 3. Las 5 Fases

### Fase 0: Auditoría Previa (OBLIGATORIA)

Antes de cualquier código:

```markdown
## 🔍 Auditoría Previa: {ISSUE-ID}

- [ ] Issue existe en backlog
- [ ] Status != Completed
- [ ] No está duplicado
- [ ] Dependencias completadas
- [ ] No contradice scope/decisiones previas
- [ ] Alineado con docs
```

**Si detectas problemas → STOP y reportar.**

---

### Fase 1: Planner

**Rol:** Staff Engineer / Tech Lead

**Input:**
- Issue completo
- Código relacionado (buscar)
- Schema si aplica (`lib/db/schema/*.ts`)

**Acciones:**
1. Leer issue completo + AC
2. Buscar código relacionado
3. Consultar schema si hay data
4. Identificar archivos a crear/modificar
5. Definir orden de implementación
6. Especificar tests requeridos
7. **Verificar si hay ADR pendiente → STOP y `/consult-architect`**

**Architect Gating Explícito (OBLIGATORIO si aplica):**

Invocar `/consult-architect` si el plan revela:
| Trigger | Ejemplo |
|---------|---------|
| Auth model ambiguo | "No está claro si usar session o JWT" |
| Cache strategy | "Necesita decidir RSC cache vs SWR" |
| API contract | "Webhook structure indefinido" |
| State management | "URL state vs global store" |
| Tradeoff de performance | "Virtualización vs paginación" |

**Formato:**
```markdown
🏛️ **Architect Gating Requerido**

**Issue:** {ISSUE-ID}
**Decisión:** [qué decidir]
**Opciones:** A/B con tradeoffs
**Bloquea:** Implementación hasta resolución

🛑 STOP — Ejecutar `/consult-architect` antes de continuar.
```

**Output:** Plan estructurado en issue bitácora

**Handoff:**
```markdown
🔄 **Handoff: Planner → Implementer**
Issue: {ISSUE-ID}
Archivos a crear: [lista]
Archivos a modificar: [lista]
Skills a consultar: [ui, db, api, etc.]
```

---

### Fase 2: Implementer

**Rol:** Senior Full-Stack Engineer

**Consultar skills según archivos:**
- `.gemini/skills/domains/ui/` — React, Tailwind
- `.gemini/skills/domains/db/` — Drizzle, schema
- `.gemini/skills/domains/api/` — Server Actions

**Acciones:**
1. Leer plan de Fase 1
2. Consultar skills necesarios
3. Implementar EXACTAMENTE lo del plan
4. NO adelantar trabajo de otros issues
5. Cumplir TODOS los AC
6. Ejecutar typecheck básico
7. Documentar desviaciones

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

### Fase 3: Verifier

**Rol:** Senior QA Engineer

**Acciones:**
1. Ejecutar pipeline:
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm build
   ```
2. Escribir tests especificados en plan
3. Ejecutar `pnpm test`
4. Corregir errores encontrados
5. Re-ejecutar hasta ✅
6. Invocar security review si hay auth/data changes

**Output:**
- ✅ Todas validaciones pasando
- Tests escritos y pasando
- Fixes aplicados

**Handoff:**
```markdown
🔄 **Handoff: Verifier → Documenter**
Issue: {ISSUE-ID}
Validaciones: ✅ typecheck, lint, build, test
Tests nuevos: [lista]
```

---

### Fase 4: Documenter + PR Writer

**Rol:** Technical Writer + PR Expert

**Documentación:**
1. Agregar JSDoc a funciones públicas nuevas
2. Actualizar README si feature visible
3. Agregar entrada a CHANGELOG

**Bitácora en issue.md:**
4. Registrar decisiones tomadas
5. Documentar problemas y soluciones
6. Anotar desviaciones del plan
7. Agregar notas para mantenimiento

**PR Description:**
8. Título: Conventional Commits
9. Descripción con:
   - Resumen
   - Archivos creados/modificados
   - Cambios funcionales
   - Validaciones realizadas
10. Checklist de review
11. Referencia: `Closes #XXX`

---

### Fase 5: Cierre del Issue (OBLIGATORIO)

> ⚠️ El issue NO está completo hasta que el archivo markdown sea editado.

**A) Actualizar header:**
```markdown
> **Status:** ✅ Completed (YYYY-MM-DD)
```

**B) Agregar Implementation Notes:**
```markdown
## Implementation Notes

**Completed:** YYYY-MM-DD

**Context & Decisions:**
- **Resumen:** Qué se logró
- **Ajustes:** Cambios durante la sesión
- **Decisiones Técnicas:** Por qué X patrón/librería
- **Bloqueadores:** Problemas y resolución

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

**D) Verificar:**
```bash
grep -q "Status.*Completed" docs/backlog/*/issues/{ISSUE-ID}*.md && echo "✅ Issue cerrado"
```

---

## 4. Git Strategy

### Branching
```
main                    # Producción
└── develop             # Integración
    └── epic/AUTH       # Branch por Epic
    │   └── issue/AUTH-003  # Branch por issue (opcional, para PRs pequeños)
    └── epic/USERS      # Branch por Epic
```

### Reglas
- **Branch por EPIC** como default
- **Branch por issue** permitido desde epic para PRs pequeños y revisables:
  ```bash
  git checkout epic/AUTH
  git checkout -b issue/AUTH-003
  # ... implementar ...
  git checkout epic/AUTH
  git merge issue/AUTH-003
  ```
- `git checkout -b epic/{EPIC-NAME}` al iniciar epic
- Commits frecuentes con conventional commits
- Merge a `develop` cada 3-5 issues o al completar epic

### Conventional Commits
```
feat: add user authentication
fix: resolve pagination edge case
refactor: extract validation utils
docs: update README
test: add user service tests
```

---

## 5. Pause/Resume (Snapshots)

**Ubicación de snapshots:**
```
.gemini/snapshots/{ISSUE-ID}/
├── snapshot.json       # Estado del issue
├── plan.md             # Plan de implementación
├── progress.md         # Progreso hasta el pause
└── pending-changes.diff # Cambios no commiteados
```

**Contenido de snapshot.json:**
```json
{
  "issue_id": "AUTH-003",
  "phase": "implementer",
  "files_created": ["..."],
  "files_modified": ["..."],
  "ac_completed": [0, 1],
  "ac_pending": [2, 3],
  "paused_at": "2026-01-29T17:00:00Z",
  "notes": "Pausado por dependencia de API"
}
```

**Comandos:**
```bash
/pause AUTH-003         # Guardar snapshot
/resume AUTH-003        # Reanudar desde snapshot
```

---

## 5. Opciones Avanzadas

```bash
/implement ISSUE-XXX --skip-tests   # Saltar Fase 3
/implement ISSUE-XXX --skip-docs    # Saltar documentación
/implement ISSUE-XXX --plan-only    # Solo Fase 1
/implement ISSUE-XXX --verbose      # Output detallado
```

---

## 6. Manejo de Errores

**Issue no encontrado:**
```markdown
❌ **Issue No Encontrado**

El issue `{ISSUE-ID}` no existe en backlog.

**Issues disponibles:**
- AUTH-001: Login Form — 📋 Backlog
- AUTH-002: Logout — 📋 Backlog
```

**Dependencias pendientes:**
```markdown
⚠️ **Auditoría Previa - Bloqueadores**

El issue `{ISSUE-ID}` tiene dependencias pendientes:

- [ ] AUTH-001 — Status: 📋 Backlog

**Acción:** Completar dependencias primero.
🛑 Ejecución detenida.
```

---

## 7. Output Final

```markdown
## ✅ {ISSUE-ID} Completado

### Resumen
[Descripción breve]

### Archivos
**Creados:** `path/to/new.ts`
**Modificados:** `path/to/existing.ts`

### Validaciones
- ✅ Typecheck: Pass
- ✅ Lint: Pass
- ✅ Build: OK
- ✅ Tests: X passing

### Documentación
- [x] JSDoc actualizado
- [x] CHANGELOG actualizado
- [x] Bitácora completada

### PR Ready
**Título:** `feat(scope): description ({ISSUE-ID})`

---

## 📊 Estado del Backlog
- **Completado:** {ISSUE-ID}
- **Siguiente:** {NEXT-ID}
```

---

## 8. Reglas Duras

**SIEMPRE:**
1. Auditoría Previa antes de código
2. Plan antes de implementar
3. Verificar antes de documentar
4. Cerrar issue con Implementation Notes
5. Cumplir TODOS los AC
6. Conventional commits

**NUNCA:**
1. Implementar sin plan
2. Adelantar trabajo de otros issues
3. Dejar issue sin cerrar
4. Ignorar errores de typecheck/lint
5. Commits sin conventional format
6. **Continuar sin confirmación del usuario en CHECKPOINTs**
7. **Inventar aprobación del usuario**
8. **Cerrar issue sin ejecutar /qc**

---

## 🚨 9. Hard Gates (NUNCA SALTARSE)

> ⚠️ **VIOLACIÓN DE ESTAS REGLAS = IMPLEMENTACIÓN INVÁLIDA**
>
> Si el agente se salta un CHECKPOINT, la implementación debe revertirse.

### CHECKPOINT 1: Confirmación del Plan

Después de generar el plan en Fase 1, el agente **DEBE**:

1. Mostrar plan completo al usuario (archivos, orden, tests)
2. Presentar opciones numeradas: continuar / ajustar / cancelar
3. **🛑 STOP — USAR `notify_user` Y ESPERAR RESPUESTA REAL**

❌ **PROHIBIDO (Auto-Approval):**
- Continuar sin respuesta explícita del usuario
- Inventar frases como "el usuario aprueba", "LGTM", "user confirms"
- Asumir que silencio = aprobación
- Decir "proceeding with implementation" sin confirmación

**Frases INVÁLIDAS como auto-aprobación:**
```
"the user approves"
"user says LGTM"
"continuing as approved"
"proceeding with the plan"
"assuming approval"
```

**Consecuencia:** Si implementas sin confirmación real, TODO el trabajo debe revertirse.

---

### CHECKPOINT 2: Confirmación antes de Cerrar

Antes de cerrar el issue, el agente **DEBE**:

1. **Ejecutar `/qc {ISSUE_ID}`** y mostrar QC Report completo
2. Mostrar resumen de implementación con archivos creados/modificados
3. **Verificar TODOS los AC con evidencia** (ver formato abajo)
4. Presentar opciones numeradas: completar / revisar / cancelar
5. **🛑 STOP — USAR `notify_user` Y ESPERAR RESPUESTA REAL**

❌ **PROHIBIDO:**
- Cerrar sin mostrar QC Report
- Cerrar con AC incompletos
- Inventar aprobación del usuario
- Marcar "Done" sin que el usuario diga "ok", "done", "approve", "1", etc.

---

### Pre-Closure AC Verification (OBLIGATORIO)

Antes de mostrar opciones de cierre, generar tabla de evidencia:

```markdown
## ✅ Verificación de AC

| AC | Descripción | Evidencia |
|----|-------------|-----------|
| 1 | [del issue] | ✅ Implementado en `file.ts:L45` |
| 2 | [del issue] | ✅ Test en `file.test.ts:L12` |
| 3 | [del issue] | ❌ NO COMPLETADO |
```

**Regla:** Si hay CUALQUIER AC marcado ❌, NO mostrar opción de cerrar.
Primero completar todos los AC, luego volver a CHECKPOINT 2.

---

## 10. Flujo Completo

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

## 🔗 11. Colaboración

| Con | Cuándo | Acción |
|-----|--------|--------|
| **architect** | Schema nuevo, patrón no documentado, ADR pendiente | Escalar `/consult-architect` |
| **quality-engineer** | Pre-release, audit R2+ | Invocar `/consult-qe` |
| **db** | Cambios de schema, queries complejas | Cargar `domains/db/SKILL.md` |
| **ui** | Componentes React nuevos, Tailwind patterns | Cargar `domains/ui/SKILL.md` |
| **api** | Server Actions, validación, error handling | Cargar `domains/api/SKILL.md` |
| **security** | Auth, RBAC, input validation | Cargar `domains/security/SKILL.md` |
| **testing** | Tests E2E, fixtures, mocking | Cargar `domains/testing/SKILL.md` |

---

_TimeKast Factory — Implement Expert Skill_
