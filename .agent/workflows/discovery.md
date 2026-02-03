---
description: Product discovery - understand problem, gather requirements, generate Discovery Brief
---

# /discovery — Product Discovery

> Actúa como **Discovery Expert** para entender el proyecto antes de desarrollo.
> Objetivo: producir un **Discovery Brief** listo para `/docs`.
> Modo: conversacional + documentación. No inventa requisitos.

---

## Phase 0: Discovery Mode

**Primero verificar si hay Brief:**

// turbo
```bash
ls docs/planning/00_DISCOVERY_BRIEFING.md 2>/dev/null && echo "✅ Brief existe" || echo "❌ No hay Brief"
```

**Si NO existe brief:**
> No hay Discovery Brief. Iniciando nuevo discovery...
→ Saltar a Phase 1

**Si SÍ existe brief:**

```markdown
## 🔍 Discovery Mode

| # | Modo | Descripción |
|---|------|-------------|
| 1 | **profundizar** | Mejorar el brief actual con más feedback |
| 2 | **revisar** | Ver brief actual sin modificar |
| 3 | **nuevo** | Descartar y empezar de cero |

**¿Qué quieres hacer?** (1-3)

> 💡 Puedes dar feedback: "profundizar en usuarios target"
> 💡 Usa `/discovery nuevo` para saltar esta pregunta.
```

### 0.1 🛑 STOP — Esperar Selección de Modo

> ⚠️ **MANDATORY STOP**: Usa `notify_user` con `BlockedOnUser: true` 
> para mostrar las opciones y ESPERAR la respuesta del usuario.
> 
> **NO continúes a Phase 1 sin respuesta explícita.**

❌ **PROHIBIDO:**
- Continuar si no hay respuesta del usuario
- Inventar respuestas ("user selects option 1")
- Asumir modo por defecto

**Si el usuario ya especificó modo** (ej: `/discovery nuevo`), saltar este stop.

---

## Phase 1: Context Loading

// turbo
```bash
cat ./.agent/rules/AI_RULES.md
```

// turbo
```bash
cat ./.agent/skills/roles/discovery/SKILL.md
```

// turbo
```bash
ls -la ./docs/planning/ 2>/dev/null || echo "No planning docs yet"
```

---

## Phase 1.5: Input Contract (D0 Quick Start)

Si es **D0** (desde cero), pedir estos 6 campos mínimos para acelerar:

```markdown
## 📋 Quick Start (D0)

Por favor proporciona:

1. **Nombre del proyecto:** ___
2. **Stakeholder/cliente:** ___
3. **Deadline (si existe):** ___
4. **Usuarios/roles (alto nivel):** ___
5. **Integraciones conocidas:** ___ (Stripe, Resend, etc.)
6. **Plataformas:** Web / PWA / Mobile / ___
7. **Idioma preferido:** ___ (es-MX, en-US, etc.)
8. **Terminología específica:** ¿Hay términos de tu industria que debamos usar?
   - Ejemplo: "Partida" en lugar de "línea de cotización"
   - ___
```

> **Nota:** La terminología se guardará en `project-config.md` > `client_context` para uso consistente.

> Si es D1/D2, saltar y usar Coverage Map directamente.

---

## Phase 2: Coverage Map (D1/D2)

Si hay documentación existente, construir tabla de cobertura:

```markdown
## 📊 Coverage Map

| # | Sección | Estado | Notas |
|---|---------|--------|-------|
| §1 | Idea General | ✅/🟡/🔴/⚪ | |
| §2 | Usuarios y Roles | ✅/🟡/🔴/⚪ | |
| §3 | Funcionalidades Core | ✅/🟡/🔴/⚪ | |
| §4 | Modelo de Datos | ✅/🟡/🔴/⚪ | |
| §5 | Integraciones | ✅/🟡/🔴/⚪ | |
| §6 | Reglas de Negocio | ✅/🟡/🔴/⚪ | |
| §7 | UI/UX | ✅/🟡/🔴/⚪ | |
| §8 | Infraestructura | ✅/🟡/🔴/⚪ | |
| §9 | Branding | ✅/🟡/🔴/⚪ | |
| §10 | Mobile/PWA | ✅/🟡/🔴/⚪ | |

**Coverage:** X/10 completas
**Necesita preguntas:** [lista de 🟡 y 🔴]
```

---

## Phase 3: Interview Loop

**Reglas:**
- Preguntar solo lo que falta (🟡 y 🔴)
- Máximo 3 preguntas por turno
- Resumir y confirmar antes de avanzar

**Orden recomendado:**
```
§1 → §2 → §3 → §6 → §4 → §5 → §7 → §8 → §10 → §9
```
(Problema/roles/features/reglas primero porque definen todo)

