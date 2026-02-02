# Validation: /implement Phase

> Valida issue contra docs, backlog, y DoR antes de implementar.

---

## Pre-Implementation Validation (DoR)

| #   | Check                                      | Status |
| --- | ------------------------------------------ | ------ |
| 1   | Issue existe y está en Backlog/In Progress | ✅/❌  |
| 2   | Issue tiene título con ID                  | ✅/❌  |
| 3   | Issue tiene AC verificables                | ✅/❌  |
| 4   | Issue tiene prioridad asignada             | ✅/❌  |
| 5   | Issue tiene Epic asociado                  | ✅/❌  |
| 6   | API Contract presente (si server action)   | ✅/❌  |
| 7   | Dependencias completadas                   | ✅/❌  |
| 8   | No contradice issues previos               | ✅/❌  |

---

## Cross-Reference Validation

| #   | Check                                        | Status |
| --- | -------------------------------------------- | ------ |
| 1   | Screen (SCR-XXX) existe en 06_DESIGN         | ✅/❌  |
| 2   | Story (US-XXX) existe en 03_USER_STORIES     | ✅/❌  |
| 3   | Entidades (E-XXX) existen en 05_DATA_MODEL   | ✅/❌  |
| 4   | Reglas (BR-XXX) existen en 04_BUSINESS_RULES | ✅/❌  |

---

## Implementation Alignment

| #   | Check                                   | Status |
| --- | --------------------------------------- | ------ |
| 1   | Schema implementado coincide con E-XXX  | ✅/❌  |
| 2   | Validaciones implementan BR-XXX         | ✅/❌  |
| 3   | UI implementa SCR-XXX                   | ✅/❌  |
| 4   | API Contract implementado correctamente | ✅/❌  |

---

## Post-Implementation Validation (DoD)

| #   | Check                          | Status |
| --- | ------------------------------ | ------ |
| 1   | Todos los AC cumplidos         | ✅/❌  |
| 2   | typecheck pass                 | ✅/❌  |
| 3   | lint pass                      | ✅/❌  |
| 4   | build pass                     | ✅/❌  |
| 5   | tests pass                     | ✅/❌  |
| 6   | Implementation Notes agregadas | ✅/❌  |
| 7   | QC Report generado             | ✅/❌  |
| 8   | Usuario aprobó cierre          | ✅/❌  |

---

## Gap Types

| Gap                               | Severidad   | Acción                |
| --------------------------------- | ----------- | --------------------- |
| Issue sin AC                      | 🔴 Critical | STOP — agregar AC     |
| Referencia inexistente (US/SCR/E) | 🔴 Critical | STOP — verificar refs |
| Dependencia no completada         | 🔴 Critical | STOP — completar deps |
| Schema desalineado                | 🟡 Warning  | Documentar desviación |
| API Contract no cumplido          | 🔴 Critical | Fix antes de cerrar   |
| AC incompletos                    | 🔴 Critical | No cerrar issue       |

---

## Validation Output

```markdown
## 🔍 Pre-Implementation Validation: {ISSUE-ID}

**DoR Status:** ✅ Ready / ❌ Not Ready

### Checks

| #   | Check               | Status               |
| --- | ------------------- | -------------------- |
| 1   | AC definidos        | ✅                   |
| 2   | API Contract        | ✅                   |
| 3   | Referencias válidas | ❌ SCR-999 no existe |

### Action Required

- [ ] Fix SCR-999 reference
```

---

_TimeKast Factory — Validation Skill_
