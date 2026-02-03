# Validation: /design Phase

> Valida Design (09) contra Docs 01-08.

---

## Pre-Generation Checklist

| # | Check | Cómo validar |
|---|-------|--------------|
| 1 | Docs 01-08 existen | `ls docs/planning/0[1-8]_*.md` |
| 2 | User Stories tienen IDs (03) | Grep por `US-XXX` |
| 3 | Data Model tiene entidades (05) | Grep por `E-XXX` |
| 4 | Architecture existe (06) | `ls docs/planning/06_*.md` |
| 5 | API Contracts existe (07) | `ls docs/planning/07_*.md` |

---

## Post-Generation Validation

### Screens (SCR)
| # | Check | Status |
|---|-------|--------|
| 1 | Cada persona (P-XXX) tiene al menos 1 screen | ✅/❌ |
| 2 | Screens cubren todas las stories críticas | ✅/❌ |
| 3 | IDs asignados (SCR-XXX) | ✅/❌ |

### Flows (FLW)
| # | Check | Status |
|---|-------|--------|
| 1 | Flujos críticos documentados | ✅/❌ |
| 2 | Entry/exit points claros | ✅/❌ |
| 3 | IDs asignados (FLW-XXX) | ✅/❌ |

### Components (CMP)
| # | Check | Status |
|---|-------|--------|
| 1 | Componentes reutilizables identificados | ✅/❌ |
| 2 | Props/variants documentados | ✅/❌ |
| 3 | IDs asignados (CMP-XXX) | ✅/❌ |

### Cross-References
| # | Check | Status |
|---|-------|--------|
| 1 | Screens referencian stories (US-XXX) | ✅/❌ |
| 2 | Screens referencian entidades (E-XXX) | ✅/❌ |
| 3 | Flujos referencian screens (SCR-XXX) | ✅/❌ |

---

## Coverage Check

```markdown
## 📊 Design Coverage

| Stories | En Design? |
|---------|------------|
| US-001 | ✅ SCR-001 |
| US-002 | ✅ SCR-002, FLW-001 |
| US-003 | ❌ MISSING |
```

**Si hay US-XXX sin cobertura:** 🔴 Critical gap

---

## Gap Types

| Gap | Severidad | Acción |
|-----|-----------|--------|
| Story sin screen | 🔴 Critical | Agregar screen |
| Screen sin story | 🟡 Warning | Verificar necesidad |
| Flujo crítico sin diseño | 🔴 Critical | Documentar flujo |
| Componente sin props | 🟢 Info | Completar spec |

---

_TimeKast Factory — Validation Skill_
