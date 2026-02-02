---
description: Backlog workflow - generate issues from docs and design
---

# /backlog — Issue Generation

> **Flujo:** Bootstrap (Fase 4 — Backlog)
> **Anterior:** `/design`
> **Siguiente:** `/implement`
> **Propósito:** Generar issues ejecutables desde docs y design.

---

## Invocación

```bash
/backlog              # Genera issues desde docs/design
/backlog validate     # Solo valida prerrequisitos
/backlog refresh      # Regenera preservando IDs existentes
```

---

## 🌳 Árbol de Decisión

```
¿Tienes docs y design completos?
│
├─► SÍ (02_USER_STORIES.md y 06_DESIGN.md existen)
│   │
│   ├─► ¿Hay OQ High impact en 06_DESIGN?
│   │     ├─► Sí → Crear ADR-XXX issues + marcar dependencias + generar resto
│   │     └─► No → Generar backlog normal
│   └─► Fin
│
└─► NO
    └─► ❌ "Ejecuta /docs y /design primero"
```

> **⚠️ OQ High impact NO bloquea todo** — se crean ADR issues y el resto se genera.

---

## Phase 0: Backlog Action

**Primero verificar si hay backlog:**

// turbo

```bash
ls -d docs/backlog/v*/ 2>/dev/null && echo "✅ Backlog existe" || echo "❌ No hay backlog"
```

**Si NO existe backlog:**

> No hay backlog. Creando desde design...
> → Saltar a Phase 1

**Si SÍ existe backlog:**

```markdown
## 📋 Backlog Action

| #   | Acción          | Descripción                     |
| --- | --------------- | ------------------------------- |
| 1   | **profundizar** | Mejorar issues/epics existentes |
| 2   | **agregar**     | Agregar issue nuevo             |
| 3   | **milestone**   | Crear/editar milestone          |
| 4   | **epic**        | Crear/editar epic               |
| 5   | **status**      | Ver status del backlog          |

**¿Qué quieres hacer?** (1-5)

> 💡 Puedes dar feedback: "agregar issue para rate limiting"
```

**Si elige "profundizar":**

```markdown
| #   | Scope                                        |
| --- | -------------------------------------------- |
| 1   | **issue** — Mejorar issue específico         |
| 2   | **epic** — Mejorar epic específico           |
| 3   | **todo** — Revisar y mejorar todo el backlog |

**¿Qué profundizar?** (1-3)
```

**Si elige "issue":** → Mostrar lista de issues disponibles
**Si elige "epic":** → Mostrar lista de epics disponibles

---

## Phase 0.5: Context Size Check

> ⚠️ **Antes de continuar, evalúa el tamaño del contexto.**

**Indicadores de contexto alto (>70%):**

- Conversación con >15 intercambios largos
- Múltiples archivos grandes leídos (>500 líneas cada uno)
- Errores repetidos o respuestas truncadas previas

**Si el contexto parece alto:**

```md
⚠️ **Contexto de conversación alto**

Esta sesión ha procesado mucha información.
Para mejor calidad de resultados:

1. **Guardar progreso**: Commit cambios actuales
2. **Nueva sesión**: Abrir nueva conversación
3. **Ejecutar `/start`**: Cargar contexto fresco

> 💡 Puedes continuar si la tarea restante es simple.
```

---

## Phase 1: Context Loading

// turbo

```bash
cat ./.agent/rules/AI_RULES.md
```

// turbo

```bash
cat ./.agent/skills/roles/backlog/SKILL.md
```

---

## Phase 2: Verify Prerequisites

// turbo

```bash
ls -la ./docs/planning/02_USER_STORIES.md ./docs/planning/06_DESIGN.md 2>/dev/null || echo "❌ Missing required docs"
```

**Archivos requeridos:**

| Archivo                            | Estado       |
| ---------------------------------- | ------------ |
| `docs/planning/02_USER_STORIES.md` | ✅ Requerido |
| `docs/planning/06_DESIGN.md`       | ✅ Requerido |

**Archivos opcionales (mejoran calidad):**
| Archivo | Uso |
|---------|-----|
| `00_DISCOVERY_BRIEFING.md` | Contexto general |
| `01_USER_PERSONAS.md` | Roles para user stories |
| `03_BUSINESS_RULES.md` | AC adicionales |
| `04_DATA_MODEL.md` | Contexto técnico |

**Si faltan prerequisitos:**

```markdown
⚠️ **Docs incompletos — No puedo generar Backlog**

**Faltante:**

- [archivo] → no existe

**Acción:** Ejecutar `/docs` y `/design` primero.
```

---

## Phase 3: Load Docs

// turbo

```bash
cat ./docs/planning/02_USER_STORIES.md
```

// turbo

```bash
cat ./docs/planning/06_DESIGN.md
```

// turbo

```bash
cat ./docs/planning/01_USER_PERSONAS.md 2>/dev/null || true
cat ./docs/planning/03_BUSINESS_RULES.md 2>/dev/null || true
cat ./docs/planning/04_DATA_MODEL.md 2>/dev/null || true
```

