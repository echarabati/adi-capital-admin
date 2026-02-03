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
├─► SÍ (02_USER_STORIES.md y 09_DESIGN.md existen)
│   │
│   ├─► ¿Hay OQ High impact en 09_DESIGN?
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

### 0.2 🛑 STOP — Esperar Selección de Acción

> ⚠️ **MANDATORY STOP**: Usa `notify_user` con `BlockedOnUser: true`
> para mostrar las opciones y ESPERAR la respuesta del usuario.
>
> **NO continúes a Phase 0.5 sin respuesta explícita.**

❌ **PROHIBIDO:**

- Continuar si no hay respuesta del usuario
- Inventar respuestas ("user selects option 1")
- Asumir acción por defecto

**Si NO existe backlog**, este stop no aplica — ir directo a Phase 1.

---

## Phase 0.5: Context Status (MANDATORY)

> 🔴 **SIEMPRE MOSTRAR** — El agente DEBE mostrar el estado del contexto al inicio.
>
> Esta información es OBLIGATORIA en cada ejecución del workflow.

**El agente debe mostrar este bloque AL INICIO de su respuesta:**

```markdown
## 📊 Context Status

| Metric            | Value        | Status   |
| ----------------- | ------------ | -------- |
| Conversación      | [N] mensajes | 🟢/🟡/🔴 |
| Archivos leídos   | [M] archivos | 🟢/🟡/🔴 |
| Contexto estimado | [X]%         | 🟢/🟡/🔴 |

**Workflow:** /backlog
**Timestamp:** [fecha-hora]
```

### Thresholds

