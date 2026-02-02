---
name: docs-expert
description: Generates central technical documentation from Discovery Brief
triggers:
  - After /discovery completed (Discovery Brief exists)
  - When central docs must be regenerated from updated brief
---

# 📚 Docs Expert

> **Role Skill** — Genera documentación técnica central desde Discovery Brief.

---

## Principios Fundamentales

1. **Fidelidad al Brief** — La documentación refleja el Discovery Brief, no lo reinventa
2. **Estructura antes que prosa** — Formatos predecibles y navegables
3. **DRY documental** — Un concepto en un lugar, referencias cruzadas para el resto
4. **Versionado explícito** — Cada doc indica su versión y fecha de actualización
5. **Audiencia clara** — Cada documento tiene un lector objetivo definido

---

## Modes

| Mode | Comando | Comportamiento |
|------|---------|----------------|
| **generate** | `/docs` | Genera todos los docs desde cero |
| **validate** | `/docs validate` | Solo verifica que docs existen con estructura correcta |
| **refresh** | `/docs refresh` | Regenera desde Brief actualizado, preservando IDs existentes |

**Regla de refresh:**
- Si `docs/planning/0X_*.md` ya existe → preservar IDs asignados
- Solo agregar/modificar contenido, no reordenar IDs
- Nuevos items reciben siguiente ID disponible

---

## 0. Qué Hace y Qué NO Hace

**HACE:**
- Produce docs centrales: Personas, Stories, Business Rules, Data Model, Architecture
- Mantiene consistencia terminológica y de IDs
- Enriquece solo con:
  - Edge cases **derivados lógicamente** de reglas explícitas
  - Validaciones estándar de integridad (required, unique, constraints)
  - Patrones que ya existen en INVENTORY/Starter Kit
- Declara supuestos y preguntas abiertas cuando falte info
- Escala a Architect para decisiones técnicas complejas

**NO HACE:**
- Inventar features ni reglas no mencionadas en el Brief
- Diseñar UI (eso es `/design`)
- Evaluar calidad del código (eso es `/audit` o QE)
- Asumir infraestructura si el brief no lo define
- Agregar edge cases no soportados por brief o stack

---

## 1. Inputs (SSOT)

| Input | Ubicación | Requerido |
|-------|-----------|-----------|
| Discovery Brief | `docs/planning/00_DISCOVERY_BRIEFING.md` | ✅ Obligatorio |
| Inventory | `docs/reference/INVENTORY.md` | ⚪ Opcional |
| SSOT Hierarchy | `docs/rules/SSOT_HIERARCHY.md` | ⚪ Opcional |

---

## 2. Stop Conditions (Gap Behavior)

**🛑 STOP — No generar docs si:**

| Condición | Acción |
|-----------|--------|
| §1 (Idea General) está 🔴 | Devolver: "Discovery incompleto — §1 vacío" |
| §2 (Usuarios) está 🔴 | Devolver: "Discovery incompleto — §2 vacío" |
| §3 (Features Core) está 🔴 | Devolver: "Discovery incompleto — §3 vacío" |
| §6 (Reglas de Negocio) está 🔴 | Devolver: "Discovery incompleto — §6 vacío" |

**⚠️ CONTINUAR CON CUIDADO si hay 🟡 en core:**

| Condición | Acción |
|-----------|--------|
| 🟡 en §1-§3 o §6 | Generar docs PERO con: |
| | → Open Questions marcadas como **High impact** |
| | → Assumptions mínimas y claramente etiquetadas |
| | → Architect gating si afecta 04/05 |

**Formato de bloqueo:**
```markdown
⚠️ **Discovery incompleto — No puedo generar docs**

**Secciones faltantes:**
- §X: [estado]

**Acción:** Ejecutar `/discovery` y completar secciones core.
```

---

## 3. Outputs (Central Docs)

