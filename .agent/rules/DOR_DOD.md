# Definition of Ready & Done

> Criterios estándar para issues en proyectos TimeKast Factory.
> **Ubicación:** `.agent/rules/DOR_DOD.md`
> **Cargado por:** `/implement`

---

## Definition of Ready (DoR)

Un issue está **Ready** para implementar cuando tiene:

### Obligatorio

| ✅ | Criterio |
|---|----------|
| [ ] | Título con ID: `PREFIX-XXX: Descripción clara` |
| [ ] | Descripción del problema o feature |
| [ ] | Acceptance Criteria (preferible Gherkin) |
| [ ] | Prioridad asignada (P0/P1/P2/P3) |
| [ ] | Epic asociado |

### Si aplica

| ✅ | Criterio | Cuándo |
|---|----------|--------|
| [ ] | API Contract definido | Issues con Server Actions |
| [ ] | Mockups/wireframes | Issues de UI |
| [ ] | Dependencias identificadas | Issues bloqueados |
| [ ] | ADR asociado | Decisiones de arquitectura |

---

## Definition of Done (DoD)

Un issue está **Done** cuando cumple:

### Código ✅

| ✅ | Criterio | Comando |
|---|----------|---------|
| [ ] | Implementación completa según AC | — |
| [ ] | Sin errores TypeScript | `pnpm typecheck` |
| [ ] | Sin errores lint | `pnpm lint` |
| [ ] | Build exitoso | `pnpm build` |

### Tests ✅

| ✅ | Criterio | Comando |
|---|----------|---------|
| [ ] | Tests unitarios para lógica de negocio | `pnpm test` |
| [ ] | Tests pasan | `pnpm test` |

### Documentación ✅

| ✅ | Criterio |
|---|----------|
| [ ] | JSDoc en funciones públicas nuevas |
| [ ] | Implementation Notes en issue.md |
| [ ] | CHANGELOG entry (si feature visible) |

### Review ✅

| ✅ | Criterio |
|---|----------|
| [ ] | QC Report generado (`/qc`) |
| [ ] | Todas las AC verificadas con evidencia |
| [ ] | Usuario aprueba cierre explícitamente |

---

## Excepciones

| Tipo de Issue | Puede omitir | Razón |
|---------------|--------------|-------|
| **Hotfix P0** | Tests unitarios | Urgencia, agregar después |
| **Spike/PoC** | Tests, Docs | Es investigación |
| **Refactor interno** | CHANGELOG | No afecta usuario |
| **Docs-only** | Build, Tests | Solo documentación |

---

## Validación en Workflow

### Pre-Implementation (DoR Check)

```markdown
## 🔍 DoR Check: {ISSUE-ID}

- [ ] Título con ID correcto
- [ ] Descripción clara
- [ ] AC definidos
- [ ] Prioridad asignada
- [ ] API Contract (si aplica)

**Status:** ✅ Ready / ❌ Not Ready
```

### Pre-Close (DoD Check)

```markdown
## ✅ DoD Check: {ISSUE-ID}

**Código:**
- [x] typecheck pass
- [x] lint pass
- [x] build pass

**Tests:**
- [x] tests pass (X/X)

**Docs:**
- [x] Implementation Notes added

**Review:**
- [x] QC Report generated
- [x] User approved

**Status:** ✅ Done / ❌ Incomplete
```

---

## Regla de Oro

> 🛑 **No implementar issue que no cumpla DoR.**
> 🛑 **No cerrar issue que no cumpla DoD.**

---

_TimeKast Factory — Methodology Rules_
