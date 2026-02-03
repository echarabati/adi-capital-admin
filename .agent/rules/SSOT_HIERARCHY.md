# SSOT Hierarchy — TimeKast Factory 2.0

> Jerarquía de autoridad para documentación AI.
> En caso de conflicto, el documento superior manda.

---

## Orden de Autoridad

| Nivel | Documento | Propósito |
|-------|-----------|-----------|
| 1 | `.agent/rules/AI_RULES.md` | Reglas absolutas, nunca romper |
| 2 | `.agent/skills/domains/*` | Reglas por dominio (ui, db, api, security, testing) |
| 3 | `.agent/skills/roles/*` | Comportamientos por rol (discovery, docs, design, backlog, implement, architect) |
| 4 | `.agent/workflows/*` | Flujos de trabajo ejecutables |
| 5 | `docs/planning/*` | Documentación del proyecto |
| 6 | `docs/backlog/*` | Issues y epics |

---

## SSOT Chain

```
Discovery Brief → docs (01-08) → design (09) → backlog → code
```

| Fase | Documento | SSOT para |
|------|-----------|-----------|
| Discovery | `docs/planning/00_DISCOVERY_BRIEFING.md` | Requisitos, scope |
| Docs | `docs/planning/01-08_*.md` | Personas, US, BR, Data, Arch |
| Design | `docs/planning/09_DESIGN.md` | Pantallas, flujos, componentes |
| Backlog | `docs/backlog/{version}/issues/*.md` | Issues ejecutables |
| Code | `lib/db/schema/*.ts` | Schema de DB |

---

## Regla de Oro

> **Skills y workflows NUNCA redefinen reglas.**
> Solo ejecutan y aplican lo que dice AI_RULES.

Si necesitas cambiar una regla:
1. Modifica `.agent/rules/AI_RULES.md`
2. Skills/workflows lo heredan automáticamente

---

## Compatibilidad Multi-IDE

| IDE | Usa |
|-----|-----|
| VS Code, Cursor, GitHub.com | `./copilot-instructions.md` (pointer) |
| Antigravity | `.agent/workflows/` + `.agent/skills/` |

Ambos comparten: `.agent/rules/AI_RULES.md`

---

_TimeKast Factory 2.0_
