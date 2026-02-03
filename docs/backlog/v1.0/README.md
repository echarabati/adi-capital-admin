# 📋 Backlog v1.0 — Adi Capital Admin

> **Proyecto:** Adi Capital Admin
> **Deadline:** 28 febrero 2026
> **Versión:** v1.0 (MVP)
> **Generado:** 2026-02-03
> **Última validación:** 2026-02-03 ✅

---

## 📊 Resumen

| Métrica                | Valor    |
| ---------------------- | -------- |
| Epics                  | 10       |
| Issues                 | 56       |
| Story Points           | ~128 pts |
| Features cubiertos     | 24/24 ✅ |
| User Stories cubiertos | 70/70 ✅ |
| Conceptos MOV          | 18/18 ✅ |
| E2E Test Issues        | 3 ✅     |

---

## 🎯 Story Points Mapping

| Effort | Story Points | Descripción                   |
| ------ | ------------ | ----------------------------- |
| **XS** | 1 pt         | Cambio trivial, < 1 hora      |
| **S**  | 2 pts        | Componente simple, 1-2 horas  |
| **M**  | 3 pts        | Feature estándar, 2-4 horas   |
| **L**  | 5 pts        | Feature complejo, 4-8 horas   |
| **XL** | 8 pts        | Feature muy complejo, 1+ días |

---

## 🗂️ Epics (Orden de Ejecución)

| #   | Epic                                                  | Issues | Pts | Priority | Deps     | Audit Tier      |
| --- | ----------------------------------------------------- | ------ | --- | -------- | -------- | --------------- |
| E01 | [EPIC-SCHEMA](./epics/EPIC-SCHEMA.md)                 | 3      | 9   | P0       | —        | R2              |
| E02 | [EPIC-FONDOS](./epics/EPIC-FONDOS.md)                 | 5+1    | 15  | P0       | E01      | R2 + TEST-001   |
| E03 | [EPIC-PROYECTOS](./epics/EPIC-PROYECTOS.md)           | 5      | 13  | P1       | E02      | R1              |
| E04 | [EPIC-INVERSIONISTAS](./epics/EPIC-INVERSIONISTAS.md) | 5      | 11  | P1       | E02      | R1              |
| E05 | [EPIC-INVERSIONES](./epics/EPIC-INVERSIONES.md)       | 6      | 16  | P1       | E03, E04 | R2              |
| E06 | [EPIC-MOVIMIENTOS](./epics/EPIC-MOVIMIENTOS.md)       | 10+1   | 32  | P0       | E05      | R2 + TEST-002   |
| E07 | [EPIC-CALCULOS](./epics/EPIC-CALCULOS.md)             | 4      | 12  | P1       | E06      | **R2 + Manual** |
| E08 | [EPIC-WIZARD](./epics/EPIC-WIZARD.md)                 | 4+1    | 16  | P1       | E06, E07 | R2 + TEST-003   |
| E09 | [EPIC-INTEGRACIONES](./epics/EPIC-INTEGRACIONES.md)   | 7      | 18  | P1       | E06      | R2              |
| E10 | [EPIC-PANEL](./epics/EPIC-PANEL.md)                   | 4      | 10  | P2       | E02      | R1              |

> **Nota:** +1 indica TEST-\* issue asociado

---

## 🧪 QA Strategy

### Per Issue

```
/implement ISSUE-XXX
    ↓
/qc ISSUE-XXX (~1 min)
    ↓
✅ Done / 🔴 Fix
```

### Per Epic

```
Epic completado
    ↓
/audit R2 (o R1 para E03, E04, E10)
    ↓
✅ Epic Done / 🟡 Fix warnings
```

### Pre-Release

```
Todos los epics Done
    ↓
/audit R3
    ↓
✅ Tag v1.0
```

### E2E Testing Issues

