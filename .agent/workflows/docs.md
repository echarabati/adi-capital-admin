---
description: Docs workflow - generate technical documentation from discovery
---

# /docs — Technical Documentation

> **Flujo:** Bootstrap (Fase 2 — Documentación)
> **Anterior:** `/discovery`
> **Siguiente:** `/design`
> **Propósito:** Generar documentación técnica central rica y consistente.

---

## Invocación

```bash
/docs           # Genera todos los documentos
/docs validate  # Solo valida que existen
/docs refresh   # Regenera desde Brief actualizado
```

---

## 🌳 Árbol de Decisión

```
¿Tienes Discovery Brief completo?
│
├─► SÍ (docs/planning/00_DISCOVERY_BRIEFING.md existe)
│   │
│   ├─► §1, §2, §3, §6 están ✅ → Generar docs
│   │
│   └─► Alguna core está 🔴 → STOP (completar discovery primero)
│
└─► NO
    └─► ❌ "Ejecuta /discovery primero"
```

---

## Phase 0: Docs Mode

**Primero verificar si hay docs:**

// turbo
```bash
ls docs/planning/0[1-6]_*.md 2>/dev/null && echo "✅ Docs existen" || echo "❌ No hay docs"
```

**Si NO existen docs:**
> No hay docs de planning. Generando todos...
→ Saltar a Phase 1

**Si SÍ existen docs:**

```markdown
## 📄 Docs Mode

| # | Modo | Descripción |
|---|------|-------------|
| 1 | **profundizar** | Mejorar doc específico con más feedback |
| 2 | **revisar** | Ver docs actuales sin modificar |
| 3 | **regenerar** | Descartar y generar todos de cero |

**¿Qué quieres hacer?** (1-3)

> 💡 Puedes dar feedback: "profundizar en DATA_MODEL, agregar soft delete"
```

**Si elige "profundizar":**

