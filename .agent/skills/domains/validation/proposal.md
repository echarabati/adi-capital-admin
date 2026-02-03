# Validation: /proposal Phase

> Valida Proposal contra Discovery Brief ANTES de generar.

---

## 🛑 REGLA DURA — NO GENERAR SIN VALIDAR

> ⚠️ **MANDATORY STOP**
>
> El agente **DEBE** ejecutar este checklist ANTES de generar PROPOSAL.md.
> Si algún check 🔴 falla → **STOP inmediato** → `notify_user` con `BlockedOnUser=true`.
>
> **NO HAY EXCEPCIONES. VIOLACIÓN = FALLO CRÍTICO.**

---

## Pre-Generation Checklist

### 1. Discovery Brief Existe y Está Completo

| # | Check | Cómo validar | Severidad |
|---|-------|--------------|-----------|
| 1 | Discovery Brief existe | `ls docs/planning/00_DISCOVERY_BRIEFING.md` | 🔴 Critical |
| 2 | §1 (Idea) está ✅ | Grep Coverage Map | 🔴 Critical |
| 3 | §2 (Usuarios) está ✅ | Grep Coverage Map | 🔴 Critical |
| 4 | §3 (Features) está ✅ | Grep Coverage Map | 🔴 Critical |

**Si cualquiera es ❌:**
```markdown
🛑 **STOP — Discovery Brief incompleto**

Secciones faltantes: [§X, §Y]
Acción: Ejecutar `/discovery` y completar secciones antes de propuesta.
```

**ACTION:** Call `notify_user` NOW with `BlockedOnUser=true`.

---

### 2. Información Suficiente para Propuesta

| # | Check | Cómo validar | Severidad |
|---|-------|--------------|-----------|
| 5 | Objetivo del proyecto claro | §1 tiene descripción actionable | 🔴 Critical |
| 6 | Al menos 2 usuarios/roles definidos | §2 tiene lista de usuarios | 🟡 Warning |
| 7 | Al menos 3 features core | §3 tiene lista de features | 🔴 Critical |
| 8 | Restricciones conocidas | §5 no está vacío o tiene OQs | 🟢 Info |

---

## Post-Generation Validation

Después de generar PROPOSAL.md, verificar:

| # | Check | Status |
|---|-------|--------|
| 1 | Objetivos alineados con §1 del Brief | ✅/❌ |
| 2 | Usuarios en propuesta coinciden con §2 | ✅/❌ |
| 3 | Features MVP cubren §3 core | ✅/❌ |
| 4 | No incluye tecnicismos (grep check) | ✅/❌ |
| 5 | No incluye precios/costos (grep check) | ✅/❌ |
| 6 | Supuestos explícitos marcados | ✅/❌ |

---

## Gap Types

| Gap | Severidad | Acción |
|-----|-----------|--------|
| Discovery Brief no existe | 🔴 Critical | STOP → `/discovery` |
| §1, §2, o §3 están 🔴 | 🔴 Critical | STOP → completar discovery |
| Objetivo no claro en Brief | 🔴 Critical | STOP → clarificar con usuario |
| Propuesta menciona stack técnico | 🟡 Warning | Reescribir sin tecnicismos |
| Propuesta menciona precios | 🟡 Warning | Eliminar referencias a costos |

---

## Enforcement

> 🚨 **REGLA DE ENFORCEMENT**
>
> Si el agente intenta generar PROPOSAL.md sin haber ejecutado este checklist:
>
> 1. El workflow DEBE fallar
> 2. Reportar violación al usuario
> 3. No guardar ningún archivo
>
> **El checklist es MANDATORY, no opcional.**

---

_TimeKast Factory — Validation Skill_