**Extraer:**

- IDs de Stories (US-XXX) → origen de issues
- IDs de Personas (P-XXX) → para user stories
- IDs de Pantallas (SCR-XXX) → cross-refs
- IDs de Flujos (FLW-XXX) → cross-refs
- IDs de Componentes (CMP-XXX) → cross-refs
- IDs de Entities (E-XXX) → contexto técnico

---

## Phase 4: Check for Open Questions → ADR Issues

// turbo

```bash
grep -E "OQ-[0-9]+.*\*\*Alto\*\*|High|HIGH IMPACT" ./docs/planning/06_DESIGN.md 2>/dev/null && echo "⚠️ High impact OQs found - will create ADR issues" || echo "✅ No high impact OQs"
```

**Si hay OQ High impact (NO bloquear, crear ADRs):**

1. Por cada OQ High impact → crear `ADR-XXX: Decidir [tema]`
2. Marcar issues afectados con `> **Blocked By:** ADR-XXX`
3. Continuar generando el resto del backlog

**Formato de ADR issue:**

```markdown
# ADR-001: Decidir [tema]

> **Issue ID:** ADR-001
> **Priority:** P0
> **Effort:** XS
> **Status:** 📋 Backlog
> **Epic:** [EPIC-XXX](../epics/EPIC-XXX.md)

## Contexto

[Descripción de la decisión pendiente]

## Opciones

### A) [Opción A]

- Pros: ...
- Cons: ...

### B) [Opción B]

- Pros: ...
- Cons: ...

## Decisión

**Pendiente**

## Afecta a

- {PREFIX}-XXX
- {PREFIX}-YYY
```

---

## Phase 5: Load Templates

// turbo

```bash
cat ./.agent/skills/roles/backlog/issue.template.md
cat ./.agent/skills/roles/backlog/epic.template.md
```

---

## Phase 6: Determine Version/Milestone (determinístico)

**Regla:** No preguntar, usar lógica automática.

// turbo

```bash
# Encontrar versión más reciente o crear v1.0
VERSION=$(ls -d ./docs/backlog/v*/ 2>/dev/null | sort -V | tail -1 | xargs basename 2>/dev/null || echo "v1.0")
echo "Using version: $VERSION"
```

**Lógica:**

- Si existen `docs/backlog/v*/` → usar la **más reciente** (semver sort)
- Si no existe ninguna → usar `v1.0`
- `/backlog refresh` usa misma versión, preserva IDs

---

## Phase 7: Create Structure

```bash
# Crear estructura de directorios
mkdir -p ./docs/backlog/{version}/epics
mkdir -p ./docs/backlog/{version}/issues
```

---

## Phase 8: Generate Epics

**Agrupar User Stories por feature/componente:**

| Epic      | User Stories   | Descripción   |
| --------- | -------------- | ------------- |
| EPIC-AUTH | US-001, US-002 | Autenticación |
| EPIC-DASH | US-010, US-011 | Dashboard     |

**Para cada epic:**

1. Copiar template: `epic.template.md`
2. Reemplazar placeholders
3. Listar issues que contendrá

---

## Phase 9: Generate Issues

**⚠️ COMPATIBILIDAD CON update-board:**

Para cada US-XXX crear issue con:

**9.1 Nombre de archivo:**

```
{PREFIX}-{NUM}-{slug}.md
```

Ejemplo: `AUTH-001-login-form.md`

**9.2 Título (CRÍTICO para parsing):**

```markdown
# AUTH-001: Implementar Login Form
```

**9.3 Metadata block (CRÍTICO para parsing):**

```markdown
> **Issue ID:** AUTH-001
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [EPIC-AUTH](../epics/EPIC-AUTH.md)
```

**9.4 Cross-references:**

```markdown
**Implementa:** US-001
**Pantalla:** SCR-001
**Flujo:** FLW-001
**Componentes SK:** Form, Input, Button
**Componentes Nuevos:** CMP-001
```

---

## Phase 10: Assign Priorities

| Priority | Criterio                                   |
| -------- | ------------------------------------------ |
| P0       | Bloquea otros issues, infraestructura base |
| P1       | MVP crítico, primera iteración             |
| P2       | Segunda iteración                          |
| P3       | Nice-to-have                               |

**Orden de asignación:**

1. Identificar dependencias entre issues
2. Issues que bloquean otros → P0
3. Issues en flujos críticos → P1
4. Resto P2/P3

---

## 🛑 CHECKPOINT: Pre-Issue Generation

> **MANDATORY STOP — USAR notify_user TOOL**
>
> El agente DEBE llamar a `notify_user` con:
>
> - `BlockedOnUser: true`
> - `Message`: Resumen del backlog planificado
>
> **NO EJECUTAR MÁS HERRAMIENTAS SIN RESPUESTA DEL USUARIO.**

**Resumen para usuario:**

