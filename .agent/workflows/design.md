---
description: Design workflow - generate design specification from docs
---

# /design — Design Specification

> **Flujo:** Bootstrap (Fase 3 — Diseño)
> **Anterior:** `/docs`
> **Siguiente:** `/backlog`
> **Propósito:** Generar especificación de diseño: pantallas, flujos, componentes.

---

## Invocación

```bash
/design           # Genera 07_DESIGN.md completo
/design validate  # Solo valida prerrequisitos
/design refresh   # Regenera desde docs actualizados
```

---

## 🌳 Árbol de Decisión

```
¿Tienes docs centrales completos?
│
├─► SÍ (01_FEATURE_MAP.md y 03_USER_STORIES.md existen)
│   │
│   ├─► Discovery Brief §3 y §7 ✅ → Consultar Feature Map → Generar design
│   │
│   └─► §7 (UI/UX) está 🟡 → Generar con OQ + Architect gating
│   │
│   └─► §3 o §7 están 🔴 → STOP (completar discovery)
│
└─► NO
    └─► ❌ "Ejecuta /docs primero"
```

---

## Phase 0: Design Mode

**Primero verificar si hay design:**

// turbo

```bash
ls docs/planning/07_DESIGN.md 2>/dev/null && echo "✅ Design existe" || echo "❌ No hay design"
```

**Si NO existe design:**

> No hay Design doc. Generando nuevo...
> → Saltar a Phase 1

**Si SÍ existe design:**

```markdown
## 🎨 Design Mode

| #   | Modo            | Descripción                     |
| --- | --------------- | ------------------------------- |
| 1   | **profundizar** | Mejorar design con más feedback |
| 2   | **revisar**     | Ver design actual sin modificar |
| 3   | **regenerar**   | Descartar y generar de cero     |

**¿Qué quieres hacer?** (1-3)

> 💡 Puedes dar feedback: "profundizar en la arquitectura de auth"
```

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
cat ./.agent/skills/roles/design/SKILL.md
```

// turbo

```bash
cat ./.agent/skills/domains/ui/SKILL.md | head -100
```

---

## Phase 2: Verify Prerequisites

// turbo

```bash
ls -la ./docs/planning/0[0-2]_*.md 2>/dev/null
```

**Archivos requeridos:**

| Archivo                                  | Estado                       |
| ---------------------------------------- | ---------------------------- |
| `docs/planning/00_DISCOVERY_BRIEFING.md` | ✅ Requerido (§3, §7)        |
| `docs/planning/01_USER_PERSONAS.md`      | ✅ Requerido                 |
| `docs/planning/02_USER_STORIES.md`       | ✅ Requerido                 |
| `docs/planning/03_BUSINESS_RULES.md`     | ⚪ Opcional (para RBAC)      |
| `docs/planning/04_DATA_MODEL.md`         | ⚪ Opcional (para data reqs) |

**Si faltan prerequisitos:**

```markdown
⚠️ **Docs incompletos — No puedo generar Design**

**Faltante:**

- [archivo] → no existe

**Acción:** Ejecutar `/docs` primero.
```

---

## Phase 3: Load Discovery Brief

// turbo

```bash
cat ./docs/planning/00_DISCOVERY_BRIEFING.md
```

**Verificar Coverage Map:**

- §3 (Features Core) debe estar ✅ o 🟡
- §7 (UI/UX) debe estar ✅ o 🟡
- Si hay 🔴 en §3 o §7 → STOP

---

## Phase 4: Load Docs

// turbo

```bash
cat ./docs/planning/01_USER_PERSONAS.md
```

// turbo

```bash
cat ./docs/planning/02_USER_STORIES.md
```

// turbo

```bash
cat ./docs/planning/03_BUSINESS_RULES.md 2>/dev/null || echo "03 not found (optional)"
```

// turbo

```bash
cat ./docs/planning/04_DATA_MODEL.md 2>/dev/null || echo "04 not found (optional)"
```

**Extraer:**

- IDs de Personas (P-XXX) para accesos
- IDs de Stories (US-XXX) para cross-refs
- IDs de Rules (BR-XXX) para RBAC
- IDs de Entities (E-XXX) para data requirements

---

## Phase 5: Load Template

// turbo

```bash
cat ./.agent/skills/roles/design/06_DESIGN.template.md
```

---

## Phase 6: Generate Design

**6.0 Verificar modo (refresh vs generate):**

```bash
# Si archivo existe, estamos en modo REFRESH
if [ -f "./docs/planning/06_DESIGN.md" ]; then
  echo "⚠️ Modo REFRESH: preservar IDs SCR/FLW/CMP/DD existentes"
