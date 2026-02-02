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

---

## Phase 2: Analyze Discovery

**Antes de generar, extraer:**

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
  PRICE_TERMS=$(grep -iE "\\\$|USD|MXN|precio|costo|presupuesto|cotización" ./docs/proposal/PROPOSAL.md | wc -l)
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

## 🛑 CHECKPOINT 2: Review Before Delivery

> ⚠️ **MANDATORY STOP — ESPERAR APROBACIÓN**

**Mostrar al usuario:**

```md
## ✅ Propuesta Generada

**Archivo:** `docs/proposal/PROPOSAL.md`

**Validación:**
- [ ] Sin tecnicismos
- [ ] Sin información de precios
- [ ] Alcance claro (incluye/no incluye)
- [ ] Supuestos marcados

**Opciones:**

| # | Opción | Acción |
|---|--------|--------|
| 1 | **Revisar** | Abrir documento para revisión |
| 2 | **Ajustar** | Hacer cambios específicos |
| 3 | **Aprobar** | Listo para enviar a cliente |

**🛑 STOP AQUÍ — Esperar aprobación antes de /docs**
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
| §1-§3 del Brief están 🔴 | P0 | 🛑 STOP — Completar discovery |
| Cliente no aprueba propuesta | P1 | 🛑 STOP — Ajustar y re-enviar |

---

## Shortcuts

```bash
/proposal           # Interactivo (recomendado)
/proposal generate  # Generar directamente si ya hay Discovery
```

---

_TimeKast Starter Kit — Proposal Workflow_