| Issue                                            | Después de | Valida           |
| ------------------------------------------------ | ---------- | ---------------- |
| [TEST-001](./issues/TEST-001-e2e-auth-rbac.md)   | E02        | Auth + RBAC      |
| [TEST-002](./issues/TEST-002-e2e-movimientos.md) | E06        | Movimientos flow |
| [TEST-003](./issues/TEST-003-e2e-wizard.md)      | E08        | Wizard + Cascada |

---

## ✅ Starter Kit Coverage

Los siguientes User Stories ya están implementados en el Starter Kit y **no requieren issues nuevos**:

| US ID  | Título                  | Starter Kit Feature     |
| ------ | ----------------------- | ----------------------- |
| US-103 | Crear Usuario Admin     | Settings → Users (RBAC) |
| US-107 | Asignar Fondo a Usuario | Extendido en SCHEMA-003 |
| US-110 | Instalar como PWA       | PWA Components          |

---

## 📐 Wireframes Disponibles

| SCR     | Pantalla         | File                                                    | Issues               |
| ------- | ---------------- | ------------------------------------------------------- | -------------------- |
| SCR-001 | Dashboard        | [wireframe](../wireframes/SCR-001_dashboard.png)        | DASH-001, DASH-002   |
| SCR-021 | Proyecto Detalle | [wireframe](../wireframes/SCR-021_proyecto_detalle.png) | PROJ-003, PROJ-004   |
| SCR-051 | Form Movimiento  | [wireframe](../wireframes/SCR-051_movimiento_form.png)  | MOV-002→010          |
| SCR-060 | Wizard Reparto   | [wireframe](../wireframes/SCR-060_wizard_reparto.png)   | WIZ-001→004          |
| SCR-070 | Drive Navigator  | [wireframe](../wireframes/SCR-070_drive_navigator.png)  | DRIVE-002, DRIVE-004 |

---

## 📈 Distribución por Prioridad

| Priority          | Issues | Story Points | Epics                        |
| ----------------- | ------ | ------------ | ---------------------------- |
| P0 (blocker)      | 23     | ~56 pts      | E01, E02, E06                |
| P1 (MVP core)     | 29     | ~62 pts      | E03, E04, E05, E07, E08, E09 |
| P2 (nice-to-have) | 4      | ~10 pts      | E10                          |

---

## 🔄 Flujo de Desarrollo

```
E01:SCHEMA ──► E02:FONDOS ──┬──► E03:PROYECTOS ──┐
       └─ TEST-001          │                    │
                            └──► E04:INVERSIONISTAS ──► E05:INVERSIONES ──► E06:MOVIMIENTOS
                            │                                              └─ TEST-002
                            └──► E10:PANEL                                 │
                                                                           ├──► E07:CALCULOS ──► E08:WIZARD
                                                                           │                    └─ TEST-003
                                                                           └──► E09:INTEGRACIONES
```

---

## 📊 Quality Metrics Target

| Métrica                  | Target | Mínimo |
| ------------------------ | ------ | ------ |
| Test Coverage (global)   | 85%    | 80%    |
| Test Coverage (E07)      | 95%    | 90%    |
| Lighthouse Performance   | > 80   | > 70   |
| Lighthouse Accessibility | > 90   | > 85   |
| LCP                      | < 2.5s | < 4s   |

---

## 📚 Referencias

- [00_DISCOVERY_BRIEFING.md](../planning/00_DISCOVERY_BRIEFING.md)
- [01_FEATURE_MAP.md](../planning/01_FEATURE_MAP.md)
- [03_USER_STORIES.md](../planning/03_USER_STORIES.md)
- [07_API_CONTRACTS.md](../planning/07_API_CONTRACTS.md)
- [09_DESIGN.md](../planning/09_DESIGN.md)
- [Wireframes](../wireframes/README.md)

---

## 🛠️ Commands

```bash
# Actualizar tablero
pnpm update-board

# Ver status
ls -la docs/backlog/v1.0/issues/*.md | wc -l

# Run QC
/qc ISSUE-XXX

# Run Audit
/audit R2
```

---

_Generado por TimeKast Factory — /backlog_
_Última actualización: 2026-02-03 (QA Strategy + Story Points)_