else
  echo "✅ Modo GENERATE: crear desde template"
fi
```

**Regla de refresh:**

- Si 06_DESIGN.md ya existe → preservar IDs asignados
- Solo agregar/modificar contenido, no reordenar
- Nuevos items reciben siguiente ID disponible

**6.1 Crear archivo (solo si no existe):**

```bash
mkdir -p ./docs/planning
[ ! -f ./docs/planning/06_DESIGN.md ] && cp ./.agent/skills/roles/design/06_DESIGN.template.md ./docs/planning/06_DESIGN.md
```

**6.2 Completar secciones:**

| Sección            | De dónde              | IDs                 |
| ------------------ | --------------------- | ------------------- |
| Mapa de Pantallas  | §3 Features → URLs    | SCR-001...          |
| Navegación         | §2 Roles → permisos   | Cross-ref P-XXX     |
| Flujos Principales | §3 → Mermaid          | FLW-001...          |
| Componentes        | ui/ skill referencia  | CMP-001... (nuevos) |
| Data Requirements  | §4 Data Model         | Cross-ref E-XXX     |
| Wireframes         | Opcional              | ASCII art           |
| Decisiones         | Opciones consideradas | DD-001...           |

**6.3 Cross-reference IDs:**

| En Design            | Referencia a                |
| -------------------- | --------------------------- |
| `Acceso: P-001`      | Persona de 01_USER_PERSONAS |
| `Implementa: US-003` | Story de 02_USER_STORIES    |
| `Valida: BR-012`     | Rule de 03_BUSINESS_RULES   |
| `Data: E-001`        | Entity de 04_DATA_MODEL     |

**6.4 Mínimos obligatorios:**

- [ ] TODAS las pantallas del MVP mapeadas (SCR-XXX)
- [ ] Mínimo 3 flujos con Mermaid (FLW-XXX)
- [ ] Estados por pantalla (loading, empty, error, data)
- [ ] Componentes SK identificados
- [ ] Componentes nuevos listados (CMP-XXX)

---

## Phase 7: Architect Gating

**Invocar `/consult-architect` si encuentras:**

| Situación            | Impacto                      |
| -------------------- | ---------------------------- |
| Offline-first UI     | Cache strategy, sync         |
| Realtime features    | WebSockets vs polling        |
| Complex state        | Global state patterns        |
| Performance-critical | Virtualization, lazy loading |
| Multi-step wizards   | State persistence            |

**Formato:**

```markdown
🏛️ **Consulta Architect necesaria**

**Pantalla/Flujo:** [SCR/FLW-XXX]
**Decisión:** [qué decidir]
**Opciones:** A/B con tradeoffs
```

---

## 🛑 CHECKPOINT: Pre-Design Generation

> **MANDATORY STOP — USAR notify_user TOOL**
>
> El agente DEBE llamar a `notify_user` con:
>
> - `BlockedOnUser: true`
> - `Message`: Resumen de diseño identificado
>
> **NO EJECUTAR MÁS HERRAMIENTAS SIN RESPUESTA DEL USUARIO.**

**Resumen para usuario:**

- Docs cargados: 01, 02 ✅
- Pantallas identificadas: SCR-001 → SCR-XXX ([N] total)
- Flujos identificados: FLW-001 → FLW-XXX ([M] total)
- Componentes nuevos: CMP-001 → CMP-XXX ([K] total)
- Architect consultations: [si hubo]

**Opciones:**

| #   | Opción       | Acción                       |
| --- | ------------ | ---------------------------- |
| 1   | **generar**  | Crear 07_DESIGN.md           |
| 2   | **revisar**  | Ver detalle antes de generar |
| 3   | **cancelar** | Salir                        |

**¿Qué quieres hacer?** (1-3)

**ACTION:** Call `notify_user` NOW with `BlockedOnUser=true`.

---

## Phase 8: Add Open Questions & Assumptions

**Cada sección debe considerar:**

```markdown
## Open Questions

| #     | Pregunta         | Impacto           | Afecta      | Owner             |
| ----- | ---------------- | ----------------- | ----------- | ----------------- |
| OQ-01 | [pregunta de UI] | **Alto**/Med/Bajo | SCR/FLW-XXX | Cliente/Architect |

## Assumptions

