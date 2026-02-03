---
description: Generate client-facing proposal document from Discovery Brief
---

# /proposal — Client Proposal Generation

> Genera un documento de propuesta listo para presentar al cliente.
> Ejecutar **después de /discovery** y **antes de /docs**.
>
> **Output:** `docs/proposal/PROPOSAL.md`

---

## Flujo Completo

```
/discovery → /proposal → [CLIENTE APRUEBA] → /docs → /design → /backlog → /implement
                ↑
         GATE DE APROBACIÓN
```

---

## Phase 0: Pre-check

**Verificar que existe Discovery Brief:**

// turbo
```bash
if [ -f "./docs/planning/00_DISCOVERY_BRIEF.md" ]; then
  echo "✅ Discovery Brief encontrado"
else
  echo "❌ No existe Discovery Brief"
  echo "   Ejecuta /discovery primero"
  exit 1
fi
```

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

**Workflow:** /proposal
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

## Phase 1: Load Context

// turbo
```bash
cat ./.agent/rules/AI_RULES.md
```

// turbo
```bash
cat ./.agent/skills/roles/proposal/SKILL.md
```

// turbo
```bash
# Discovery Brief como fuente principal
cat ./docs/planning/00_DISCOVERY_BRIEF.md
```

// turbo
```bash
# Client context si existe
cat ./.agent/project-config.md 2>/dev/null | grep -A 30 "client_context" || echo "No client_context defined"
```

## Phase 1.5: Load Validation Skill

> ⚠️ **OBLIGATORIO** — Cargar validation antes de analizar.

// turbo
```bash
cat ./.agent/skills/domains/validation/proposal.md
```

---

## Phase 2: Validate Discovery Brief

> 🛑 **MANDATORY VALIDATION — EJECUTAR ANTES DE CONTINUAR**
>
> El agente **DEBE** validar estos checks. Si alguno falla → STOP inmediato.
> **NO HAY EXCEPCIONES.**

### 2.1 Verificar Coverage Map

// turbo
```bash
# Verificar que las secciones core están completas
echo "🔍 Validando Coverage Map del Discovery Brief..."
echo ""

# Check §1 (Idea)
if grep -q "§1.*✅" ./docs/planning/00_DISCOVERY_BRIEF.md 2>/dev/null || \
   grep -q "§1.*:.*check" ./docs/planning/00_DISCOVERY_BRIEF.md 2>/dev/null; then
  echo "✅ §1 (Idea): Completa"
else
  echo "❌ §1 (Idea): INCOMPLETA"
fi

# Check §2 (Usuarios)
if grep -q "§2.*✅" ./docs/planning/00_DISCOVERY_BRIEF.md 2>/dev/null || \
   grep -q "§2.*:.*check" ./docs/planning/00_DISCOVERY_BRIEF.md 2>/dev/null; then
  echo "✅ §2 (Usuarios): Completa"
else
  echo "❌ §2 (Usuarios): INCOMPLETA"
fi

# Check §3 (Features)
if grep -q "§3.*✅" ./docs/planning/00_DISCOVERY_BRIEF.md 2>/dev/null || \
   grep -q "§3.*:.*check" ./docs/planning/00_DISCOVERY_BRIEF.md 2>/dev/null; then
  echo "✅ §3 (Features): Completa"
else
  echo "❌ §3 (Features): INCOMPLETA"
fi
```

### 2.2 Evaluar Resultado

**Si hay algún ❌ en §1, §2, o §3:**

```markdown
🛑 **STOP — Discovery Brief Incompleto**

Las siguientes secciones están incompletas:
- [listar secciones faltantes]

**Acción requerida:** Ejecutar `/discovery` y completar las secciones antes de generar propuesta.
```

**ACTION:** Call `notify_user` NOW with `BlockedOnUser=true`. **NO CONTINUAR.**

---

### 2.3 Análisis del Brief (solo si todas las secciones están ✅)

**Extraer del Discovery Brief:**

1. **Objetivo principal** del cliente
2. **Usuarios/roles** identificados
3. **Flujos clave** mencionados
4. **Restricciones** explícitas
5. **Métricas de éxito** esperadas
6. **Términos del dominio** usados por el cliente

---

## 🛑 CHECKPOINT 1: Confirmación de Entendimiento

> ⚠️ **MANDATORY STOP — NO CONTINUAR SIN APROBACIÓN**

**Mostrar al usuario:**