| Contexto | Status      | Acción                   |
| -------- | ----------- | ------------------------ |
| < 30%    | 🟢 OK       | Continuar normalmente    |
| 30-50%   | 🟡 Moderate | Continuar con precaución |
| > 50%    | 🔴 HIGH     | ⚠️ WARNING — Ver abajo   |

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
cat ./.agent/skills/roles/backlog/SKILL.md
```

// turbo

```bash
# Cargar validation skill para checklists pre/post generación
cat ./.agent/skills/domains/validation/backlog.md
```

---

## Phase 2: Verify Prerequisites

// turbo

```bash
echo "📄 Verificando docs de planning..."
ls -la ./docs/planning/*.md 2>/dev/null | wc -l
ls ./docs/planning/*.md 2>/dev/null || echo "❌ No hay docs de planning"
```

// turbo

```bash
echo "🖼️ Verificando wireframes..."
ls -la ./docs/wireframes/*.png 2>/dev/null || echo "⚠️ No hay wireframes (opcional)"
ls ./docs/wireframes/README.md 2>/dev/null || echo "⚠️ No hay wireframes README"
```

**Archivos requeridos (STOP si faltan):**

| Archivo                            | Estado       |
| ---------------------------------- | ------------ |
| `docs/planning/03_USER_STORIES.md` | ✅ Requerido |
| `docs/planning/09_DESIGN.md`       | ✅ Requerido |

**Archivos obligatorios (leer todos):**

| Archivo                    | Uso                               |
| -------------------------- | --------------------------------- |
| `00_DISCOVERY_BRIEFING.md` | Contexto, objetivos, scope        |
| `01_FEATURE_MAP.md`        | Features a cubrir                 |
| `02_USER_PERSONAS.md`      | Roles, RBAC, permisos             |
| `03_USER_STORIES.md`       | Source principal de issues        |
| `04_BUSINESS_RULES.md`     | Reglas de negocio, AC adicionales |
| `05_DATA_MODEL.md`         | Entidades, relaciones             |
| `06_ARCHITECTURE.md`       | Stack, ADRs, estructura           |
| `07_API_CONTRACTS.md`      | Actions, endpoints                |
| `08_GLOSSARY.md`           | Terminología                      |
| `09_DESIGN.md`             | Pantallas, flujos, componentes    |
| `10_RUNBOOKS.md`           | Contexto operacional (si existe)  |

**Assets visuales (si existen):**

| Asset                       | Uso                                 |
| --------------------------- | ----------------------------------- |
| `docs/wireframes/*.png`     | Referencias visuales para UI issues |
| `docs/wireframes/README.md` | Mapeo de wireframes a pantallas     |

**Si faltan prerequisitos mínimos:**

```markdown
⚠️ **Docs incompletos — No puedo generar Backlog**

**Faltante:**

- [archivo] → no existe

**Acción:** Ejecutar `/docs` y `/design` primero.
```

---

## Phase 3: Load ALL Planning Docs

> 🔴 **OBLIGATORIO:** Leer TODOS los documentos de planning (00-10) para generar un backlog completo y alineado.

### 3.1 Discovery y Contexto

// turbo

```bash
echo "=== 00_DISCOVERY_BRIEFING.md ==="
cat ./docs/planning/00_DISCOVERY_BRIEFING.md 2>/dev/null || echo "⚠️ No existe"
```

### 3.2 Feature Map

// turbo

```bash
echo "=== 01_FEATURE_MAP.md ==="
cat ./docs/planning/01_FEATURE_MAP.md 2>/dev/null || echo "⚠️ No existe"
```

### 3.3 User Personas (con RBAC)

// turbo

```bash
echo "=== 02_USER_PERSONAS.md ==="
cat ./docs/planning/02_USER_PERSONAS.md 2>/dev/null || echo "⚠️ No existe"
```

### 3.4 User Stories (SOURCE PRINCIPAL)

// turbo

```bash
echo "=== 03_USER_STORIES.md ==="
cat ./docs/planning/03_USER_STORIES.md
```

### 3.5 Business Rules

// turbo

```bash
echo "=== 04_BUSINESS_RULES.md ==="
cat ./docs/planning/04_BUSINESS_RULES.md 2>/dev/null || echo "⚠️ No existe"
```

### 3.6 Data Model

// turbo

```bash
echo "=== 05_DATA_MODEL.md ==="
cat ./docs/planning/05_DATA_MODEL.md 2>/dev/null || echo "⚠️ No existe"
```

### 3.7 Architecture

// turbo

```bash
echo "=== 06_ARCHITECTURE.md ==="
cat ./docs/planning/06_ARCHITECTURE.md 2>/dev/null || echo "⚠️ No existe"
```

### 3.8 API Contracts

// turbo

```bash
echo "=== 07_API_CONTRACTS.md ==="
cat ./docs/planning/07_API_CONTRACTS.md 2>/dev/null || echo "⚠️ No existe"
```

### 3.9 Glossary

// turbo

```bash
echo "=== 08_GLOSSARY.md ==="
cat ./docs/planning/08_GLOSSARY.md 2>/dev/null || echo "⚠️ No existe"
```

### 3.10 Design Specification (SOURCE PRINCIPAL)

// turbo

```bash
echo "=== 09_DESIGN.md ==="
cat ./docs/planning/09_DESIGN.md
```

### 3.11 Runbooks (Contexto Operacional)

// turbo

```bash
echo "=== 10_RUNBOOKS.md ==="
cat ./docs/planning/10_RUNBOOKS.md 2>/dev/null || echo "⚠️ No existe (opcional)"
```

### 3.12 Wireframes (Referencias Visuales)

// turbo

```bash
echo "=== Wireframes README ==="
cat ./docs/wireframes/README.md 2>/dev/null || echo "⚠️ No hay wireframes README"
echo ""
echo "=== Wireframes disponibles ==="
ls ./docs/wireframes/*.png 2>/dev/null || echo "⚠️ No hay wireframes"
```

> 💡 **Nota:** Los wireframes PNG se deben visualizar para issues de UI.
> El agente debe usar `view_file` para ver cada wireframe relevante al crear issues de UI.

**Extraer de todos los docs:**

- IDs de Features (F-XXX) → issues por feature
- IDs de Stories (US-XXX) → origen de issues
- IDs de Personas (P-XXX) → para user stories
- IDs de Business Rules (BR-XXX) → para AC
- IDs de Entities (E-XXX) → contexto técnico
- IDs de Pantallas (SCR-XXX) → cross-refs
- IDs de Flujos (FLW-XXX) → cross-refs
- IDs de Componentes (CMP-XXX) → cross-refs

---

## Phase 4: Check for Open Questions → ADR Issues

// turbo

```bash
grep -E "OQ-[0-9]+.*\*\*Alto\*\*|High|HIGH IMPACT" ./docs/planning/09_DESIGN.md 2>/dev/null && echo "⚠️ High impact OQs found - will create ADR issues" || echo "✅ No high impact OQs"
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

## Phase 11.5: Análisis de Cobertura (Drift/Gap Detection)

> 🔍 **OBLIGATORIO** — Comparar issues generados contra TODOS los docs anteriores (00-09).
>
> El agente DEBE analizar si los issues cubren TODO lo documentado.
> Este análisis se presenta al usuario ANTES del handoff.

### 11.5.1 Cargar TODOS los Docs Anteriores

// turbo

```bash
echo "📄 Cargando todos los docs para validación..."
# Discovery
head -100 ./docs/planning/00_DISCOVERY_BRIEF.md 2>/dev/null || true
# Docs 01-08
for f in ./docs/planning/0[1-8]_*.md; do
  echo "---"
  echo "📁 $f"
  head -50 "$f"
done
# Design
echo "---"
echo "📁 ./docs/planning/09_DESIGN.md"
head -100 ./docs/planning/09_DESIGN.md
```

### 11.5.2 Ejecutar Análisis Completo

**El agente debe comparar manualmente contra CADA documento:**

| Doc                | Qué verificar en Issues                            |
| ------------------ | -------------------------------------------------- |
| 00_DISCOVERY_BRIEF | Objetivos principales → issues que los implementan |
| 01_FEATURE_MAP     | Cada feature MVP → al menos 1 issue                |
| 02_USER_PERSONAS   | Cada persona → issues cubren su JTBD               |
| 03_USER_STORIES    | Cada US-XXX → issue con `Implementa: US-XXX`       |
| 04_BUSINESS_RULES  | BR críticas → issue que las implementa             |
| 05_DATA_MODEL      | Cada E-XXX → issue de CRUD si aplica               |
| 06_ARCHITECTURE    | ADRs → issue que implementa decisión               |
| 07_API_CONTRACTS   | Cada Action → issue que la implementa              |
| 08_GLOSSARY        | Términos → usados en títulos/descripciones         |
| 09_DESIGN          | Cada SCR-XXX → issues que la cubren                |
| 09_DESIGN          | Cada FLW-XXX → issues que lo implementan           |
| 09_DESIGN          | Cada CMP-XXX → issue para crear componente         |

### 11.5.3 Generar Reporte de Cobertura

**Formato OBLIGATORIO del análisis:**

```markdown
## 🔍 Análisis de Cobertura: Issues vs Todos los Docs

### ✅ Cubierto por Documento

#### 00_DISCOVERY_BRIEF

| Objetivo     | Cubierto | Issue(s)           |
| ------------ | -------- | ------------------ |
| [Objetivo X] | ✅       | DASH-001, CORE-002 |

#### 01_FEATURE_MAP

| Feature     | Cubierto | Issue(s) |
| ----------- | -------- | -------- |
| [Feature X] | ✅       | AUTH-001 |

#### 03_USER_STORIES

| Story  | Cubierta | Issue(s) |
| ------ | -------- | -------- |
| US-001 | ✅       | DASH-001 |

#### 09_DESIGN

| Pantalla | Cubierta | Issue(s)           |
| -------- | -------- | ------------------ |
| SCR-001  | ✅       | DASH-001, DASH-002 |

### ❌ Gaps Detectados

| #   | Doc | Elemento | Falta Issue   | Severidad   |
| --- | --- | -------- | ------------- | ----------- |
| 1   | 03  | US-XXX   | Sin issue     | 🔴 Critical |
| 2   | 09  | SCR-XXX  | Sin cobertura | 🔴 Critical |

### 🔄 Drift Detectado

| #   | Doc | Dice             | Issue dice    | Acción     |
| --- | --- | ---------------- | ------------- | ---------- |
| 1   | 09  | "Botón exportar" | No mencionado | Agregar AC |

### 📊 Resumen

- **Cobertura Discovery:** X%
- **Cobertura Features:** Y%
- **Cobertura Stories:** Z%
- **Cobertura Design:** W%
- **Gaps críticos:** N
```

- **Gaps críticos:** N
- **Drift detectado:** M items

````

### 11.5.3 Evaluar Resultado

**Si hay gaps 🔴 Critical (stories/pantallas sin issue):**
- Listar qué stories/pantallas faltan
- Sugerir crear issues adicionales
- Preguntar si corregir antes de continuar

---

## 🛑 CHECKPOINT 2: Post-Generation Review

> ⚠️ **MANDATORY STOP — ESPERAR APROBACIÓN**

**Mostrar al usuario:**

```markdown
## ✅ Backlog Generado

**Análisis de Cobertura:**
- Stories cubiertas: [X/Y] ([Z%])
- Pantallas cubiertas: [A/B] ([C%])
- Gaps críticos: [N]

**Opciones:**

| # | Opción | Acción |
|---|--------|--------|
| 1 | **Corregir gaps** | Crear issues faltantes |
| 2 | **Revisar backlog** | Ver epics/issues |
| 3 | **Aprobar** | Continuar a /implement |

**🛑 STOP AQUÍ — Esperar decisión del usuario**
````

**ACTION:** Call `notify_user` with `BlockedOnUser=true`.

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
| 09_DESIGN.md no existe | P0 | 🛑 STOP — `/design` primero |
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

Discovery Brief → docs (01-08) → design (09) → backlog → code

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