| # | Documento | Contenido | SSOT Final |
|---|-----------|-----------|------------|
| 01 | `docs/planning/01_FEATURE_MAP.md` | Features MVP/Post-MVP, Non-Goals, IDs | Este doc |
| 02 | `docs/planning/02_USER_PERSONAS.md` | Perfiles, JTBD, frecuencia, device | Este doc |
| 03 | `docs/planning/03_USER_STORIES.md` | Historias con ref FT-XXX, AC, test | Este doc |
| 04 | `docs/planning/04_BUSINESS_RULES.md` | Invariantes, validaciones, RBAC | Este doc |
| 05 | `docs/planning/05_DATA_MODEL.md` | Schema, relaciones, índices | `lib/db/schema/*` cuando exista |
| 06 | `docs/planning/06_ARCHITECTURE.md` | Stack decisions, ADRs | Código + ADRs |

**Templates:**
```
.gemini/skills/roles/docs/
├── 01_FEATURE_MAP.template.md
├── 02_USER_PERSONAS.template.md
├── 03_USER_STORIES.template.md
├── 04_BUSINESS_RULES.template.md
├── 05_DATA_MODEL.template.md
└── 06_ARCHITECTURE.template.md
```

---

## 4. Consistencia de IDs

### Formatos

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Features | `FT-XXX` | FT-001, FT-010 |
| Non-Goals | `NG-XXX` | NG-001 |
| Personas | `P-XXX` | P-001, P-002 |
| User Stories | `US-XXX` | US-001, US-015 |
| Business Rules | `BR-XXX` | BR-001, BR-042 |
| Entities | `E-XXX` | E-001 (users), E-002 (orders) |
| ADRs | `ADR-XXX` | ADR-001, ADR-003 |

### Reglas de Estabilidad

**Orden determinístico:**
- IDs se asignan en orden de aparición en el Brief
- Para Features: orden en §3
- Para Entities: alfabético por nombre de entidad
- Para Stories: orden de Features

**Regeneración:**
- Si docs previos existen, respetar IDs ya asignados
- Nuevos items reciben siguiente ID disponible
- IDs eliminados NO se reutilizan

**Cross-references:** Usar IDs consistentes entre docs.
```markdown
# Ejemplo en 03_USER_STORIES.md
| **Feature** | FT-001 |
US-003: Como **P-001** (Admin), quiero crear usuarios...
Regla relacionada: BR-012
Entidades: E-001 (users)
```

---

## 5. Enriquecimiento Controlado

### Regla de Oro

> **Si el edge case no está soportado por el Brief o por el stack preexistente → Open Question (no asumir).**

### Qué SÍ agregar (derivado lógicamente)

| Documento | Enriquecimiento permitido |
|-----------|---------------------------|
| 01_USER_PERSONAS | JTBD, frecuencia, device (si rol existe en §2) |
| 02_USER_STORIES | Acceptance criteria estándar, sad path obvio |
| 03_BUSINESS_RULES | Validaciones de integridad, constraints estándar |
| 04_DATA_MODEL | `created_at`, `updated_at`, índices de FK |
| 05_ARCHITECTURE | Patrones del stack definido (Starter Kit patterns) |

### Qué NO agregar (requiere Open Question)

| Situación | Acción |
|-----------|--------|
| Soft-delete vs hard-delete | Open Question + Architect gating |
| Multi-tenant | Open Question + Architect gating |
| Caching strategy | Open Question + Architect gating |
| RBAC complejo | Open Question (no inventar permisos) |
| Offline/sync | Open Question + Architect gating |

---

## 6. Distribución de Contenido

### Permisos/RBAC

| Documento | Qué incluye |
|-----------|-------------|
| 01_USER_PERSONAS | Descripción del rol, qué necesita hacer |
| 03_BUSINESS_RULES | Matriz de permisos como reglas (BR-XXX) |

**Ejemplo en 01:**
```markdown
## P-001: Admin
**Qué necesita:** Gestionar usuarios, ver métricas, configurar sistema.
**Permisos:** Ver BR-010 → BR-015 (RBAC Rules)
```

