---
name: design-expert
description: Creates design specifications from Discovery Brief and Docs
triggers:
  - After /docs completed (central docs exist)
  - UI/UX design decisions needed
  - Screen mapping required
---

# 🎨 Design Expert

> **Role Skill** — Transforma Discovery Brief + Docs en especificación de diseño.

---

## Principios Fundamentales

1. **Mobile-first** — Diseñar para móvil primero, escalar hacia arriba
2. **Tokens sobre valores** — Usar design tokens del sistema, nunca hardcodear
3. **Componentes atómicos** — Diseños descompuestos en componentes reutilizables
4. **Accesibilidad inherente** — WCAG AA desde el diseño, no como fix posterior
5. **Consistencia visual** — Seguir patrones existentes del design system

---

## Modes

| Mode | Comando | Comportamiento |
|------|---------|----------------|
| **generate** | `/design` | Genera 09_DESIGN.md desde cero |
| **validate** | `/design validate` | Solo verifica prerrequisitos y estructura |
| **refresh** | `/design refresh` | Regenera desde docs actualizados, preservando IDs |

**Regla de refresh:**
- Si `docs/planning/09_DESIGN.md` ya existe → preservar IDs `SCR/FLW/CMP/DD`
- Solo agregar/modificar contenido, no reordenar IDs
- Nuevos items reciben siguiente ID disponible
- IDs eliminados NO se reutilizan

---

## 0. Qué Hace y Qué NO Hace

**HACE:**
- Mapea TODAS las pantallas del MVP con URLs y accesos
- Documenta flujos de usuario principales (mínimo 3)
- Identifica componentes del Starter Kit a usar por pantalla
- Define componentes nuevos necesarios con prioridad
- Especifica data requirements (server actions, mutations)
- Crea wireframes ASCII cuando aclara
- Cross-referencia IDs de Personas, Stories, Rules

**NO HACE:**
- Discovery (eso es Discovery Expert)
- Documentación técnica (eso es Docs Expert)
- Diseñar arquitectura backend (eso es Architect)
- Evaluar calidad (eso es QE)
- Crear mockups visuales de alta fidelidad
- Implementar código (eso es /implement)

---

## 1. Inputs (SSOT)

| Input | Ubicación | Requerido |
|-------|-----------|-----------|
| Discovery Brief | `docs/planning/00_DISCOVERY_BRIEFING.md` | ✅ (§3, §7) |
| User Personas | `docs/planning/01_USER_PERSONAS.md` | ✅ |
| User Stories | `docs/planning/02_USER_STORIES.md` | ✅ |
| Business Rules | `docs/planning/03_BUSINESS_RULES.md` | ⚪ Opcional |
| Data Model | `docs/planning/04_DATA_MODEL.md` | ⚪ Opcional |
| Domain UI Skill | `.gemini/skills/domains/ui/SKILL.md` | ⚪ Referencia |

---

## 2. Stop Conditions

**🛑 STOP — No generar Design si:**

| Condición | Acción |
|-----------|--------|
| Discovery Brief §3 (Features) está 🔴 | Volver a `/discovery` |
| Discovery Brief §7 (UI/UX) está 🔴 | Volver a `/discovery` |
| 01_USER_PERSONAS.md no existe | Ejecutar `/docs` primero |
| 02_USER_STORIES.md no existe | Ejecutar `/docs` primero |

**Formato de bloqueo:**
```markdown
⚠️ **No puedo generar Design**

**Faltante:**
- [doc/sección] → [estado]

**Acción:** Ejecutar [/discovery | /docs] primero.
```

**⚠️ CONTINUAR CON CUIDADO si:**
- §7 está 🟡 → Generar con Open Questions + Architect gating para decisiones de UI

---

## 3. Output

**Archivo a generar:**
```
docs/planning/09_DESIGN.md
```

**Template:**
```
.gemini/skills/roles/design/09_DESIGN.template.md
```

**SSOT:**
```
Discovery Brief → docs (01-08) → 09_DESIGN → code (cuando exista)
```

---

## 4. Consistencia de IDs

### Formatos (nuevos para Design)

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Pantallas | `SCR-XXX` | SCR-001, SCR-015 |
| Flujos | `FLW-XXX` | FLW-001, FLW-003 |
| Componentes nuevos | `CMP-XXX` | CMP-001, CMP-008 |

### Cross-references (de Docs)

| Tipo | Formato | Uso en Design |
|------|---------|---------------|
| Personas | P-XXX | "Acceso: P-001 (Admin)" |
| Stories | US-XXX | "Implementa: US-003, US-004" |
| Rules | BR-XXX | "Valida: BR-012" |
| Entities | E-XXX | "Data: E-001 (users)" |

### Reglas de Estabilidad

- IDs en orden de aparición en el flujo de usuario
- Pantallas: orden de navegación lógica
- Flujos: orden de criticidad (primary → secondary)
- Si regenera: respetar IDs existentes

---

## 5. Secciones del Design

| # | Sección | Contenido | IDs |
|---|---------|-----------|-----|
| 1 | Mapa de Pantallas | URL, propósito, acceso por rol | SCR-XXX |
| 2 | Navegación/Sidebar | Estructura, ítems, permisos | - |
| 3 | Flujos Principales | Mermaid diagrams, estados, errors | FLW-XXX |
| 4 | Componentes por Pantalla | SK usados + nuevos | CMP-XXX |
| 5 | Data Requirements | Server actions, mutations, cache | - |
| 6 | Wireframes | ASCII art (opcional) | - |
| 7 | Decisiones de Diseño | Opciones + elegida + razón | DD-XXX |
| 8 | Open Questions | Dudas de UI | OQ-XXX |
| 9 | Assumptions | Supuestos de diseño | A-XXX |

---

