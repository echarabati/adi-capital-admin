# Validation: /backlog Phase

> Valida que issues cubran todo el Design (06).

---

## Pre-Generation Checklist

| #   | Check                        | Cómo validar                          |
| --- | ---------------------------- | ------------------------------------- |
| 1   | Design 06 existe             | `ls docs/planning/06_DESIGN.md`       |
| 2   | Screens tienen IDs (SCR-XXX) | Grep                                  |
| 3   | Flujos tienen IDs (FLW-XXX)  | Grep                                  |
| 4   | User Stories existen         | `ls docs/planning/03_USER_STORIES.md` |

---

## Post-Generation Validation

### Coverage: Design → Issues

| #   | Check                                      | Status |
| --- | ------------------------------------------ | ------ |
| 1   | Cada Screen (SCR-XXX) tiene issue(s)       | ✅/❌  |
| 2   | Cada Flujo (FLW-XXX) tiene issue(s)        | ✅/❌  |
| 3   | Cada Story (US-XXX) tiene issue(s)         | ✅/❌  |
| 4   | Componentes nuevos (CMP-XXX) tienen issues | ✅/❌  |

### Issue Quality

| #   | Check                                         | Status |
| --- | --------------------------------------------- | ------ |
| 1   | Issues tienen título con ID (PREFIX-XXX)      | ✅/❌  |
| 2   | Issues tienen metadata (Status, Priority)     | ✅/❌  |
| 3   | Issues tienen AC verificables                 | ✅/❌  |
| 4   | Issues referencian SCR/FLW/US                 | ✅/❌  |
| 5   | Issues con server actions tienen API Contract | ✅/❌  |

### Dependencies

| #   | Check                            | Status |
| --- | -------------------------------- | ------ |
| 1   | P0 issues no dependen de P1/P2   | ✅/❌  |
| 2   | Dependencias circulares ausentes | ✅/❌  |
| 3   | Bloqueadores declarados          | ✅/❌  |

---

## Coverage Matrix

```markdown
## 📊 Backlog Coverage

| Design Item | Issue(s)            |
| ----------- | ------------------- |
| SCR-001     | AUTH-001, AUTH-002  |
| SCR-002     | DASH-001            |
| FLW-001     | AUTH-001 → AUTH-003 |
| US-005      | ❌ MISSING          |
```

**Si hay Design item sin issue:** 🔴 Critical gap

---

## Gap Types

| Gap                            | Severidad   | Acción             |
| ------------------------------ | ----------- | ------------------ |
| Screen sin issue               | 🔴 Critical | Crear issue        |
| Story sin issue                | 🔴 Critical | Crear issue        |
| Issue sin AC                   | 🔴 Critical | Agregar AC         |
| Issue sin referencias          | 🟡 Warning  | Agregar cross-refs |
| Server action sin API Contract | 🔴 Critical | Agregar contract   |

---

_TimeKast Factory — Validation Skill_