// turbo
```bash
# Mostrar docs disponibles
echo "| # | Doc | Status |"
echo "|---|-----|--------|"
n=1
for doc in 01_FEATURE_MAP 02_USER_PERSONAS 03_USER_STORIES 04_BUSINESS_RULES 05_DATA_MODEL 06_ARCHITECTURE; do
  if [ -f "docs/planning/${doc}.md" ]; then
    echo "| $n | ${doc} | ✅ Existe |"
  else
    echo "| $n | ${doc} | ❌ No existe |"
  fi
  n=$((n+1))
done
---

## Phase 1: Context Loading

// turbo
```bash
cat ./.agent/rules/AI_RULES.md
```

// turbo
```bash
cat ./.agent/skills/roles/docs/SKILL.md
```

---

## Phase 2: Verify Prerequisites

// turbo
```bash
ls -la ./docs/planning/00_DISCOVERY_BRIEFING.md 2>/dev/null || echo "❌ Discovery Brief not found"
```

**Si no existe:**
```markdown
⚠️ **Discovery Brief no encontrado**
**Acción:** Ejecutar `/discovery` primero.
```

---

## Phase 3: Load Discovery Brief

// turbo
```bash
cat ./docs/planning/00_DISCOVERY_BRIEFING.md
```

---

## Phase 4: Validate Coverage Map

Verificar que §1, §2, §3, §6 están ✅ en el Brief. Si alguna está 🔴 → STOP (ver Stop Conditions al final).

---

## Phase 5: Load Templates

Templates están con el skill:

// turbo
```bash
ls -la ./.agent/skills/roles/docs/*.template.md
```

---

## 🛑 CHECKPOINT: Pre-Generation

> **MANDATORY STOP — USAR notify_user TOOL**
>
> El agente DEBE llamar a `notify_user` con:
> - `BlockedOnUser: true`
> - `Message`: Resumen de prerrequisitos + plan
>
> **NO EJECUTAR MÁS HERRAMIENTAS SIN RESPUESTA DEL USUARIO.**

**Resumen para usuario:**
- Discovery Brief: Cargado ✅
- Coverage Map: §1,§2,§3,§6 = ✅
- Templates: Listos ✅
- Docs a generar: 01-06

**Opciones:**

| # | Opción | Acción |
|---|--------|--------|
| 1 | **generar** | Crear todos los docs |
| 2 | **solo X** | Generar doc específico (ej: "solo 04") |
| 3 | **cancelar** | Salir |

**¿Qué quieres hacer?** (1-3)

**ACTION:** Call `notify_user` NOW with `BlockedOnUser=true`.

---

## Phase 6: Generate Documents

**IMPORTANTE:** Generar **TODOS** los documentos obligatorios. Si te acercas al límite de respuesta, continúa automáticamente SIN esperar input del usuario.

### Catálogo de Documentos

| # | Documento | Contenido | SSOT Final |
|---|-----------|-----------|------------|
| 01 | `01_FEATURE_MAP.md` | Features MVP/Post-MVP, Non-Goals | Este doc |
| 02 | `02_USER_PERSONAS.md` | Perfiles, JTBD, frecuencia | Este doc |
| 03 | `03_USER_STORIES.md` | Historias con FT-XXX, AC, test | Este doc |
| 04 | `04_BUSINESS_RULES.md` | Invariantes, RBAC, validaciones | Este doc |
| 05 | `05_DATA_MODEL.md` | Schema Drizzle, relaciones | `lib/db/schema/*` |
| 06 | `06_ARCHITECTURE.md` | Stack decisions, ADRs | Código + ADRs |

### Proceso por documento:

**6.0 Verificar modo (refresh vs generate):**
```bash
# Si archivos existen, estamos en modo REFRESH
if [ -f "./docs/planning/01_FEATURE_MAP.md" ]; then
  echo "⚠️ Modo REFRESH: preservar IDs existentes"
else
  echo "✅ Modo GENERATE: crear desde template"
fi
```

**Regla de refresh:**
- Si docs ya existen → preservar IDs asignados
- Solo agregar/modificar contenido, no reordenar
- Nuevos items reciben siguiente ID disponible

**6.1 Crear archivo desde template (solo si no existe):**
```bash
mkdir -p ./docs/planning
[ ! -f ./docs/planning/01_FEATURE_MAP.md ] && cp ./.agent/skills/roles/docs/01_FEATURE_MAP.template.md ./docs/planning/01_FEATURE_MAP.md
[ ! -f ./docs/planning/02_USER_PERSONAS.md ] && cp ./.agent/skills/roles/docs/02_USER_PERSONAS.template.md ./docs/planning/02_USER_PERSONAS.md
[ ! -f ./docs/planning/03_USER_STORIES.md ] && cp ./.agent/skills/roles/docs/03_USER_STORIES.template.md ./docs/planning/03_USER_STORIES.md
[ ! -f ./docs/planning/04_BUSINESS_RULES.md ] && cp ./.agent/skills/roles/docs/04_BUSINESS_RULES.template.md ./docs/planning/04_BUSINESS_RULES.md
[ ! -f ./docs/planning/05_DATA_MODEL.md ] && cp ./.agent/skills/roles/docs/05_DATA_MODEL.template.md ./docs/planning/05_DATA_MODEL.md
[ ! -f ./docs/planning/06_ARCHITECTURE.md ] && cp ./.agent/skills/roles/docs/06_ARCHITECTURE.template.md ./docs/planning/06_ARCHITECTURE.md
```

**⚠️ Regla de Enriquecimiento (REGLA DURA):**
> Solo agregar edge cases/validaciones **derivados lógicamente** del Brief o stack.
> Si el edge case no está soportado → Open Question, no asumir.

**6.2 Enriquecer contenido:**

| Doc | Del Brief | Agregar (derivado) |
|-----|-----------|-------------------|
| 01 | §2 Usuarios | JTBD, frecuencia, device, link a RBAC en 03 |
| 02 | §3 Features | AC estándar, sad path obvio, test scenarios |
| 03 | §6 Reglas | Validaciones estándar, RBAC matrix, state machines |
| 04 | §4 Datos | timestamps, FK indexes, constraints estándar |
| 05 | §8 Infra | Patrones del Starter Kit, mini-ADRs |

**6.3 Asignar IDs consistentes:**

| Tipo | Formato | Orden |
|------|---------|-------|
| Personas | P-001, P-002... | Orden de aparición en §2 |
| Stories | US-001, US-002... | Orden de Features en §3 |
| Rules | BR-001, BR-002... | Orden en §6 |
| Entities | E-001, E-002... | Alfabético por nombre |
| ADRs | ADR-001... | Orden de decisión |

**6.4 Cross-reference entre docs:**
```markdown
# Ejemplo en 02_USER_STORIES.md
US-003: Como **P-001** (Admin), quiero crear usuarios...
Regla relacionada: BR-012
Entidades: E-001 (users)
```

---

## Phase 7: Architect Gating

**Invocar `/consult-architect` si encuentras:**

| Situación | Afecta |
|-----------|--------|
| Data model complejo (multi-tenant, polymorphism, versioning) | 04 |
| Decisión de infra con tradeoffs (cache, edge functions) | 05 |
| Gap 🟡 que afecta arquitectura | 04, 05 |
| Integración crítica sin estrategia clara | 05 |
| Soft-delete vs hard-delete sin decisión | 04 |

**Formato de escalamiento:**
```markdown
🏛️ **Consulta Architect necesaria**

**Documento:** [04/05]
**Decisión:** [qué decidir]
**Opciones:**
A) [opción + tradeoffs]
B) [opción + tradeoffs]

**Contexto del Brief:** [cita relevante]
```

---

## Phase 8: Add Open Questions & Assumptions

**Cada documento DEBE tener al final:**

```markdown
---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | [pregunta] | **Alto**/Med/Bajo | Cliente/Dev |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | [asunción] | Impacto: [qué cambiaría] |
```

**Regla de oro:**
> Si algo no está soportado por el Brief o stack → Open Question, no asumir.

---

## Phase 9: Validation

// turbo
```bash
ls -la ./docs/planning/0[1-5]_*.md
```

**Validación automática (grep checks):**

// turbo
```bash
# Verificar que todos tienen Open Questions
for f in ./docs/planning/0[1-5]_*.md; do grep -q "## Open Questions" "$f" && echo "✅ $f: OQ" || echo "❌ $f: falta OQ"; done
```

// turbo
```bash
# Verificar que tienen al menos un ID válido
for f in ./docs/planning/0[1-5]_*.md; do grep -qE "(P|US|BR|E)-[0-9]{3}" "$f" && echo "✅ $f: IDs" || echo "❌ $f: sin IDs"; done
```

**Checklist:**

| Doc | Verificar |
|-----|-----------|
| 01 | Personas con IDs (P-XXX), JTBD, link a RBAC |
| 02 | Stories con IDs (US-XXX), AC, cross-refs |
| 03 | Rules con IDs (BR-XXX), RBAC matrix |
| 04 | Entities con IDs (E-XXX), schema Drizzle, SSOT declaration |
| 05 | Stack decisions, ADRs si aplica, SSOT declaration |
| ALL | Open Questions section, Assumptions section |

---

## Phase 10: Handoff

```markdown
## ✅ Docs Generados

