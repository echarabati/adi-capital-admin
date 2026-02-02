# Validation: /docs Phase

> Valida documentos 01-05 contra Discovery Brief y Proposal.

---

## Pre-Generation Checklist

Antes de generar docs, verificar:

| #   | Check                                  | Cómo validar                                |
| --- | -------------------------------------- | ------------------------------------------- |
| 1   | Discovery Brief existe                 | `ls docs/planning/00_DISCOVERY_BRIEFING.md` |
| 2   | Secciones core completas (§1,§2,§3,§6) | Grep por `✅` en Coverage Map               |
| 3   | Proposal aprobada (si existe)          | Check `Status: Approved`                    |

---

## Post-Generation Validation

Después de generar, verificar:

### Feature Map (01)

| #   | Check                               | Status |
| --- | ----------------------------------- | ------ |
| 1   | Features alineados con §3 del Brief | ✅/❌  |
| 2   | Non-goals declarados                | ✅/❌  |
| 3   | IDs asignados (FT-XXX)              | ✅/❌  |

### User Personas (02)

| #   | Check                               | Status |
| --- | ----------------------------------- | ------ |
| 1   | Personas coinciden con §2 del Brief | ✅/❌  |
| 2   | JTBD definidos por persona          | ✅/❌  |
| 3   | IDs asignados (P-XXX)               | ✅/❌  |

### User Stories (03)

| #   | Check                                    | Status |
| --- | ---------------------------------------- | ------ |
| 1   | Stories cubren todos los features del 01 | ✅/❌  |
| 2   | Cada story referencia persona (P-XXX)    | ✅/❌  |
| 3   | IDs asignados (US-XXX)                   | ✅/❌  |
| 4   | AC definidos (preferible Gherkin)        | ✅/❌  |

### Business Rules (04)

| #   | Check                             | Status |
| --- | --------------------------------- | ------ |
| 1   | Reglas alineadas con §6 del Brief | ✅/❌  |
| 2   | RBAC matrix presente              | ✅/❌  |
| 3   | IDs asignados (BR-XXX)            | ✅/❌  |

### Data Model (05)

| #   | Check                                | Status |
| --- | ------------------------------------ | ------ |
| 1   | Entidades soportan todas las stories | ✅/❌  |
| 2   | Relaciones declaradas                | ✅/❌  |
| 3   | Schema Drizzle syntax                | ✅/❌  |
| 4   | IDs asignados (E-XXX)                | ✅/❌  |

---

## Gap Types

| Gap                        | Severidad   | Acción               |
| -------------------------- | ----------- | -------------------- |
| Feature en Brief sin Story | 🔴 Critical | Agregar story        |
| Persona sin JTBD           | 🟡 Warning  | Documentar o agregar |
| Regla sin ID               | 🟢 Info     | Asignar ID           |
| Story sin AC               | 🔴 Critical | Agregar AC           |

---

_TimeKast Factory — Validation Skill_
