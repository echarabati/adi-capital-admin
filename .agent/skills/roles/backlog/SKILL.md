---
name: backlog-expert
description: Generates issues from Discovery Brief, Docs, and Design
triggers:
  - After /design completed (06_DESIGN.md exists)
  - When issues need to be created from specs
  - When backlog needs to be updated
modes:
  - default: generate issues from docs
  - validate: validate prerequisites only
  - refresh: regenerate preserving issue IDs
---

# 📋 Backlog Expert

> **Role Skill** — Transforma specs (Brief + Docs + Design) en issues ejecutables.

---

## Principios Fundamentales

1. **SSOT downstream** — Issues derivan de docs, nunca se inventan
2. **Atómicos y cerrables** — Cada issue es una unidad completa que se puede verificar
3. **IDs inmutables** — Una vez asignado, el ID nunca cambia (incluso al refactorizar)
4. **AC verificables** — Cada criterio se puede convertir en un test
5. **Dependencias explícitas** — `Blocked By` siempre documentado

---

## Modes

| Mode | Comando | Comportamiento |
|------|---------|----------------|
| **generate** | `/backlog` | Genera issues desde docs y design |
| **validate** | `/backlog validate` | Solo verifica prerrequisitos |
| **refresh** | `/backlog refresh` | Regenera preservando IDs de issues existentes |

**Regla de refresh:**
- Si `docs/backlog/{version}/issues/*.md` ya existen → preservar IDs
- Solo agregar nuevos issues, no renumerar existentes
- IDs eliminados NO se reutilizan

---

## 0. Qué Hace y Qué NO Hace

**HACE:**
- Transforma User Stories (US-XXX) en issues implementables
- Agrupa issues en epics por feature/componente
- Asigna prioridad basada en dependencias y valor
- Estima esfuerzo (T-shirt sizing)
- Cross-referencia a Design (SCR/FLW/CMP), Docs (P/US/BR/E)
- Genera issues compatibles con `pnpm update-board`

**NO HACE:**
- Diseñar soluciones (eso es /design)
- Escribir código (eso es /implement)
- Evaluar calidad (eso es /audit)
- Inventar features no documentados

---

## 1. Inputs (SSOT)

| Input | Ubicación | Requerido |
|-------|-----------|-----------|
| Discovery Brief | `docs/planning/00_DISCOVERY_BRIEFING.md` | ⚪ Contexto |
| User Personas | `docs/planning/01_USER_PERSONAS.md` | ✅ Para user stories |
| User Stories | `docs/planning/02_USER_STORIES.md` | ✅ Source principal |
| Business Rules | `docs/planning/03_BUSINESS_RULES.md` | ⚪ Para AC |
| Data Model | `docs/planning/04_DATA_MODEL.md` | ⚪ Para contexto técnico |
| Architecture | `docs/planning/05_ARCHITECTURE.md` | ⚪ Para decisiones |
| Design | `docs/planning/06_DESIGN.md` | ✅ Para pantallas/flujos |

---

## 2. Stop Conditions

**🛑 STOP — No generar issues si:**

| Condición | Acción |
|-----------|--------|
| 02_USER_STORIES.md no existe | Ejecutar `/docs` primero |
| 06_DESIGN.md no existe | Ejecutar `/design` primero |

**⚠️ NO BLOQUEAR por OQ High impact:**
- Si Design tiene OQ High impact → **NO detener todo**
- Crear `ADR-XXX` issue para la decisión
- Marcar issues afectados con `> **Blocked By:** ADR-XXX`
- Generar el resto del backlog normalmente

**Formato de bloqueo (solo si faltan docs):**
```markdown
⚠️ **No puedo generar Backlog**

**Faltante:**
- [doc] → no existe

**Acción:** Ejecutar [/docs | /design] primero.
```

---

## 3. Output (Estructura)

**Ubicación:**
```
docs/backlog/{version}/
├── README.md            # Overview del milestone
├── epics/
│   ├── EPIC-{NAME}.md   # Epic files
│   └── ...
└── issues/
    ├── {PREFIX}-001-{slug}.md
    ├── {PREFIX}-002-{slug}.md
    └── ...
```

**SSOT Chain:**
```
Discovery Brief → docs (01-05) → design (06) → backlog → code
```

---

## 4. Compatibilidad con update-board