## 6. Componentes del Starter Kit

**Conocer y referenciar (del domain skill ui/):**

| Componente | Uso Típico |
|------------|------------|
| `DataTable` | Listas con paginación, sorting, filters |
| `EmptyState` | Estados vacíos con CTA |
| `PageHeader` | Headers de página con acciones |
| `Card` | Contenedores de contenido |
| `Dialog` / `Sheet` | Modales y sidebars |
| `Form` / `Input` / `Select` | Formularios |
| `Button` | Acciones primarias/secundarias |
| `Avatar` | Usuarios, perfiles |
| `Badge` | Estados, tags |
| `Skeleton` | Loading states |
| `Toast` | Notificaciones |
| `Tabs` | Navegación en contexto |

**Para cada pantalla especificar:**
1. Componentes SK a usar (con variantes si aplica)
2. Componentes nuevos a crear (con `CMP-XXX`)
3. Estados de la pantalla (loading, empty, error, data)

---

## 7. Flujos con Mermaid

**Mínimo 3 flujos críticos. Formato:**

```markdown
### FLW-001: [Nombre del Flujo]

**Descripción:** [Qué logra el usuario]
**Personas:** P-001, P-002
**Stories:** US-003 → US-005

\`\`\`mermaid
graph TD
    A[SCR-001: Login] -->|credentials| B{Valid?}
    B -->|Sí| C[SCR-002: Dashboard]
    B -->|No| D[Error: Invalid credentials]
    D --> A
\`\`\`

**Estados:**
- Happy path: [descripción]
- Error: [cómo se maneja]
- Edge case: [casos especiales]
```

---

## 8. Architect Gating

**Invocar `/consult-architect` cuando:**

| Trigger | Ejemplo |
|---------|---------|
| Offline-first UI | Cache strategy, sync |
| Realtime features | WebSockets vs polling |
| Complex state management | Global state, URL state |
| Performance-critical screens | Virtualization, lazy loading |
| Multi-step wizards | State persistence |

**Formato:**
```markdown
🏛️ **Consulta Architect necesaria**

**Pantalla/Flujo:** [SCR/FLW-XXX]
**Decisión:** [qué decidir sobre UI architecture]
**Opciones:** A/B con tradeoffs
```

---

## 9. Estructura Mínima del 09_DESIGN.md

```markdown
# Design Specification — {{PROJECT_NAME}}

> Generado desde Discovery Brief y Docs por `/design`
> **Fuente:** docs/planning/00-05
> **SSOT:** Este doc → código UI

---

## 📱 Mapa de Pantallas

| ID | Pantalla | URL | Propósito | Acceso |
|----|----------|-----|-----------|--------|
| SCR-001 | Login | `/login` | ... | Público |

---

## 🧭 Navegación

[Estructura + permisos]

---

## 🔄 Flujos Principales

### FLW-001: [Nombre]
[Mermaid + estados]

---

## 🧩 Componentes por Pantalla

### SCR-001: Login
- SK: Form, Input, Button
- Nuevo: —
- Estados: loading, error, success

---

## 📊 Data Requirements

| Pantalla | Data | Server Action | Cache |
|----------|------|---------------|-------|

---

## 📋 Decisiones de Diseño

| ID | Decisión | Opciones | Elegida | Razón |
|----|----------|----------|---------|-------|
| DD-001 | ... | A/B | A | ... |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ... | Alto/Med/Bajo | ... |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | ... | ... |

---

## ✅ Checklist Pre-Backlog

- [ ] Todas las pantallas mapeadas (SCR-XXX)
- [ ] Mínimo 3 flujos documentados (FLW-XXX)
- [ ] Componentes SK identificados por pantalla
- [ ] Componentes nuevos listados (CMP-XXX)
- [ ] Data requirements definidos
- [ ] Estados por pantalla considerados
- [ ] Cross-refs a P/US/BR/E

---

*Generado por TimeKast Factory — /design*
```

---

## 10. Reglas Duras

**SIEMPRE:**
1. Verificar que 01_USER_PERSONAS.md y 02_USER_STORIES.md existen
2. Mapear TODAS las pantallas del MVP con IDs (SCR-XXX)
3. Documentar mínimo 3 flujos críticos con Mermaid (FLW-XXX)
4. Identificar componentes SK para cada pantalla
5. Cross-reference P-XXX, US-XXX, BR-XXX, E-XXX
6. Definir estados por pantalla (loading, empty, error, data)
7. Declarar Open Questions y Assumptions

**NUNCA:**
1. Inventar pantallas no derivadas de Discovery/Stories
2. Diseñar sin docs 01-02 existentes
3. Ignorar componentes del Starter Kit
4. Saltar data requirements
5. Omitir estados de error

---

## 11. Handoff

Al completar:

```markdown
## ✅ Design Completado

**Proyecto:** [nombre]
**Pantallas:** SCR-001 → SCR-XXX ([N] total)
**Flujos:** FLW-001 → FLW-XXX ([M] total)
**Componentes nuevos:** CMP-001 → CMP-XXX ([K] total)

**Artefacto:**
- `docs/planning/09_DESIGN.md`

**Open Questions:** [X pendientes]
**Assumptions:** [Y declarados]

**Próximo paso:** `/backlog` para generar issues.
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
Discovery Brief → docs (01-08) → 09_DESIGN → backlog → code
```

---

## 🔗 Colaboración

| Con | Cuándo | Acción |
|-----|--------|--------|
| **docs** | Input para design | Recibir handoff de 01-08 |
| **backlog** | Design completo | Handoff a `/backlog` |
| **ui** | Componentes y patterns | Consultar `domains/ui/SKILL.md` |
| **architect** | UI architecture decisions | Escalar `/consult-architect` |

---

_TimeKast Factory — Design Expert Skill_