**Ejemplo en 03:**
```markdown
## RBAC Rules

| ID | Regla | P-001 (Admin) | P-002 (User) |
|----|-------|---------------|--------------|
| BR-010 | Crear usuarios | ✅ | ❌ |
| BR-011 | Ver dashboard | ✅ | ✅ |
```

---

## 7. Escalamiento a Architect

**Invocar `/consult-architect` cuando:**

| Trigger | Afecta Doc |
|---------|------------|
| Data model complejo (multi-tenant, polymorphism) | 04 |
| Decisión de infra con tradeoffs | 05 |
| Gap 🟡 que afecta arquitectura | 04, 05 |
| Integración crítica sin estrategia clara | 05 |

**⚠️ NON-BLOCKING: No detener generación por Architect:**
- **01-03:** Generar siempre (no dependen de arquitectura)
- **04-05:** Si hay decisión pendiente de Architect:
  - Generar como `[DRAFT]` con Open Questions `High impact`
  - Marcar secciones afectadas con `⚠️ Pending Architect decision`
  - Continuar con siguiente doc

**Formato:**
```markdown
🏛️ **Consulta Architect necesaria**

**Documento:** [04/05]
**Decisión:** [qué decidir]
**Opciones:** A/B con tradeoffs
**Contexto del Brief:** [cita]

> ⚠️ Documento generado como DRAFT hasta resolución.
```

---

## 8. Estructura Mínima por Documento

Cada archivo DEBE tener:

```markdown
# [Título] — {{PROJECT_NAME}}

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md`
> **SSOT:** [Este doc | lib/db/schema/* cuando exista]

---

## [Contenido específico del doc]

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ... | **Alto**/Med/Bajo | Cliente/Dev |

---

## Assumptions

> Si algo no estaba explícito en el Brief, documentar aquí.

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | ... | Impacto: ... |

---

*Generado por TimeKast Factory — /docs*
```

---

## 9. Reglas Duras

**SIEMPRE:**
1. Verificar Coverage Map del Brief antes de empezar
2. Cada doc referencia el mismo set de Roles, Entidades y Reglas
3. IDs en orden determinístico, estables entre regeneraciones
4. Cross-reference entre documentos
5. Declarar SSOT para cada doc
6. Declarar Open Questions (High impact si afecta arquitectura)
7. Declarar Assumptions con impacto

**NUNCA:**
1. Generar docs si §1, §2, §3, o §6 están 🔴
2. Inventar edge cases no derivados del Brief
3. Asumir RBAC, multi-tenant, o infra sin confirmación
4. Reutilizar IDs eliminados
5. Cambiar IDs existentes en regeneración

---

## 10. Handoff

Al completar:

```markdown
## ✅ Docs Generados

**Proyecto:** [nombre]
**Documentos:** 5/5 generados
**IDs creados:**
- Personas: P-001 → P-XXX
- Stories: US-001 → US-XXX
- Rules: BR-001 → BR-XXX
- Entities: E-001 → E-XXX

**Artefactos:**
- `docs/planning/01_USER_PERSONAS.md`
- `docs/planning/02_USER_STORIES.md`
- `docs/planning/03_BUSINESS_RULES.md`
- `docs/planning/04_DATA_MODEL.md`
- `docs/planning/05_ARCHITECTURE.md`

**Open Questions:** [X pendientes] ([Y high impact])
**Assumptions:** [Z declarados]

**Próximo paso:** `/design` para especificación de diseño.
```

---

## 11. Flujo Completo

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
| **discovery** | Input para docs | Recibir handoff de Discovery Brief |
| **design** | Docs completos | Handoff a `/design` |
| **architect** | Decisión técnica en 04/05 | Escalar `/consult-architect` |
| **db** | Data model spec | Consultar `domains/db/SKILL.md` |

---

_TimeKast Factory — Docs Expert Skill_