**CRÍTICO:** El script `pnpm update-board` parsea issues para generar BOARD.md.

### Formato de Título (REQUERIDO)
```markdown
# {PREFIX}-{NUM}: {Título Descriptivo}
```
Ejemplo: `# AUTH-001: Implementar Login Form`

### Metadata (REQUERIDO)
```markdown
> **Issue ID:** {PREFIX}-{NUM}
> **Priority:** P0 | P1 | P2 | P3
> **Effort:** XS | S | M | L | XL
> **Status:** 📋 Backlog | 🚧 In Progress | ✅ Done
> **Epic:** [EPIC-{NAME}](../epics/EPIC-{NAME}.md)
```

**Reglas de parsing:**
- Status se detecta por emoji: `✅` = done, `🚧` = in-progress, default = todo
- Priority se detecta por `P0|P1|P2|P3`
- Epic se extrae de link markdown

### Ubicación de Archivos (REQUERIDO)
```
docs/backlog/{version}/issues/{PREFIX}-{NUM}-{slug}.md
```
El `{version}` se extrae del path para agrupar por milestone.

---

## 5. IDs (Backlog)

### Nuevos IDs

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Epics | `EPIC-{NAME}` | EPIC-AUTH, EPIC-DASHBOARD |
| Issues | `{PREFIX}-{NUM}` | AUTH-001, DASH-015 |

### Prefijos por Dominio

| Dominio | Prefijo | Ejemplo |
|---------|---------|---------|
| **Decisiones/ADRs** | `ADR-` | ADR-001 |
| Autenticación | `AUTH-` | AUTH-001 |
| Dashboard | `DASH-` | DASH-001 |
| Usuarios | `USER-` | USER-001 |
| Configuración | `CFG-` | CFG-001 |
| Core/Misc | `CORE-` | CORE-001 |
| Infraestructura | `INFRA-` | INFRA-001 |
| Shell/Navigation | `SHELL-` | SHELL-001 |

> **Tip:** Si un issue toca múltiples áreas, usar el prefijo del **punto de entrada** (pantalla/flujo principal).

### Cross-references desde Docs/Design

| Tipo | Formato | Uso en Issues |
|------|---------|---------------|
| Personas | P-XXX | "Como P-001 (Admin)…" |
| Stories | US-XXX | "Implementa US-003" |
| Pantallas | SCR-XXX | "Pantalla: SCR-002" |
| Flujos | FLW-XXX | "Flujo: FLW-001" |
| Componentes | CMP-XXX | "Nuevo: CMP-003" |

### Reglas de Estabilidad

- IDs por orden de creación por epic
- Si issues existen → preservar numeración
- Nuevos issues toman siguiente número disponible
- IDs eliminados NO se reutilizan

---

## 6. Template de Issue

Usar template en: `.gemini/skills/roles/backlog/issue.template.md`

**Secciones mínimas:**
1. Título con ID (`# {PREFIX}-{NUM}: {Título}`)
2. Metadata block (`> **Status:**`, etc.)
3. Descripción
4. User Story (referencia a P-XXX)
5. Referencias (Design, Schema, Componentes SK)
6. Criterios de Aceptación (checkboxes)
7. Contexto Técnico (archivos, dependencias)
8. Edge Cases
9. Tests Requeridos
10. Out of Scope
11. Bitácora (vacía inicialmente)

---

## 7. Priorización

| Priority | Significado | Criterio |
|----------|-------------|----------|
| **P0** | Blocker | Sin esto no funciona nada más |
| **P1** | MVP Critical | Requerido para primera entrega |
| **P2** | Important | Segunda iteración |
| **P3** | Nice-to-have | Cuando haya tiempo |

**Orden de implementación:**
1. P0 de todos los epics primero
2. Luego P1 por epic (respetando dependencias)
3. Las dependencias se declaran en cada issue

---

## 8. ADR Issues (para decisiones pendientes)

**Cuando hay OQ High impact o decisión técnica pendiente:**

1. Crear issue `ADR-XXX: Decidir [tema]`
2. Marcar issues afectados con `> **Blocked By:** ADR-XXX`
3. En ADR incluir: contexto, opciones A/B, pros/cons, placeholder para decisión