| #    | Supuesto             | Si es incorrecto         |
| ---- | -------------------- | ------------------------ |
| A-01 | [asunción de diseño] | Impacto: [qué cambiaría] |
```

**Regla:**

> Si algo no está claro en los docs de input → Open Question, no inventar pantallas.

---

## Phase 9: Validation

// turbo

```bash
ls -la ./docs/planning/06_DESIGN.md
```

**Validación automática (grep checks):**

// turbo

```bash
# Verificar SCR IDs
grep -qE "SCR-[0-9]{3}" ./docs/planning/06_DESIGN.md && echo "✅ Screens present" || echo "❌ Missing SCR IDs"
```

// turbo

```bash
# Verificar FLW IDs y Mermaid
grep -qE "FLW-[0-9]{3}" ./docs/planning/06_DESIGN.md && echo "✅ Flows present" || echo "❌ Missing FLW IDs"
grep -q "\`\`\`mermaid" ./docs/planning/06_DESIGN.md && echo "✅ Mermaid present" || echo "❌ Missing Mermaid diagrams"
```

// turbo

```bash
# Verificar OQ y Assumptions
grep -q "## Open Questions" ./docs/planning/06_DESIGN.md && echo "✅ Open Questions" || echo "❌ Missing OQ"
grep -q "## Assumptions" ./docs/planning/06_DESIGN.md && echo "✅ Assumptions" || echo "❌ Missing Assumptions"
```

**Checklist:**

| Item               | Verificar                             |
| ------------------ | ------------------------------------- |
| Pantallas          | Todas con IDs SCR-XXX                 |
| Flujos             | Mínimo 3 con FLW-XXX y Mermaid        |
| Componentes SK     | Identificados por pantalla            |
| Componentes nuevos | CMP-XXX con prioridad                 |
| Data requirements  | Server actions definidos              |
| Estados            | loading/empty/error/data por pantalla |
| Cross-refs         | P/US/BR/E-XXX presentes               |
| OQ/Assumptions     | Secciones completas                   |

---

## Phase 10: Handoff

```markdown
## ✅ Design Completado

**Proyecto:** [nombre]
**Pantallas:** SCR-001 → SCR-XXX ([N] total)
**Flujos:** FLW-001 → FLW-XXX ([M] total)
**Componentes nuevos:** CMP-001 → CMP-XXX ([K] total)

**Artefacto:**

- `docs/planning/06_DESIGN.md`

**Open Questions:** [X pendientes] ([Y high impact])
**Assumptions:** [Z declarados]
**Architect Consultations:** [N si hubo]

---

## 🚀 Próximo Paso

**Flujo:** `/discovery` ✅ → `/docs` ✅ → `/design` ✅ → **`/backlog`** → `/implement` → `/audit`

Ejecutar:
```

/backlog

```

Este comando generará issues a partir de la documentación y diseño creados.
```

---

## Gates/Escalation

| Trigger                     | Acción                             |
| --------------------------- | ---------------------------------- |
| Decisión de arquitectura UI | → `/consult-architect`             |
| Componente nuevo complejo   | → Verificar design system primero  |
| Accesibilidad no clara      | → Consultar WCAG antes de proponer |

---

## Stop Conditions

| Condición                     | Severidad | Acción                                 |
| ----------------------------- | --------- | -------------------------------------- |
| 01_USER_PERSONAS.md no existe | P0        | 🛑 STOP — `/docs` primero              |
| 02_USER_STORIES.md no existe  | P0        | 🛑 STOP — `/docs` primero              |
| §3 o §7 en brief 🔴           | P0        | 🛑 STOP — Completar discovery          |
| Offline-first sin decisión    | P1        | 🛑 STOP — `/consult-architect` primero |
| Realtime sin decisión         | P1        | 🛑 STOP — `/consult-architect` primero |

---

## Flujo Completo

```
/start → /discovery → /docs → /design → /backlog → /implement → /audit
                                 ↑
                             YOU ARE HERE
```

**SSOT Chain:**

```
Discovery Brief → docs (01-05) → 06_DESIGN → issues → code
```

---

## Reglas del Agente

**SIEMPRE:**

1. Verificar que 01 y 02 existen antes de empezar
2. Mapear TODAS las pantallas del MVP (SCR-XXX)
3. Documentar mínimo 3 flujos con Mermaid (FLW-XXX)
4. Identificar componentes SK para cada pantalla
5. Cross-reference P/US/BR/E-XXX
6. Definir estados por pantalla
7. Declarar Open Questions y Assumptions

**NUNCA:**

1. Inventar pantallas no derivadas de Stories
2. Diseñar sin docs 01-02
3. Ignorar componentes del Starter Kit
4. Saltar data requirements
5. Omitir estados de error

---

_TimeKast Factory — Design Workflow_