```md
## 📋 Resumen de Discovery para Propuesta

**Objetivo detectado:**
- [1-2 líneas]

**Usuarios/Roles:**
- [lista]

**Flujo principal:**
- [3-5 pasos alto nivel]

**Alcance sugerido MVP:**
- [3-5 items principales]

**¿Proceder con la generación de propuesta?** (1-2)

| # | Opción | Acción |
|---|--------|--------|
| 1 | **Sí** | Generar PROPOSAL.md |
| 2 | **Ajustar** | Corregir entendimiento primero |
```

**ACTION:** Call `notify_user` NOW with `BlockedOnUser=true`.

---

## Phase 3: Generate Proposal

**Crear directorio si no existe:**
```bash
mkdir -p ./docs/proposal
```

**Generar documento siguiendo template del SKILL.md:**

1. Usar estructura exacta del SKILL
2. Aplicar todas las reglas (sin tecnicismos, sin precios)
3. Usar términos de `client_context` si existen
4. Marcar supuestos explícitamente

**Guardar en:** `docs/proposal/PROPOSAL.md`

---

## Phase 4: Quality Check

**Verificar antes de entregar:**

// turbo
```bash
if [ -f "./docs/proposal/PROPOSAL.md" ]; then
  echo "📄 PROPOSAL.md generado"
  echo ""
  echo "🔍 Quick validation:"
  
  # Check for technical terms that shouldn't be there
  TECH_TERMS=$(grep -iE "API|endpoint|database|schema|deploy|Next.js|React|PostgreSQL|Drizzle" ./docs/proposal/PROPOSAL.md | wc -l)
  if [ "$TECH_TERMS" -gt 0 ]; then
    echo "  ⚠️ Found $TECH_TERMS lines with technical terms - review needed"
  else
    echo "  ✅ No technical jargon detected"
  fi
  
  # Check for price mentions
  PRICE_TERMS=$(grep -iE "\\$|USD|MXN|precio|costo|presupuesto|cotización" ./docs/proposal/PROPOSAL.md | wc -l)
  if [ "$PRICE_TERMS" -gt 0 ]; then
    echo "  ⚠️ Found $PRICE_TERMS lines with price/cost mentions - should remove"
  else
    echo "  ✅ No pricing information detected"
  fi
  
  # Check structure
  echo ""
  echo "📊 Document sections:"
  grep -E "^## [0-9]" ./docs/proposal/PROPOSAL.md || echo "  Check section numbering"
else
  echo "❌ PROPOSAL.md not created"
fi
```

---

## Phase 4.5: Análisis de Cobertura (Drift/Gap Detection)

> 🔍 **OBLIGATORIO** — Comparar lo generado contra el Discovery Brief.
>
> El agente DEBE analizar si la propuesta cubre TODO lo que dice el Discovery.
> Este análisis se presenta al usuario ANTES del checkpoint final.

### 4.5.1 Ejecutar Análisis

**El agente debe comparar manualmente:**

1. **Cargar Discovery Brief** (ya está en contexto)
2. **Cargar PROPOSAL.md generado**
3. **Para cada sección del Discovery, verificar cobertura en Proposal:**

| Sección Discovery | Buscar en Proposal |
|-------------------|-------------------|
| §1 (Idea/Objetivo) | Sección 1-2: Resumen + Objetivos |
| §2 (Usuarios) | Sección 4: Usuarios y Roles |
| §3 (Features) | Sección 3 + 6: Solución + Alcance MVP |
| §5 (Restricciones) | Sección 7: Supuestos y Decisiones |
| §6 (Reglas) | Implícito en flujos y alcance |

### 4.5.2 Generar Reporte de Cobertura

**Formato OBLIGATORIO del análisis:**

```markdown
## 🔍 Análisis de Cobertura: PROPOSAL vs Discovery Brief

### ✅ Cubierto Correctamente
| # | Elemento del Discovery | Donde aparece en Proposal |
|---|------------------------|---------------------------|
| 1 | [Objetivo X] | Sección 2, bullet 1 |
| 2 | [Usuario Y] | Sección 4, tabla row 2 |
| 3 | [Feature Z] | Sección 6, MVP item 3 |

### ❌ Gaps Detectados (Falta en Proposal)
| # | En Discovery Brief | Severidad | Recomendación |
|---|-------------------|-----------|---------------|
| 1 | [Elemento faltante] | 🔴/🟡 | Agregar en sección X |

### 🔄 Drift Detectado (Diferencias)
| # | Discovery dice | Proposal dice | Acción sugerida |
|---|----------------|---------------|-----------------|
| 1 | [Original] | [Diferente] | Alinear con Discovery |

### 📊 Resumen
- **Cobertura:** X/Y elementos (Z%)
- **Gaps críticos:** N
- **Drift detectado:** M items
```

