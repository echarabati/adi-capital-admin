# E09 — EPIC-INTEGRACIONES: Drive + Firebase

> **Milestone:** v1.0
> **Status:** 📋 Planning
> **Issues:** 7 total (0 done)
> **Priority:** P1

---

## Objetivo

Implementar integración con Google Drive para documentos y sincronización a Firebase para app móvil.

## Issues

| ID                                                   | Título                       | Priority | Effort | Status |
| ---------------------------------------------------- | ---------------------------- | -------- | ------ | ------ |
| [SYNC-001](../issues/SYNC-001-firebase-setup.md)     | Firebase Admin SDK setup     | P1       | M      | 📋     |
| [SYNC-002](../issues/SYNC-002-sync-movimientos.md)   | Sync movimientos a Firestore | P1       | L      | 📋     |
| [SYNC-003](../issues/SYNC-003-sync-noticias.md)      | Sync noticias a Firestore    | P2       | S      | 📋     |
| [DRIVE-001](../issues/DRIVE-001-drive-setup.md)      | Drive API setup              | P1       | M      | 📋     |
| [DRIVE-002](../issues/DRIVE-002-drive-navigator.md)  | CMP-005: DriveNavigator      | P1       | L      | 📋     |
| [DRIVE-003](../issues/DRIVE-003-currency-input.md)   | CMP-006: CurrencyInput       | P1       | S      | 📋     |
| [DRIVE-004](../issues/DRIVE-004-upload-documento.md) | Upload de Documentos         | P0       | M      | 📋     |

## Dependencias

- **Requiere:** E06 (MOVIMIENTOS)
- **Bloquea:** —

## Scope

**Incluido:**

- SCR-070
- FT-030 (Firebase), FT-031 (Drive), FT-032 (Sync)
- US-080, US-081, US-086 → US-089
- CMP-005, CMP-013
- ADR-003, ADR-005

**Excluido:**

- Offline PWA (Post-MVP)

## Wireframes

- [SCR-070_drive_navigator.png](../../wireframes/SCR-070_drive_navigator.png)

## Referencias

- [06_ARCHITECTURE.md - ADR-003, ADR-005](../../planning/06_ARCHITECTURE.md)
- [09_DESIGN.md - FLW-004](../../planning/09_DESIGN.md#flw-004)

---

_Epic E09 — Backlog v1.0 — Actualizado: 2026-02-03_