**Proyecto:** [nombre]
**Documentos:** 5/5 generados

**IDs creados:**
- Personas: P-001 → P-XXX
- Stories: US-001 → US-XXX
- Rules: BR-001 → BR-XXX
- Entities: E-001 → E-XXX
- ADRs: ADR-001 → ADR-XXX (si aplica)

**Artefactos:**
- `docs/planning/01_FEATURE_MAP.md`
- `docs/planning/02_USER_PERSONAS.md`
- `docs/planning/03_USER_STORIES.md`
- `docs/planning/04_BUSINESS_RULES.md`
- `docs/planning/05_DATA_MODEL.md`
- `docs/planning/06_ARCHITECTURE.md`

**Open Questions:** [X pendientes] ([Y high impact])
**Assumptions:** [Z declarados]
**Architect Consultations:** [N si hubo]

---

## 🚀 Próximo Paso

**Flujo:** `/discovery` ✅ → `/docs` ✅ → **`/design`** → `/backlog` → `/implement` → `/audit`

Ejecutar:
```
/design
```

Este comando generará la especificación de diseño basada en los docs creados.
```

---

## Gates/Escalation

| Trigger | Acción |
|---------|--------|
| Contradicción en Business Rules | → `/consult-architect` |
| Data Model ambiguo | → Clarificar con user antes de continuar |
| Cambio significativo de scope | → Actualizar Discovery Brief |

---

## Stop Conditions

| Condición | Severidad | Acción |
|-----------|-----------|--------|
| Discovery Brief no existe | P0 | 🛑 STOP — `/discovery` primero |
| §1 (Idea) 🔴 | P0 | 🛑 STOP — Completar discovery |
| §2 (Usuarios) 🔴 | P0 | 🛑 STOP — Completar discovery |
| §3 (Features) 🔴 | P0 | 🛑 STOP — Completar discovery |
| §6 (Reglas) 🔴 | P0 | 🛑 STOP — Completar discovery |
| Architect gating en 04/05 | P1 | 🛑 STOP — `/consult-architect` primero |

---

## Flujo Completo

```
/start → /discovery → /docs → /design → /backlog → /implement → /audit
                        ↑
                    YOU ARE HERE
```

**SSOT Chain:**
```
Discovery Brief → docs (01-05) → design (06) → code (cuando exista)
```

---

## Reglas del Agente

1. ✅ Generar TODOS los docs (01-05) sin preguntar
2. ✅ Mantener IDs consistentes entre documentos
3. ✅ Cross-reference entre docs
4. ✅ Declarar Open Questions y Assumptions en CADA doc
5. ✅ Escalar a Architect cuando hay tradeoffs
6. ❌ NO inventar features no mencionados
7. ❌ NO asumir RBAC, multi-tenant, o infra sin confirmación
8. ❌ NO generar si §1, §2, §3, o §6 están 🔴

---

## Estructura de Headers

Todos los documentos DEBEN usar esta estructura:

```markdown
# [Título] — {{PROJECT_NAME}}

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md`
> **SSOT:** [Este doc | lib/db/schema/* cuando exista]

---

## [Contenido]

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ... | Alto/Med/Bajo | Cliente/Dev |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | ... | Impacto: ... |

---

*Generado por TimeKast Factory — /docs*
```

---

_TimeKast Factory — Docs Workflow_