- Milestone: {version}
- Epics planificados: [N]
- Issues planificados: [M]
- ADRs pendientes: [lista si hay]

| Epic     | Issues             | Effort |
| -------- | ------------------ | ------ |
| EPIC-XXX | AUTH-001, AUTH-002 | M+S    |

**Opciones:**

| #   | Opción       | Acción                      |
| --- | ------------ | --------------------------- |
| 1   | **generar**  | Crear epics e issues        |
| 2   | **revisar**  | Ver plan detallado de epics |
| 3   | **cancelar** | Salir                       |

**¿Qué quieres hacer?** (1-3)

**ACTION:** Call `notify_user` NOW with `BlockedOnUser=true`.

---

## Phase 11: Validation

// turbo

```bash
ls -la ./docs/backlog/*/issues/*.md 2>/dev/null | head -20
```

**Validación automática (update-board compatible):**

// turbo

```bash
# Verificar formato de título
for f in ./docs/backlog/*/issues/*.md; do
  grep -qE "^# [A-Z]+-[0-9]+:" "$f" && echo "✅ $f: título OK" || echo "❌ $f: título incorrecto"
done 2>/dev/null || echo "No issues found"
```

// turbo

```bash
# Verificar metadata
for f in ./docs/backlog/*/issues/*.md; do
  grep -q ">\s*\*\*Status:\*\*" "$f" && echo "✅ $f: status OK" || echo "❌ $f: falta status"
done 2>/dev/null || echo "No issues found"
```

// turbo

```bash
# Verificar Priority
for f in ./docs/backlog/*/issues/*.md; do
  grep -q ">\s*\*\*Priority:\*\*" "$f" && echo "✅ $f: priority OK" || echo "❌ $f: falta priority"
done 2>/dev/null || echo "No issues found"
```

**Checklist:**

| Item        | Verificar                        |
| ----------- | -------------------------------- |
| Título      | Formato `# PREFIX-NUM: Título`   |
| Metadata    | Status, Priority, Effort, Epic   |
| Referencias | US-XXX, SCR-XXX, FLW-XXX         |
| AC          | Checkboxes verificables          |
| Ubicación   | `docs/backlog/{version}/issues/` |

---

## Phase 12: Generate Board

```bash
# Si pnpm disponible
pnpm update-board 2>/dev/null || echo "Ejecutar 'pnpm update-board' manualmente"
```

---

## Phase 13: Handoff

````markdown
## ✅ Backlog Generado

**Proyecto:** [nombre]
**Milestone:** [version]
**Epics:** [N] creados
**Issues:** [M] totales

**Distribución:**
| Priority | Count |
|----------|-------|
| P0 | [X] |
| P1 | [Y] |
| P2 | [Z] |
| P3 | [W] |

**Artefactos:**

- `docs/backlog/{version}/README.md`
- `docs/backlog/{version}/epics/*.md`
- `docs/backlog/{version}/issues/*.md`

**Board:**

```bash
pnpm update-board  # Generar BOARD.md
```
````

---

## 🚀 Próximo Paso

**Flujo:** `/discovery` ✅ → `/docs` ✅ → `/design` ✅ → `/backlog` ✅ → **`/implement`** → `/audit`

Ejecutar:

```
/implement
```

Este comando implementa issues del backlog.

```

---

## Gates/Escalation

| Trigger | Acción |
|---------|--------|
| Issue requiere cambio de schema | → `/consult-architect` |
| Issue afecta auth/security | → Flag como 🔴 HIGH risk |
| Dependencia entre issues no clara | → Documentar en epic |

---

## Stop Conditions

| Condición | Severidad | Acción |
|-----------|-----------|--------|
| 02_USER_STORIES.md no existe | P0 | 🛑 STOP — `/docs` primero |
| 06_DESIGN.md no existe | P0 | 🛑 STOP — `/design` primero |
| OQ High impact en 06 sin ADR | P1 | 🛑 STOP — Crear ADR issues primero |
| Dependencias circulares | P1 | 🛑 STOP — Resolver antes de prioridades |

---

## Flujo Completo

```

/start → /discovery → /docs → /design → /backlog → /implement → /audit
↑
YOU ARE HERE

```

**SSOT Chain:**
```

Discovery Brief → docs (01-05) → design (06) → backlog → code

```

---

## Reglas del Agente

**SIEMPRE:**
1. Verificar 02 y 06 existen
2. Usar formato de título: `# PREFIX-NUM: Título`
3. Incluir metadata block (Status, Priority, Epic)
4. Cross-reference IDs (US/P/SCR/FLW/CMP/E)
5. Agrupar en epics
6. Declarar dependencias
7. Ubicar en `docs/backlog/{version}/issues/`

**NUNCA:**
1. Inventar features no en 02 o 06
2. Crear issues sin metadata block
3. Romper formato de título (rompe BOARD.md)
4. Crear issues demasiado grandes (>1 día)
5. Omitir AC

---

_TimeKast Factory — Backlog Workflow_
```