**Triggers para ADR issue:**
| Trigger | Ejemplo |
|---------|---------|
| Infra tradeoff | Cache strategy, edge functions |
| API contract | Webhooks, retries, idempotencia |
| Modelado complejo | Multi-tenant, soft-delete, versioning |
| UI architecture | Offline-first, realtime, wizard state |

**Formato en issue afectado:**
```markdown
> **Blocked By:** ADR-001
```

---

## 9. Slicing Rules (issues ejecutables)

**Regla:** Un issue debe ser *testable* y *mergeable* de forma independiente.

### Heurística de tamaño

| Size | Descripción | Target |
|------|-------------|--------|
| ✅ S-M | Ideal: 0.5-1 día | Preferir siempre |
| ⚠️ L | Complejo pero necesario | Si no se puede partir |
| ❌ XL | Muy grande | Dividir en 2-4 issues |

### Cómo partir una US en issues

**Ejemplo típico (MVP):**
1. **UI skeleton** + validación básica (pantalla y estados) → `PREFIX-001`
2. **Server actions** / API contract → `PREFIX-002`
3. **Persistencia** / data model touch → `PREFIX-003`
4. **Tests** (unit/integration/e2e según criticidad) → `PREFIX-004`
5. **Empty states** / error handling → `PREFIX-005`

### Anti-patrones de slicing

| ❌ Evitar | ✅ Preferir |
|-----------|-------------|
| "Implementar toda la feature X" | Partir por capa/concern |
| Issues sin AC verificable | Cada issue con checkboxes |
| Issues que requieren 3 decisiones | Primero ADR-*, luego implementación |

---

## 10. Effort Heuristics

| Effort | Indicador | Ejemplo |
|--------|-----------|---------|
| **XS** | Config/doc mínima, 1 archivo | Agregar env var |
| **S** | UI pequeña o action simple | Form básico |
| **M** | UI + action + validaciones | CRUD completo |
| **L** | Varios archivos + tests | Feature con flujo |
| **XL** | Integración externa o refactor | **Preferir split** |

---

## 11. Estructura de Epic

```markdown
# EPIC-{NAME}: {Título}

> **Milestone:** {version}
> **Status:** 📋 Planning | 🚧 In Progress | ✅ Done
> **Issues:** {N} total ({M} done)

## Objetivo

{Descripción del epic}

## Issues

| ID | Título | Priority | Status |
|----|--------|----------|--------|
| {PREFIX}-001 | ... | P0 | 📋 |

## Dependencias

- Requiere: [EPIC-XXX]
- Bloquea: [EPIC-YYY]

## Scope

**Incluido:**
- ...

**Excluido:**
- ...
```

---

## 10. Reglas Duras

**SIEMPRE:**
1. Verificar que 02 y 06 existen
2. Seguir formato de título: `# PREFIX-NUM: Título`
3. Incluir metadata block compatible con update-board
4. Cross-reference P/US/SCR/FLW/CMP-XXX
5. Declarar dependencias entre issues
6. Agrupar issues en epics
7. Ubicar en `docs/backlog/{version}/issues/`

**NUNCA:**
1. Inventar features no documentados en 02 o 06
2. Crear issues sin metadata block
3. Ignorar formato de título (rompe BOARD.md)
4. Crear issues "umbrella" demasiado grandes (max 1 día)
5. Omitir acceptance criteria

---

## 11. Handoff

Al completar:

```markdown
## ✅ Backlog Generado

**Proyecto:** [nombre]
**Milestone:** [version]
**Epics:** [N] epics creados
**Issues:** [M] issues totales

**Distribución por prioridad:**
- P0: [X]
- P1: [Y]
- P2: [Z]

**Artefactos:**
- `docs/backlog/{version}/README.md`
- `docs/backlog/{version}/epics/*.md`
- `docs/backlog/{version}/issues/*.md`

**Próximo paso:** 
```bash
pnpm update-board  # Generar BOARD.md
/implement         # Comenzar desarrollo
```
```

---

## 12. Flujo Completo

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

## 🔗 Colaboración

| Con | Cuándo | Acción |
|-----|--------|--------|
| **design** | Input para backlog | Recibir handoff de 06_DESIGN |
| **implement** | Issues listos | Handoff a `/implement` |
| **architect** | Decisión pendiente | Crear ADR-XXX issue |

---

_TimeKast Factory — Backlog Expert Skill_