**Para D0:** Empezar con:
```
"Vamos a completar 10 secciones para entender tu proyecto.
Empecemos por §1 — Idea General.

En 2-3 oraciones, ¿qué hace tu app y para quién?"
```

---

## Phase 4: Architect Gating

**Detectar triggers de escalamiento:**

| Trigger | Por qué escalar |
|---------|-----------------|
| Multi-tenant / RBAC complejo | Arquitectura significativamente diferente |
| Offline parcial/completo | PWA + sync strategy |
| Integraciones críticas | Webhooks, idempotency, retries |
| Reglas core con alto costo de reversión | Decisión de arquitectura temprana |
| Timeline agresivo vs scope grande | Tradeoffs necesarios |
| Compliance (GDPR, datos financieros) | Security architecture |

**Si aplica:**

```markdown
🏛️ **Consulta Architect necesaria**

**Contexto:** [resumen]
**Decisión:** [qué decidir]
**Opciones:** A/B con tradeoffs

→ Invocar `/consult-architect`
```

---

## 🛑 CHECKPOINT: Pre-Artifact Generation

> **MANDATORY STOP — USAR notify_user TOOL**
>
> El agente DEBE llamar a `notify_user` con:
> - `BlockedOnUser: true`
> - `Message`: Coverage map + gaps
>
> **NO EJECUTAR MÁS HERRAMIENTAS SIN RESPUESTA DEL USUARIO.**

**Resumen para usuario:**
- Coverage: X/10 secciones
- Gaps críticos: [lista o ninguno]
- Architect gating: [si aplica]

**Opciones:**

| # | Opción | Acción |
|---|--------|--------|
| 1 | **generar** | Crear Discovery Brief |
| 2 | **profundizar** | Más preguntas en sección específica |
| 3 | **cancelar** | Salir |

**¿Qué quieres hacer?** (1-3)

**ACTION:** Call `notify_user` NOW with `BlockedOnUser=true`.

---

## Phase 5: Generate Artifacts

Al completar (80%+ en ✅ o ⚪):

**1. Crear Discovery Brief:**
```bash
mkdir -p ./docs/planning
cp ./.agent/skills/roles/discovery/00_DISCOVERY_BRIEFING.template.md ./docs/planning/00_DISCOVERY_BRIEFING.md
```

**2. Crear Project Config:**
```bash
cp ./.agent/skills/roles/discovery/project-config.template.md ./.agent/project-config.md
```

**3. Llenar ambos documentos:**
Reemplazar todos los `{{PLACEHOLDERS}}` con información recopilada.

**SSOT Outputs:**
```
docs/planning/00_DISCOVERY_BRIEFING.md  ← Brief completo
.agent/project-config.md              ← Config del proyecto
```

> El Brief incluye: Coverage Map, 10 secciones, Scope Boundaries, Open Questions, Riesgos.
> El Config incluye: Stack, skills activos, comandos, integraciones.

---

## Gates/Escalation

| Trigger | Acción |
|---------|--------|
| Cambio de scope > 30% | → `/consult-architect` |
| Dominio técnico desconocido | → Investigar antes de continuar |
| Dependencies externas críticas | → Documentar riesgos + continuar |

---

## Stop Conditions

| Condición | Severidad | Acción |
|-----------|-----------|--------|
| §1 (Idea General) 🔴 | P0 | 🛑 STOP — Completar discovery |
| §2 (Usuarios) 🔴 | P0 | 🛑 STOP — Completar discovery |
| §3 (Features Core) 🔴 | P0 | 🛑 STOP — Completar discovery |
| §6 (Reglas de Negocio) 🔴 | P0 | 🛑 STOP — Completar discovery |
| Contradicción no resuelta | P1 | 🛑 STOP — Resolver antes de avanzar |
| Offline/Multi-tenant sin decisión | P1 | 🛑 STOP — `/consult-architect` primero |

---

## Phase 6: Handoff

```markdown
## ✅ Discovery Completado

**Proyecto:** [nombre]
**Coverage:** [X/10 secciones]
**Gaps críticos:** Resueltos

**Artefacto:**
- `docs/planning/00_DISCOVERY_BRIEFING.md`

**Próximo paso:** `/docs` para generar documentación técnica.
```

---

## Flujo Completo

```
/start → /discovery → /docs → /design → /backlog → /implement → /audit
```

---

## Shortcuts

```bash
/discovery D0    # Desde cero
/discovery D1    # Con docs existentes
/discovery D2    # Validar Brief existente
/discovery       # Pregunta el modo
```

---

_TimeKast Factory — Discovery Workflow_