### 4.5.3 Evaluar Resultado

**Si hay gaps 🔴 Critical:**
- Listar qué falta
- Sugerir dónde agregarlo
- Preguntar si corregir antes de continuar

**Si solo hay 🟡 Warnings:**
- Mostrar análisis
- Continuar a checkpoint con nota

**Si cobertura es 100%:**
- Confirmar alineación completa
- Continuar a checkpoint

---

## 🛑 CHECKPOINT 2: Review Before Delivery

> ⚠️ **MANDATORY STOP — ESPERAR APROBACIÓN**

**Mostrar al usuario:**

```md
## ✅ Propuesta Generada

**Archivo:** `docs/proposal/PROPOSAL.md`

**Validación Técnica:**
- [ ] Sin tecnicismos
- [ ] Sin información de precios
- [ ] Alcance claro (incluye/no incluye)
- [ ] Supuestos marcados

**Análisis de Cobertura:**
- [ ] Cobertura vs Discovery: [X%]
- [ ] Gaps críticos: [N]
- [ ] Drift detectado: [M]

**Opciones:**

| # | Opción | Acción |
|---|--------|--------|
| 1 | **Corregir gaps** | Agregar elementos faltantes |
| 2 | **Revisar** | Abrir documento para revisión |
| 3 | **Aprobar** | Listo para enviar a cliente |

**🛑 STOP AQUÍ — Esperar decisión del usuario**
```

**ACTION:** Call `notify_user` with `BlockedOnUser=true` and `PathsToReview=["docs/proposal/PROPOSAL.md"]`.

---

## Phase 5: Handoff

**Cuando el cliente apruebe:**

1. Documento queda como referencia de alcance aprobado
2. Ejecutar `/docs` usando PROPOSAL.md como input adicional
3. Features en propuesta = features a documentar e implementar

---

## Gates/Escalation

| Trigger | Acción |
|---------|--------|
| Alcance muy grande para MVP | → Sugerir fases |
| Requisitos contradictorios | → Clarificar con cliente |
| Tecnología específica requerida | → `/consult-architect` |

---

## Stop Conditions

| Condición | Severidad | Acción |
|-----------|-----------|--------|
| Discovery Brief no existe | P0 | 🛑 STOP — `/discovery` primero |
| §1 (Idea) está 🔴 o falta | P0 | 🛑 STOP — Completar discovery |
| §2 (Usuarios) está 🔴 o falta | P0 | 🛑 STOP — Completar discovery |
| §3 (Features) está 🔴 o falta | P0 | 🛑 STOP — Completar discovery |
| Cliente no aprueba propuesta | P1 | 🛑 STOP — Ajustar y re-enviar |
| Proposal contiene tecnicismos | P1 | 🟡 WARNING — Reescribir |
| Proposal contiene precios | P1 | 🟡 WARNING — Eliminar |

---

## 🚨 Reglas del Agente (ENFORCEMENT)

> ⚠️ **REGLAS NO NEGOCIABLES — VIOLACIÓN = FALLO CRÍTICO**

### ❌ NUNCA hacer:

1. **NUNCA** generar PROPOSAL.md sin ejecutar Phase 2 (Validate Discovery)
2. **NUNCA** continuar si §1, §2, o §3 están incompletas
3. **NUNCA** omitir los checkpoints MANDATORY STOP
4. **NUNCA** generar propuesta con tecnicismos (Next.js, API, DB, etc.)
5. **NUNCA** incluir precios o costos en la propuesta

### ✅ SIEMPRE hacer:

1. **SIEMPRE** cargar `validation/proposal.md` antes de analizar
2. **SIEMPRE** verificar Coverage Map (§1, §2, §3)
3. **SIEMPRE** llamar `notify_user` con `BlockedOnUser=true` en cada STOP
4. **SIEMPRE** esperar confirmación antes de avanzar a Phase 3
5. **SIEMPRE** ejecutar Quality Check post-generación

### Consecuencias de Violación

Si el agente viola estas reglas:
- El workflow se considera **FALLIDO**
- Reportar al usuario qué regla se violó
- **NO** marcar la propuesta como lista
- Volver a ejecutar desde Phase 2

---

## Shortcuts

```bash
/proposal           # Interactivo (recomendado)
/proposal generate  # Generar directamente si ya hay Discovery
```

---

_TimeKast Starter Kit — Proposal Workflow_

