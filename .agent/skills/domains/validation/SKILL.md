# Validation Skill

> **Dominio:** Quality & Validation
> **Propósito:** Validar documentos contra sus dependencias para detectar gaps entre fases.

---

## Cuándo usar este skill

Invocar validación **antes** de generar output en cada workflow:

| Workflow     | Validar contra         | Archivo        |
| ------------ | ---------------------- | -------------- |
| `/proposal`  | Discovery Brief        | `proposal.md`  |
| `/docs`      | Discovery + Proposal   | `docs.md`      |
| `/design`    | Docs 01-05             | `design.md`    |
| `/backlog`   | Design 06              | `backlog.md`   |
| `/implement` | Issue + Backlog + Docs | `implement.md` |

---

## Cadena de Validación (SSOT)

```
Discovery Brief  → Input del usuario
         ↓
Proposal         → Valida contra Discovery
         ↓
Docs (01-05)     → Valida contra Discovery + Proposal
         ↓
Design (06)      → Valida contra docs anteriores
         ↓
Backlog          → Issues cubren todo el design
         ↓
Implement        → Issue alineado con docs + backlog
```

---

## Cómo usar

### En workflows

````markdown
## Phase X: Validation

// turbo

```bash
cat ./.agent/skills/domains/validation/{phase}.md
```
````

Ejecutar checklist de validación. Si hay ❌, reportar gaps antes de continuar.

````

### Output de validación

```markdown
## 🔍 Validation Report

**Phase:** [docs/design/backlog/implement]
**Status:** ✅ PASS / ❌ FAIL

### Checks

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | [Descripción] | ✅/❌ | [Detalle si falla] |
| 2 | [Descripción] | ✅/❌ | [Detalle si falla] |

### Gaps Encontrados

> Si hay ❌, listar gaps específicos:
- Gap 1: [qué falta]
- Gap 2: [qué falta]

### Acción Recomendada

- [ ] Corregir [X] antes de continuar
- [ ] Agregar [Y] a documento [Z]
````

---

## Severidad de Gaps

| Severidad   | Acción                                  |
| ----------- | --------------------------------------- |
| 🔴 Critical | STOP — No continuar sin resolver        |
| 🟡 Warning  | Documentar en Open Questions, continuar |
| 🟢 Info     | Nota para mejora futura                 |

---

## Archivos del Skill

| Archivo        | Valida                          |
| -------------- | ------------------------------- |
| `discovery.md` | Completitud del Discovery Brief |
| `proposal.md`  | Proposal vs Discovery           |
| `docs.md`      | Docs vs Discovery + Proposal    |
| `design.md`    | Design vs Docs                  |
| `backlog.md`   | Issues vs Design coverage       |
| `implement.md` | Implement vs Issue + Docs       |

---

_TimeKast Factory — Validation Skill_
